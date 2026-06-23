export const auroraFragmentShader = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform vec2  uMouse;
  uniform vec3  uColor1;
  uniform vec3  uColor2;
  uniform vec3  uColor3;
  uniform float uIntensity;
  uniform float uOctaves;   // tier-based detail level

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Fractal Brownian Motion; octave count capped by uOctaves uniform.
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {
      if (float(i) >= uOctaves) break;
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    // subtle pointer parallax
    uv += (uMouse - 0.5) * 0.08;

    float t = uTime * 0.05;
    // domain warp for organic flow
    vec2 q = vec2(fbm(uv * 1.5 + t), fbm(uv * 1.5 + t + 5.2));
    float n = fbm(uv * 2.5 + q * 1.8 + t * 1.5);

    // 3-stop color gradient driven by the warped noise
    vec3 col = mix(uColor1, uColor2, smoothstep(0.2, 0.6, n));
    col = mix(col, uColor3, smoothstep(0.5, 0.95, n));

    // fade toward the top so hero copy stays readable
    float fadeY = smoothstep(1.0, 0.3, vUv.y);
    col *= uIntensity * (0.35 + 0.65 * fadeY);

    gl_FragColor = vec4(col, 1.0);
  }
`;
