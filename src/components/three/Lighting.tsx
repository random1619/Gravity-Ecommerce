'use client';

import React from 'react';

/** Minimal ambient lighting — scenes here are mostly shader/unlit. */
export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 2]} intensity={0.4} />
    </>
  );
}
