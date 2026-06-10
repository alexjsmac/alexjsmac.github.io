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
  float glow = smoothstep(0.5, 0.0, r);
  float core = smoothstep(0.18, 0.0, r);

  vec3 color = mix(uColorA, uColorB, hash11(vSeed + 2.3));
  float fade = 1.0 - vLife;

  // HDR push so only these cross the bloom threshold
  vec3 hdr = color * (1.1 + core * 2.6) * fade;
  gl_FragColor = vec4(hdr, glow * fade * 0.9);
}
