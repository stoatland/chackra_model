import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
// import SpheroidsModel from './SpheroidModel'; // Testing/Analysis version
import ChakraSpheroidModel from './ChakraSpheroidModel'; // Chakra zones version

// Production version - simple and clean
// function SpheroidsModel(props) {
//     const { scene } = useGLTF("/models/spheroids.glb");
//     return <primitive object={scene} {...props} />;
// }

export default function BreathingCanvas() {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ background: '#222' }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <ChakraSpheroidModel />
                </Suspense>
                <OrbitControls enablePan={false} target={[0, 0, 0]} />
            </Canvas>
        </div>
    );
}