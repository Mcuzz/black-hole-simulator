import { shaderMaterial } from "@react-three/drei"
import { extend } from "@react-three/fiber"
import { Texture } from "three"

export const LensingMaterial = shaderMaterial(
  {
    skyTexture: null as Texture | null,
    blackHolePos: [0, 0, 0],
    lensingStrength: 0.2,
  },

  // ✅ VERTEX SHADER (WebGL2 compatible)
  `
  precision highp float;

  out vec3 vWorldDirection;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldDirection = normalize(worldPosition.xyz - cameraPosition);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,

  // ✅ FRAGMENT SHADER (WebGL2 compatible)
  `
  precision highp float;

  uniform sampler2D skyTexture;
  uniform vec3 blackHolePos;
  uniform float lensingStrength;
  uniform vec3 cameraPosition;

  in vec3 vWorldDirection;

  out vec4 fragColor;

  const float PI = 3.14159265359;

  vec2 directionToUV(vec3 dir) {
    float phi = atan(dir.z, dir.x);
    float theta = acos(clamp(dir.y, -1.0, 1.0));

    return vec2(
      phi / (2.0 * PI) + 0.5,
      theta / PI
    );
  }

  float band(float x, float radius, float width) {
    float outer = 1.0 - smoothstep(radius, radius + width, x);
    float inner = smoothstep(radius - width, radius, x);
    return outer * inner;
  }

  void main() {
    vec3 rayDir = normalize(vWorldDirection);
    vec3 blackHoleDir = normalize(blackHolePos - cameraPosition);

    float cosAngle = clamp(dot(rayDir, blackHoleDir), -1.0, 1.0);
    float angle = acos(cosAngle);
    float angularDistance = angle / PI;

    float falloff = 1.0 - smoothstep(0.015, 0.24, angularDistance);
    float warpAmount =
      lensingStrength * falloff / max(angularDistance * 10.0, 0.14);
    warpAmount = clamp(warpAmount, 0.0, 0.78);

    vec3 bentDir = normalize(mix(rayDir, blackHoleDir, warpAmount));
    vec2 uv = directionToUV(bentDir);
    vec3 color = texture(skyTexture, uv).rgb;

    color = pow(color, vec3(0.72));
    color *= 1.75;

    float turbulenceBand = 1.0 - smoothstep(0.025, 0.18, angularDistance);
    color *= 1.0 - turbulenceBand * (0.14 + lensingStrength * 0.05);

    float photonRing =
      band(angularDistance, 0.037, 0.009) * (0.75 + lensingStrength * 0.45);
    float einsteinRing =
      band(angularDistance, 0.075, 0.012) * (0.22 + lensingStrength * 0.22);

    color += vec3(1.0, 0.72, 0.34) * photonRing;
    color += vec3(0.94, 0.67, 0.38) * einsteinRing;

    float eventShadow = 1.0 - smoothstep(0.024, 0.052, angularDistance);
    color *= 1.0 - eventShadow;

    fragColor = vec4(color, 1.0);
  }
  `,
)

extend({ LensingMaterial })