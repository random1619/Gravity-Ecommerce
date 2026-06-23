'use client';

import dynamic from 'next/dynamic';

/**
 * Client-side wrapper that dynamically imports the WebGL canvas.
 * Placed here so layout.tsx (a Server Component) can render it
 * without triggering the `ssr: false` restriction.
 */
const WebGLCanvas = dynamic(
  () => import('@/components/three/WebGLCanvas'),
  { ssr: false }
);

export default function ClientWebGLCanvas() {
  return <WebGLCanvas />;
}
