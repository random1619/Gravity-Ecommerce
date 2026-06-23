'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/** Default camera with gentle pointer parallax. Shared by all scenes. */
export default function CameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    target.current.x = state.pointer.x * 0.3;
    target.current.y = state.pointer.y * 0.3;
    camera.position.x += (target.current.x - camera.position.x) * 0.04;
    camera.position.y += (target.current.y - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
