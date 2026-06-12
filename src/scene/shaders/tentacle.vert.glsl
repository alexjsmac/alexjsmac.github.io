attribute float aAlong; // 0 at bell, 1 at tip
attribute float aStrand;

uniform float uTime;
uniform float uPulseRate;
uniform float uPhase;
uniform float uGlitch;

varying float vAlong;
varying float vStrand;

float hash11(float p) {
  return fract(sin(p * 127.1) * 43758.5453123);
}

void main() {
  vAlong = aAlong;
  vStrand = aStrand;
  vec3 pos = position;

  // Sway grows toward the tip; strands are phase-offset around the bell
  float sway = sin(uTime * (uPulseRate * 0.5) + uPhase + aStrand * 2.4 - aAlong * 3.5);
  float reach = aAlong * aAlong;
  pos.x += sway * reach * 0.55;
  pos.z += cos(uTime * (uPulseRate * 0.42) + aStrand * 1.9 - aAlong * 2.8) * reach * 0.45;

  // Sonar glitch: strands desynchronize — segments snap to held offsets
  if (uGlitch > 0.001) {
    float t = floor(uTime * 20.0) / 20.0;
    float seg = floor(aAlong * 6.0);
    float sn = hash11(seg * 4.7 + aStrand * 9.1 + t * 13.0);
    if (sn > 1.0 - 0.55 * uGlitch) {
      pos.x += (hash11(seg + aStrand + t) - 0.5) * 0.6 * uGlitch;
      pos.z += (hash11(seg * 2.0 + aStrand + t) - 0.5) * 0.4 * uGlitch;
    }
  }

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
