import { buildImpulseResponse } from './impulse'
import { buildNoiseBed } from './layers/noiseBed'
import { buildDrone, type Drone } from './layers/drone'
import { buildPings, type Pings } from './layers/pings'

type AudioSessionType = 'auto' | 'playback' | 'ambient' | 'transient'

/**
 * iOS routes a page that makes sound *only* through the Web Audio API into
 * the `ambient` audio session, and `ambient` is silenced by the hardware
 * Ring/Silent switch. The graph runs, the analyser reads real signal, the
 * toggle's bars dance — and the phone plays nothing. `playback` is the one
 * category that survives the switch.
 *
 * Claiming it is fair here: sound is opt-in behind a deliberate gesture.
 * stop() hands the session back so a visitor's own music can resume.
 */
function setAudioSession(type: AudioSessionType) {
  const session = (
    navigator as Navigator & { audioSession?: { type: AudioSessionType } }
  ).audioSession
  if (session) session.type = type
}

/** iOS 14.4 and older only expose the prefixed constructor. */
function audioContextCtor(): typeof AudioContext | undefined {
  if (typeof AudioContext !== 'undefined') return AudioContext
  return (window as Window & { webkitAudioContext?: typeof AudioContext })
    .webkitAudioContext
}

/**
 * The generative ocean soundscape. Framework-free singleton; React only
 * calls start/stop/setDepth and reads `analyser` for the visual tap.
 *
 * Autoplay policy: the AudioContext is created and resumed exclusively
 * inside start(), which must be invoked from a user gesture.
 */
class OceanAudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private depthFilter: BiquadFilterNode | null = null
  private drone: Drone | null = null
  private pings: Pings | null = null
  /** Visual tap — null until first start() */
  analyser: AnalyserNode | null = null
  /** The user's intent, distinct from context state (tab-hide suspends) */
  enabled = false
  private depth = 0

  private build(): boolean {
    const Ctor = audioContextCtor()
    if (!Ctor) return false
    const ctx = new Ctor()
    this.ctx = ctx

    const master = ctx.createGain()
    master.gain.value = 0

    // mix bus → depth lowpass → master → compressor → analyser → out
    const mix = ctx.createGain()
    const depthFilter = ctx.createBiquadFilter()
    depthFilter.type = 'lowpass'
    depthFilter.frequency.value = 2400
    depthFilter.Q.value = 0.5

    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -22
    compressor.knee.value = 18
    compressor.ratio.value = 4
    compressor.attack.value = 0.02
    compressor.release.value = 0.4

    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.82

    const convolver = ctx.createConvolver()
    convolver.buffer = buildImpulseResponse(ctx)
    const wet = ctx.createGain()
    wet.gain.value = 0.55

    const noise = buildNoiseBed(ctx)
    const drone = buildDrone(ctx)
    const pings = buildPings(ctx)

    noise.output.connect(mix)
    noise.send.connect(convolver)
    drone.output.connect(mix)
    drone.send.connect(convolver)
    pings.dry.connect(mix)
    pings.send.connect(convolver)
    convolver.connect(wet)
    wet.connect(mix)

    mix.connect(depthFilter)
    depthFilter.connect(master)
    master.connect(compressor)
    compressor.connect(analyser)
    analyser.connect(ctx.destination)

    this.master = master
    this.depthFilter = depthFilter
    this.drone = drone
    this.pings = pings
    this.analyser = analyser

    document.addEventListener('visibilitychange', () => {
      if (!this.ctx) return
      if (document.hidden) {
        if (this.ctx.state === 'running') void this.ctx.suspend()
      } else {
        this.resumeIfEnabled()
      }
    })

    // Mobile browsers block programmatic resume after a tab switch or
    // bfcache restore — the context stays suspended while the toggle still
    // reads "on", so the bars dance with no sound. Recover on the next user
    // interaction. Capture phase so the recovery runs before the scene's own
    // pointerdown handler asks us for a ping. No-op once already running.
    const onGesture = () => this.resumeIfEnabled()
    window.addEventListener('pointerdown', onGesture, {
      passive: true,
      capture: true,
    })
    window.addEventListener('keydown', onGesture, { capture: true })
    return true
  }

  /** Call only from a click/keydown handler. Reports whether sound exists. */
  start(): boolean {
    if (!this.ctx && !this.build()) return false
    const ctx = this.ctx!
    this.enabled = true
    // Must happen in the gesture, before resume, or iOS keeps `ambient`
    setAudioSession('playback')
    void ctx.resume()
    this.pings!.start()
    const now = ctx.currentTime
    this.master!.gain.cancelScheduledValues(now)
    this.master!.gain.setTargetAtTime(0.62, now, 0.9)
    this.applyDepth()
    return true
  }

  stop() {
    if (!this.ctx || !this.master) return
    this.enabled = false
    this.pings?.stop()
    const now = this.ctx.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setTargetAtTime(0, now, 0.35)
    // Suspend after the fade so re-enabling is instant, and hand the iOS
    // audio session back — muting us shouldn't keep another app ducked.
    window.setTimeout(() => {
      if (this.enabled) return
      setAudioSession('auto')
      if (this.ctx?.state === 'running') void this.ctx.suspend()
    }, 1600)
  }

  /**
   * A deliberate sonar ping for user clicks — the same voice as the
   * ambient pings, pitched by the current depth. Silent while muted.
   */
  ping() {
    if (!this.enabled || !this.ctx) return
    // A tap arriving while iOS has us suspended/interrupted is the gesture
    // that recovers us; let it be audible instead of swallowed.
    this.resumeIfEnabled()
    this.pings?.trigger()
  }

  /**
   * Resume the context if the user wants sound but the browser suspended
   * it (tab switch, bfcache, iOS "interrupted"). Safe to call on every
   * gesture — a no-op when already running or when the user muted.
   */
  private resumeIfEnabled() {
    if (!this.enabled || !this.ctx || this.ctx.state === 'running') return
    // iOS reverts the session to `ambient` after an interruption, so the
    // category has to be reclaimed alongside the resume, not just once.
    setAudioSession('playback')
    void this.ctx.resume()
  }

  /** Driven by the scene's MoodController. */
  setDepth(depth: number) {
    if (Math.abs(depth - this.depth) < 0.01) return
    this.depth = depth
    this.applyDepth()
  }

  private applyDepth() {
    if (!this.ctx || !this.enabled) {
      this.pings?.setDepth(this.depth)
      return
    }
    const now = this.ctx.currentTime
    this.depthFilter!.frequency.setTargetAtTime(
      2400 - this.depth * 1750,
      now,
      0.6,
    )
    this.drone!.setDepth(this.depth, now)
    this.pings!.setDepth(this.depth)
  }
}

export const audioEngine = new OceanAudioEngine()
