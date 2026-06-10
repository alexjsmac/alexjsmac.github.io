/**
 * The ocean bed: two looped generated-noise sources —
 * (a) a lowpassed wash whose cutoff swells like waves,
 * (b) a deep bandpassed rumble that breathes very slowly.
 */
export interface NoiseBed {
  output: GainNode
  send: GainNode
}

function noiseBuffer(ctx: BaseAudioContext, seconds: number): AudioBuffer {
  const length = Math.floor(seconds * ctx.sampleRate)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  return buffer
}

function loopedNoise(ctx: BaseAudioContext): AudioBufferSourceNode {
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx, 4)
  src.loop = true
  return src
}

export function buildNoiseBed(ctx: BaseAudioContext): NoiseBed {
  const output = ctx.createGain()
  output.gain.value = 1
  const send = ctx.createGain()
  send.gain.value = 0.15

  // (a) wave wash
  const wash = loopedNoise(ctx)
  const washFilter = ctx.createBiquadFilter()
  washFilter.type = 'lowpass'
  washFilter.frequency.value = 380
  washFilter.Q.value = 0.7
  const washGain = ctx.createGain()
  washGain.gain.value = 0.16

  const washLfo = ctx.createOscillator()
  washLfo.frequency.value = 0.05
  const washLfoAmount = ctx.createGain()
  washLfoAmount.gain.value = 240
  washLfo.connect(washLfoAmount)
  washLfoAmount.connect(washFilter.frequency)

  wash.connect(washFilter)
  washFilter.connect(washGain)
  washGain.connect(output)
  washGain.connect(send)

  // (b) abyssal rumble
  const rumble = loopedNoise(ctx)
  const rumbleFilter = ctx.createBiquadFilter()
  rumbleFilter.type = 'bandpass'
  rumbleFilter.frequency.value = 130
  rumbleFilter.Q.value = 1.1
  const rumbleGain = ctx.createGain()
  rumbleGain.gain.value = 0.22

  const rumbleLfo = ctx.createOscillator()
  rumbleLfo.frequency.value = 0.023
  const rumbleLfoAmount = ctx.createGain()
  rumbleLfoAmount.gain.value = 0.1
  rumbleLfo.connect(rumbleLfoAmount)
  rumbleLfoAmount.connect(rumbleGain.gain)

  rumble.connect(rumbleFilter)
  rumbleFilter.connect(rumbleGain)
  rumbleGain.connect(output)

  wash.start()
  rumble.start()
  washLfo.start()
  rumbleLfo.start()

  return { output, send }
}
