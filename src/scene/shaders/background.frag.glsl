precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uDepth;
uniform float uCaustics;
uniform float uAudioHigh;
uniform float uAspect;
uniform vec3 uRamp[5];

#include ./chunks/simplex.glsl;

// 5-stop vertical ramp through the water column
vec3 ramp(float t) {
  float x = clamp(t, 0.0, 1.0) * 4.0;
  vec3 c = mix(uRamp[0], uRamp[1], clamp(x, 0.0, 1.0));
  c = mix(c, uRamp[2], clamp(x - 1.0, 0.0, 1.0));
  c = mix(c, uRamp[3], clamp(x - 2.0, 0.0, 1.0));
  c = mix(c, uRamp[4], clamp(x - 3.0, 0.0, 1.0));
  return c;
}

// Interference caustics — warped sine filaments
float caustics(vec2 uv, float t) {
  vec2 p = uv * vec2(uAspect * 5.0, 5.0);
  p += 0.45 * vec2(
    snoise(vec3(uv * 2.4, t * 0.09)),
    snoise(vec3(uv * 2.4 + 13.7, t * 0.11))
  );
  float a = sin(p.x * 1.6 + t * 0.55)
          + sin(p.y * 2.2 - t * 0.42)
          + sin((p.x + p.y) * 1.25 + t * 0.33);
  return pow(abs(sin(a)), 7.0);
}

// Slanted god-rays, broken up by slow noise
float shafts(vec2 uv, float t) {
  float x = uv.x * uAspect + (1.0 - uv.y) * 0.55;
  float bands = sin(x * 9.0 + t * 0.05) * 0.5 + 0.5;
  bands = pow(bands, 5.0);
  float flicker = snoise(vec3(x * 1.6, t * 0.04, 3.1)) * 0.5 + 0.5;
  return bands * flicker * smoothstep(0.25, 1.0, uv.y);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // Screen-local gradient riding on the global descent depth
  float column = clamp(uDepth + (1.0 - vUv.y) * 0.22 - 0.06, 0.0, 1.0);
  vec3 color = ramp(column);

  // Sunlight dies with depth
  float light = pow(1.0 - uDepth, 2.0);

  float c = caustics(vUv, uTime) * uCaustics * light;
  c *= smoothstep(0.35, 0.95, vUv.y);
  c *= 0.5 + 0.25 * uAudioHigh;
  color += c * vec3(0.36, 0.62, 0.66);

  float s = shafts(vUv, uTime) * light;
  color += s * vec3(0.10, 0.22, 0.30) * 0.55;

  // Faint deep-water color breathing so the abyss never reads as flat black
  float breathe = snoise(vec3(vUv * 1.4, uTime * 0.03)) * 0.5 + 0.5;
  color += uDepth * breathe * vec3(0.008, 0.016, 0.028);

  // Vignette toward the edges
  float r = distance(vUv, vec2(0.5, 0.45));
  color *= 1.0 - 0.35 * smoothstep(0.45, 0.95, r);

  // Dither to keep the dark gradient from banding
  color += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * (2.0 / 255.0);

  gl_FragColor = vec4(color, 1.0);
}
