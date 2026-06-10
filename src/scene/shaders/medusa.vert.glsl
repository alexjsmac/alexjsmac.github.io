uniform float uTime;
uniform float uPulseRate;
uniform float uPhase;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vY;

void main() {
  vec3 pos = position;
  vY = position.y;

  // Peristaltic bell contraction: radius squeezes in a wave running down
  float wave = sin(uTime * uPulseRate + uPhase - position.y * 2.6);
  float squeeze = 1.0 + wave * 0.16 * (1.0 - position.y * 0.5);
  pos.xz *= squeeze;
  pos.y *= 1.0 - wave * 0.08;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
