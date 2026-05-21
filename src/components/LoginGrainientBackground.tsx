"use client";

import Grainient from "@/components/Grainient";

export function LoginGrainientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#032428]"
    >
      <Grainient
        className="absolute inset-0"
        color1="#032428"
        color2="#093c40"
        color3="#3c525f"
        timeSpeed={1}
        colorBalance={0.08}
        warpStrength={0.75}
        warpFrequency={5}
        warpSpeed={2}
        warpAmplitude={50}
        blendAngle={0}
        blendSoftness={0.34}
        rotationAmount={500}
        noiseScale={2}
        grainAmount={0.1}
        grainScale={2}
        grainAnimated={false}
        contrast={1.25}
        gamma={1}
        saturation={1}
        centerX={0}
        centerY={0}
        zoom={0.9}
      />
    </div>
  );
}
