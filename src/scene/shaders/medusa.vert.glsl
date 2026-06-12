uniform float uTime;
uniform float uPulseRate;
uniform float uPhase;
uniform float uGlitch;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vY;

float hash11(float p) {
  return fract(sin(p * 127.1) * 43758.5453123);
}

void main() {
  vec3 pos = position;
  vY = position.y;

  // Peristaltic bell contraction: radius squeezes in a wave running down
  float wave = sin(uTime * uPulseRate + uPhase - position.y * 2.6);
  float squeeze = 1.0 + wave * 0.16 * (1.0 - position.y * 0.5);
  pos.xz *= squeeze;
  pos.y *= 1.0 - wave * 0.08;

  // Sonar glitch: the simulation's seams show. Sample-and-hold time makes
  // every artifact stutter instead of animating smoothly.
  if (uGlitch > 0.001) {
    float t = floor(uTime * 20.0) / 20.0;

    // Horizontal slice tearing — bands of the mesh shear sideways
    float band = floor((pos.y + 1.5) * 7.0);
    float bn = hash11(band * 3.1 + t * 13.7);
    if (bn > 1.0 - 0.5 * uGlitch) {
      pos.x += (hash11(band * 1.7 + t * 5.0) - 0.5) * 0.85 * uGlitch;
      pos.z += (hash11(band * 2.3 + t * 7.0) - 0.5) * 0.45 * uGlitch;
    }

    // Vertex quantization — geometry collapses toward a coarse grid
    vec3 quantized = floor(pos * 9.0) / 9.0;
    pos = mix(pos, quantized, uGlitch * 0.75);

    // Whole-body micro jitter
    pos += (vec3(
      hash11(t * 3.0 + 1.0),
      hash11(t * 3.0 + 2.0),
      hash11(t * 3.0 + 3.0)
    ) - 0.5) * 0.07 * uGlitch;
  }

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vViewDir = normalize(-mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
