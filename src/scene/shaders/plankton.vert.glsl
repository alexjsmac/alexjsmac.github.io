attribute float aSeed;
attribute float aSize;
attribute float aPhase;

uniform float uTime;
uniform float uDepth;
uniform float uParticleEnergy;
uniform float uAudioWarp;
uniform float uPixelRatio;
uniform float uCameraY;

varying float vTwinkle;
varying float vFade;
varying float vBright;

#include ./chunks/simplex.glsl;
#include ./chunks/curl.glsl;

// Box the particles live in, recentered around the camera each frame
const vec3 BOUNDS = vec3(34.0, 22.0, 26.0);

float hash11(float p) {
  return fract(sin(p * 127.1) * 43758.5453123);
}

void main() {
  // Stateless home position from the seed
  vec3 home = vec3(
    (hash11(aSeed) - 0.5) * BOUNDS.x,
    (hash11(aSeed + 11.3) - 0.5) * BOUNDS.y,
    (hash11(aSeed + 27.7) - 0.5) * BOUNDS.z
  );

  // Slow curl-field drift; the soundscape leans on it gently via the
  // slow warp swell (size stays steady — no jitter)
  float drift = uTime * (0.018 + 0.012 * uAudioWarp * uParticleEnergy);
  vec3 flow = curlNoise(home * 0.08 + vec3(0.0, drift, aSeed * 0.13));
  vec3 pos = home + flow * (2.2 + 0.9 * uAudioWarp);

  // Gentle marine-snow sink, faster when energetic
  pos.y -= uTime * (0.12 + 0.25 * uParticleEnergy * 0.3);

  // Wrap into a box centered on the camera so the field is endless
  vec3 center = vec3(0.0, uCameraY, 0.0);
  pos = mod(pos - center + BOUNDS * 0.5, BOUNDS) - BOUNDS * 0.5 + center;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  float twinkle = sin(aPhase + uTime * (0.6 + hash11(aSeed + 3.1)));
  vTwinkle = twinkle * 0.5 + 0.5;

  // Most motes are barely-there dust; a rare few glow
  vBright = 0.18 + pow(hash11(aSeed + 5.9), 6.0) * 0.82;

  // Fade with view distance into the fog
  float dist = length(mvPosition.xyz);
  vFade = 1.0 - smoothstep(7.0, 26.0, dist);

  float size = aSize * (0.8 + 0.4 * uParticleEnergy);
  gl_PointSize = size * uPixelRatio * (95.0 / dist);
  gl_Position = projectionMatrix * mvPosition;
}
