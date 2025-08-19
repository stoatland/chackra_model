import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";


function SpheroidsModel(props) {
    // The GLB is in public/models/spheroids.glb, so use "/models/spheroids.glb"
    const { scene } = useGLTF("/models/spheroids.glb");
    console.log("Loaded GLTF scene:", scene);
    return <primitive object={scene} {...props} />;
}


export default function BreathingCanvas() {
    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ background: '#222' }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <SpheroidsModel />
                </Suspense>
                <OrbitControls enablePan={false} target={[0, 0, 0]} />
            </Canvas>
        </div>
    );
}