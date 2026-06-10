attribute float aAlong; // 0 at bell, 1 at tip
attribute float aStrand;

uniform float uTime;
uniform float uPulseRate;
uniform float uPhase;

varying float vAlong;

void main() {
  vAlong = aAlong;
  vec3 pos = position;

  // Sway grows toward the tip; strands are phase-offset around the bell
  float sway = sin(uTime * (uPulseRate * 0.5) + uPhase + aStrand * 2.4 - aAlong * 3.5);
  float reach = aAlong * aAlong;
  pos.x += sway * reach * 0.55;
  pos.z += cos(uTime * (uPulseRate * 0.42) + aStrand * 1.9 - aAlong * 2.8) * reach * 0.45;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
