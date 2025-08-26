import React, { Suspense, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

export default function SpheroidsModel(props) {
    const { scene } = useGLTF("/models/spheroids.glb");
    
    // Detailed model analysis
    console.log("=== GLB MODEL ANALYSIS ===");
    console.log("Scene:", scene);
    console.log("Scene children count:", scene.children.length);
    
    // Function to recursively analyze the scene
    const analyzeObject = (obj, depth = 0) => {
        const indent = "  ".repeat(depth);
        console.log(`${indent}${obj.type}: "${obj.name}" (id: ${obj.id})`);
        
        if (obj.material) {
            console.log(`${indent}  Material: ${obj.material.name || 'unnamed'} (type: ${obj.material.type})`);
            console.log(`${indent}  Material color:`, obj.material.color);
            if (obj.material.emissive) {
                console.log(`${indent}  Material emissive:`, obj.material.emissive);
            }
        }
        
        if (obj.geometry) {
            console.log(`${indent}  Geometry: ${obj.geometry.type}`);
            console.log(`${indent}  Vertices: ${obj.geometry.attributes.position?.count || 'unknown'}`);
        }
        
        if (obj.children && obj.children.length > 0) {
            console.log(`${indent}  Children: ${obj.children.length}`);
            obj.children.forEach(child => analyzeObject(child, depth + 1));
        }
    };
    
    // Analyze the entire scene
    analyzeObject(scene);
    
    // Look for all meshes specifically
    console.log("\n=== ALL MESHES ===");
    scene.traverse((child) => {
        if (child.isMesh) {
            console.log(`Mesh: "${child.name}" (material: ${child.material?.name || 'unnamed'})`);
            console.log(`  Position:`, child.position);
            console.log(`  Scale:`, child.scale);
            console.log(`  Material type:`, child.material?.type);
            console.log(`  Material properties:`, {
                color: child.material?.color,
                emissive: child.material?.emissive,
                metalness: child.material?.metalness,
                roughness: child.material?.roughness,
                transparent: child.material?.transparent,
                opacity: child.material?.opacity
            });
        }
    });
    
    // Look for groups
    console.log("\n=== ALL GROUPS ===");
    scene.traverse((child) => {
        if (child.isGroup) {
            console.log(`Group: "${child.name}" (children: ${child.children.length})`);
        }
    });
    
    console.log("=== END ANALYSIS ===\n");
    
    return <primitive object={scene} {...props} />;
}