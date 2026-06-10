precision highp float;

uniform vec3 uColor;
uniform float uOpacity;

varying float vAlong;

void main() {
  float fade = (1.0 - vAlong) * 0.55 + 0.1;
  gl_FragColor = vec4(uColor * 0.8, fade * uOpacity);
}
