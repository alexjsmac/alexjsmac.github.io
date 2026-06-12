precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform float uOpacity;
uniform float uGlitch;

varying vec3 vNormal;
varying vec3 vViewDir;
varying float vY;

float hash11(float p) {
  return fract(sin(p * 127.1) * 43758.5453123);
}

void main() {
  float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewDir))), 2.2);
  // Brighter toward the bell rim (low y), faint dome
  float rim = smoothstep(0.9, 0.1, vY);
  vec3 color = uColor * (0.25 + fresnel * 1.5 + rim * 0.25);
  float alpha = (0.05 + fresnel * 0.55) * uOpacity;

  // Sonar glitch: RGB desync, scanline dropouts, exposure stutter
  if (uGlitch > 0.001) {
    float t = floor(uTime * 24.0) / 24.0;

    // Channel desync — red/blue gains drift apart per held frame
    color.r *= 1.0 + (hash11(t + 4.0) - 0.5) * 1.7 * uGlitch;
    color.b *= 1.0 + (hash11(t + 9.0) - 0.5) * 1.7 * uGlitch;

    // Scanline dropouts eat horizontal strips of the render
    float scan = hash11(floor(gl_FragCoord.y / 5.0) * 0.731 + t * 11.0);
    float drop = step(1.0 - 0.45 * uGlitch, scan);
    alpha *= 1.0 - drop * 0.85;

    // Occasional hot rescan line flashes cyan-white through the body
    float rescan = step(0.985 - 0.01 * uGlitch, hash11(floor(gl_FragCoord.y / 2.0) + t * 31.0));
    color += vec3(0.55, 1.2, 1.0) * rescan * uGlitch;
    alpha += rescan * uGlitch * 0.5;

    // Exposure stutter — the whole body pops brighter while scanned
    color *= 1.0 + uGlitch * (0.35 + 0.5 * hash11(t));
  }

  gl_FragColor = vec4(color, alpha);
}
