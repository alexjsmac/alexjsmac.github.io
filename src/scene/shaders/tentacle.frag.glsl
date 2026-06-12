precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform float uOpacity;
uniform float uGlitch;

varying float vAlong;
varying float vStrand;

float hash11(float p) {
  return fract(sin(p * 127.1) * 43758.5453123);
}

void main() {
  float fade = (1.0 - vAlong) * 0.55 + 0.1;
  vec3 color = uColor * 0.8;
  float alpha = fade * uOpacity;

  // Sonar glitch: strands flicker in and out per held frame
  if (uGlitch > 0.001) {
    float t = floor(uTime * 24.0) / 24.0;
    float flicker = hash11(vStrand * 7.3 + floor(vAlong * 6.0) + t * 17.0);
    alpha *= 1.0 - step(1.0 - 0.5 * uGlitch, flicker) * 0.9;
    color *= 1.0 + uGlitch * 0.6;
  }

  gl_FragColor = vec4(color, alpha);
}
