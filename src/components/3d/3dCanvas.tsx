import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { BouquetModel } from './BouquetModel';

interface Canvas3DProps {
  scrollProgress: number;
}

export function Canvas3D({ scrollProgress }: Canvas3DProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: isMobile ? 50 : 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.85} color="#FFF8EE" />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#FFF3DD" castShadow />
        <pointLight position={[-4, 3, -2]} intensity={0.6} color="#A4193D" />
        <pointLight position={[3, -3, 2]} intensity={0.5} color="#FBF8F3" />

        <Suspense fallback={null}>
          <Float speed={isMobile ? 1 : 2} rotationIntensity={0.2} floatIntensity={0.3}>
            <BouquetModel scrollProgress={scrollProgress} isMobile={isMobile} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
