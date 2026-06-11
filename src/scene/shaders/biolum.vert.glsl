attribute vec3 aSpawn;
attribute float aBirth;
attribute float aSeed;

uniform float uTime;
uniform float uPixelRatio;

varying float vLife;
varying float vSeed;

const float DURATION = 1.2;

float hash11(float p) {
  return fract(sin(p * 127.1) * 43758.5453123);
}

void main() {
  float age = uTime - aBirth;
  float life = clamp(age / DURATION, 0.0, 1.0);
  vLife = life;
  vSeed = aSeed;

  vec3 dir = normalize(vec3(
    hash11(aSeed) - 0.5,
    hash11(aSeed + 1.7) - 0.25,
    hash11(aSeed + 4.2) - 0.5
  ));
  vec3 pos = aSpawn + dir * (life * (0.2 + hash11(aSeed + 7.0) * 0.5));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  float grow = smoothstep(0.0, 0.08, life);
  float decay = 1.0 - smoothstep(0.2, 1.0, life);
  float size = (2.5 + hash11(aSeed + 9.0) * 4.0) * grow * (0.35 + 0.65 * decay);

  // Dead or unborn particles collapse to nothing
  if (age < 0.0 || life >= 1.0) size = 0.0;

  gl_PointSize = size * uPixelRatio * (60.0 / max(length(mvPosition.xyz), 1.0));
  gl_Position = projectionMatrix * mvPosition;
}
