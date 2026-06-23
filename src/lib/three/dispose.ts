import * as THREE from 'three';

/**
 * Recursively dispose geometries, materials, and textures in an object graph.
 * Call on unmount to avoid GPU memory leaks across scene swaps.
 */
export function disposeObject3D(obj: THREE.Object3D): void {
  obj.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(material)) {
      material.forEach(disposeMaterial);
    } else if (material) {
      disposeMaterial(material);
    }
  });
}

function disposeMaterial(mat: THREE.Material): void {
  for (const key of Object.keys(mat)) {
    const value = (mat as unknown as Record<string, unknown>)[key];
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  }
  mat.dispose();
}
