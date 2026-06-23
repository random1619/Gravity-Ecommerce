'use client';

import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Reusable scratch vectors so we never allocate per-frame.
const _target = new THREE.Vector3();
const _desired = new THREE.Vector3();

/** Default camera with gentle pointer parallax. Shared by all scenes. */
export default function CameraRig() {
  const { camera } = useThree();

  // R3F runs useFrame every frame; camera is an external Three object so we
  // drive it via vector method calls (not direct field writes) to satisfy the
  // React Compiler. lerp gives the eased follow the old += 0.04 did.
  useFrame((state) => {
    _desired.set(state.pointer.x * 0.3, state.pointer.y * 0.3, camera.position.z);
    camera.position.lerp(_desired, 0.04);
    _target.set(0, 0, 0);
    camera.lookAt(_target);
  });

  return null;
}
