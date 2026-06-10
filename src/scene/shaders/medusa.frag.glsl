precision highp float;

uniform vec3 uColor;
uniform float uOpacity;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vY;

void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), 2.2);
  // Brighter toward the bell rim (low y), faint dome
  float rim = smoothstep(0.9, 0.1, vY);
  vec3 color = uColor * (0.25 + fresnel * 1.5 + rim * 0.25);
  float alpha = (0.05 + fresnel * 0.55) * uOpacity;
  gl_FragColor = vec4(color, alpha);
}
