export const accretionDiskVertexShader = /* glsl */ `
  precision highp float;

  out vec2 vLocal;

  void main() {
    vLocal = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const accretionDiskFragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uInnerRadius;
  uniform float uOuterRadius;
  uniform float uMaxTemp;
  uniform float uBeamExponent;
  uniform float uHorizonRadius;
  uniform float uNoiseScale;
  uniform float uNoiseCirculation;
  uniform float uRotationSpeed;
  uniform float uOpacity;
  uniform bool uUseBlackbody;
  uniform sampler2D uBlackbody;

  in vec2 vLocal;
  out vec4 fragColor;

  float hash3(vec3 p) {
    p = fract(p * vec3(127.1, 311.7, 74.7));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);

    float a = hash3(i);
    float b = hash3(i + vec3(1.0, 0.0, 0.0));
    float c = hash3(i + vec3(0.0, 1.0, 0.0));
    float d = hash3(i + vec3(1.0, 1.0, 0.0));
    float e = hash3(i + vec3(0.0, 0.0, 1.0));
    float f1 = hash3(i + vec3(1.0, 0.0, 1.0));
    float g = hash3(i + vec3(0.0, 1.0, 1.0));
    float h = hash3(i + vec3(1.0, 1.0, 1.0));

    return mix(
      mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
      mix(mix(e, f1, u.x), mix(g, h, u.x), u.y),
      u.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int i = 0; i < 6; i++) {
      value += amplitude * noise3(p);
      p = p * 2.0 + vec3(1.7, 9.2, 8.3);
      amplitude *= 0.5;
    }

    return value;
  }

  vec3 blackbodyFallback(float temperature, float shift) {
    float normalizedTemp = clamp((temperature - 1000.0) / 11000.0, 0.0, 1.0);
    vec3 cold = vec3(0.9, 0.08, 0.01);
    vec3 mid = vec3(1.0, 0.52, 0.12);
    vec3 hot = vec3(1.0, 0.96, 0.82);
    vec3 baseColor = normalizedTemp > 0.5
      ? mix(mid, hot, (normalizedTemp - 0.5) * 2.0)
      : mix(cold, mid, normalizedTemp * 2.0);

    float normalizedShift = clamp((shift - 0.25) / 3.75, 0.0, 1.0);
    return mix(baseColor * vec3(0.5, 0.05, 0.02), baseColor, normalizedShift);
  }

  vec3 sampleColor(float temperature, float shift) {
    if (uUseBlackbody) {
      float u = clamp((shift - 0.25) / 3.75, 0.0, 1.0);
      float v = clamp((temperature - 1000.0) / 19000.0, 0.0, 1.0);
      return texture(uBlackbody, vec2(u, v)).rgb;
    }

    return blackbodyFallback(temperature, shift);
  }

  void main() {
    float radius = length(vLocal);
    float phi = atan(vLocal.y, vLocal.x);

    if (radius < uInnerRadius || radius > uOuterRadius) {
      discard;
    }

    float radiusNorm = clamp(
      (radius - uInnerRadius) / max(uOuterRadius - uInnerRadius, 0.0001),
      0.0,
      1.0
    );

    float angle = phi + uNoiseCirculation * radiusNorm - uTime * uRotationSpeed;
    vec3 noisePoint = vec3(
      radius * cos(angle),
      radius * sin(angle),
      uTime * 0.03
    ) * uNoiseScale;

    float density = max(fbm(noisePoint) - 0.38, 0.0);
    density *= smoothstep(0.0, 0.1, radiusNorm);
    density *= 1.0 - smoothstep(0.7, 1.0, radiusNorm);

    if (density < 0.005) {
      discard;
    }

    float temperature = uMaxTemp * pow(uInnerRadius / radius, 0.75);

    float orbitalVelocity = sqrt(clamp(uHorizonRadius / (2.0 * radius), 0.0, 0.95));
    float gammaFactor = 1.0 / sqrt(1.0 - orbitalVelocity * orbitalVelocity);
    vec2 tangent = vec2(-vLocal.y, vLocal.x) / radius;
    float shift = gammaFactor
      * (1.0 + orbitalVelocity * tangent.x * 0.6)
      * sqrt(max(1.0 - uHorizonRadius / radius, 0.001));

    density *= pow(abs(shift), uBeamExponent);

    vec3 color = sampleColor(temperature, shift);
    color *= pow(temperature / uMaxTemp, 1.5);

    float alpha = clamp(density * 2.0, 0.0, 1.0) * uOpacity;
    if (alpha < 0.004) {
      discard;
    }

    fragColor = vec4(color, alpha);
  }
`
