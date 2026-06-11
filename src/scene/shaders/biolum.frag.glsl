precision highp float;

uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vLife;
varying float vSeed;

float hash11(float p) {
  return fract(sin(p * 127.1) * 43758.5453123);
}

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float r = length(p);
  // Tight, sharp speck — almost no halo
  float glow = smoothstep(0.34, 0.04, r);
  float core = smoothstep(0.1, 0.0, r);

  vec3 color = mix(uColorA, uColorB, hash11(vSeed + 2.3));
  float fade = 1.0 - vLife;

  // Modest HDR push: a glint, not fairy dust
  vec3 hdr = color * (0.9 + core * 1.6) * fade;
  gl_FragColor = vec4(hdr, glow * fade * 0.85);
}
