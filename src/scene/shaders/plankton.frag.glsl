precision highp float;

uniform float uDepth;
uniform float uAudioHigh;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying float vTwinkle;
varying float vFade;
varying float vBright;

void main() {
  vec2 p = gl_PointCoord - 0.5;
  float r = length(p);
  // Soft round sprite with a hot center
  float core = smoothstep(0.5, 0.05, r);
  float glow = smoothstep(0.5, 0.0, r);

  vec3 color = mix(uColorA, uColorB, vTwinkle);
  float sparkle = 0.6 + 0.4 * vTwinkle;
  sparkle *= 1.0 + uAudioHigh * 0.8;

  // Deeper water mutes the plankton slightly
  float dim = mix(1.0, 0.65, uDepth);

  float alpha = glow * vFade * sparkle * dim * vBright;
  gl_FragColor = vec4(color * (core * 1.2 + 0.3), alpha * 0.4);
}
