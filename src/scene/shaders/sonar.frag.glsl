precision highp float;

uniform float uTime;
uniform float uStart;
uniform vec3 uColor;

varying vec2 vUv;

const float LIFE = 1.1;

void main() {
  float age = uTime - uStart;
  float t = age / LIFE;
  if (t <= 0.0 || t >= 1.0) discard;

  float d = length(vUv - 0.5) * 2.0;
  float radius = t * 0.92;

  // Primary expanding ring + a fainter trailing echo
  float ring = smoothstep(0.02, 0.0, abs(d - radius));
  float echo = smoothstep(0.012, 0.0, abs(d - radius * 0.62)) * 0.35;

  float fade = pow(1.0 - t, 1.7);
  float a = (ring + echo) * fade;
  gl_FragColor = vec4(uColor * a * 1.35, a * 0.85);
}
