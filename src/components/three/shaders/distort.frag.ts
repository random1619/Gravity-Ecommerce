export const distortFragmentShader = /* glsl */ `
  precision mediump float;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uAmplitude;

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

  void main() {
    vec2 uv = vUv;

    // liquid noise displacement
    float nx = noise(uv * 3.0 + uTime * 0.2) - 0.5;
    float ny = noise(uv * 3.0 + uTime * 0.2 + 5.0) - 0.5;
    uv += vec2(nx, ny) * uAmplitude;

    // mouse-reactive ripple centered on pointer
    float d = distance(uv, uMouse);
    float wave = sin(d * 30.0 - uTime * 3.0) * exp(-d * 4.0);
    uv += wave * uAmplitude * 0.5;

    gl_FragColor = texture2D(uTexture, uv);
  }
`;
