import { Canvas, extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import glsl from "glslify";
import { useRef } from "react";
import * as THREE from "three";
import guid from "short-uuid";

const ProjectedMaterial = shaderMaterial(
  {
    viewMatrixCamera: undefined,
    projectionMatrixCamera: undefined,
    //modelMatrixCamera: undefined,
    projPosition: undefined,
    map: undefined,
  },
  glsl`
  uniform mat4 viewMatrixCamera;
  uniform mat4 projectionMatrixCamera;    
  varying vec3 vNormal;
  varying vec4 vTexCoords;
  varying vec2 vUv;
  varying vec3 vFragPos;
      
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vFragPos = mvPosition.xyz;

    vNormal = mat3(modelMatrix) * normal;
    vTexCoords = projectionMatrixCamera * viewMatrixCamera * modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  glsl`uniform vec3 projPosition;
  uniform sampler2D map;
  varying vec3 vNormal;
  varying vec4 vTexCoords;
  varying vec2 vUv;
  varying vec3 vFragPos;
  #include <common>
  #include <bsdfs>
  float fill(in float sdf) {
    return 1.-smoothstep(0., 0.001, sdf);
  }
  float sdBox( in vec2 p, in vec2 b )
  {
      vec2 d = abs(p)-b;
      return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
  }

  void main() {
    vec2 uv = (vTexCoords.xy / vTexCoords.w) * 0.5 + 0.5;
    vec3 projectorDirection = normalize(projPosition - vFragPos);
    float dotProduct = dot(vNormal, projectorDirection);
    
    float mask = fill(sdBox(uv-0.5, vec2(0.5)));// * smoothstep(0., 0.001, dotProduct);//* vTexCoords.w;
    
    vec3 color = texture2D(map, vUv).rgb;
    //color -= (1.-mask) * 0.25;
    vec4 outColor = vec4(vec3(color), 1.);
    //outColor = texture2D(map, vUv);
    //outColor = vec4(0., 1., 0., 1.);
    gl_FragColor = outColor;
    //gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
    gl_FragColor = linearToOutputTexel( gl_FragColor );
    gl_FragColor.rgb -= (1.-mask) * 0.25;
  }
  `,
  (mat) => {
    // mat.transparent = true;
    mat.side = THREE.BackSide;
    mat.toneMapped = false;
    //mat.lights = true;
  }
);

extend({ ProjectedMaterial });

export default ProjectedMaterial;
ProjectedMaterial.key = guid.generate();
