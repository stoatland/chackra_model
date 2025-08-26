import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export default function ChakraSpheroidModel({ timerState, ...props }) {
    const { scene } = useGLTF("/models/spheroids.glb");
    
    // Log timer state changes in the model
    useEffect(() => {
        if (timerState) {
            console.log("=== CHAKRA MODEL RECEIVED TIMER UPDATE ===");
            console.log("Timer Phase:", timerState.phase);
            console.log("Timer Progress:", timerState.progress.toFixed(3));
            console.log("Timer Running:", timerState.isRunning);
        }
    }, [timerState]);
    
    // Chakra colors (1=Red → 7=Violet)
    const chakraColors = useMemo(() => [
        0xff0000, // 1. Root - Red
        0xff8000, // 2. Sacral - Orange  
        0xffff00, // 3. Solar Plexus - Yellow
        0x00ff00, // 4. Heart - Green
        0x0080ff, // 5. Throat - Blue
        0x4000ff, // 6. Third Eye - Indigo
        0x8000ff  // 7. Crown - Violet
    ], []);

    // Function to control chakra intensity (for testing)
    const setChakraIntensity = (chakraIndex, intensity) => {
        const upperSpheroid = scene.getObjectByName('upperSpheroid');
        const lowerSpheroid = scene.getObjectByName('lowerSpheroid');
        
        // Both spheres use the same shader material now
        if (lowerSpheroid?.material?.uniforms) {
            lowerSpheroid.material.uniforms.chakraIntensities.value[chakraIndex] = intensity;
            lowerSpheroid.material.needsUpdate = true;
        }
        
        if (upperSpheroid?.material?.uniforms) {
            upperSpheroid.material.uniforms.chakraIntensities.value[chakraIndex] = intensity;
            upperSpheroid.material.needsUpdate = true;
        }
        
        console.log(`Chakra ${chakraIndex + 1} intensity set to ${intensity}`);
    };

    // Test chakra control after setup (temporary for testing)
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("=== PROGRESSIVE CHAKRA ACTIVATION TEST ===");
            
            // Progressive activation: each chakra turns on and stays on
            // Chakra 1 (Root) - Red
            setTimeout(() => {
                setChakraIntensity(0, 0.8);
                console.log("🔴 Chakra 1 (Root) activated");
            }, 1000);
            
            // Chakra 2 (Sacral) - Orange (1 stays on)
            setTimeout(() => {
                setChakraIntensity(1, 0.8);
                console.log("🟠 Chakra 2 (Sacral) activated");
            }, 2000);
            
            // Chakra 3 (Solar Plexus) - Yellow (1-2 stay on)
            setTimeout(() => {
                setChakraIntensity(2, 0.8);
                console.log("🟡 Chakra 3 (Solar Plexus) activated");
            }, 3000);
            
            // Chakra 4 (Heart) - Green (1-3 stay on) - SPANS JUNCTION
            setTimeout(() => {
                setChakraIntensity(3, 0.8);
                console.log("🟢 Chakra 4 (Heart) activated - spanning junction!");
            }, 4000);
            
            // Chakra 5 (Throat) - Blue (1-4 stay on)
            setTimeout(() => {
                setChakraIntensity(4, 0.8);
                console.log("🔵 Chakra 5 (Throat) activated");
            }, 5000);
            
            // Chakra 6 (Third Eye) - Indigo (1-5 stay on)
            setTimeout(() => {
                setChakraIntensity(5, 0.8);
                console.log("🟣 Chakra 6 (Third Eye) activated");
            }, 6000);
            
            // Chakra 7 (Crown) - Violet (1-6 stay on)
            setTimeout(() => {
                setChakraIntensity(6, 0.8);
                console.log("🟣 Chakra 7 (Crown) activated - ALL CHAKRAS ACTIVE!");
            }, 7000);
            
            // Hold all active for 2 seconds, then reset
            setTimeout(() => {
                console.log("✨ Resetting all chakras");
                for (let i = 0; i < 7; i++) {
                    setChakraIntensity(i, 0.1);
                }
            }, 10000);
            
        }, 2000);
        
        return () => clearTimeout(timer);
    }, [scene]);
    
    useEffect(() => {
        console.log("=== FULL CHAKRA ZONE SETUP ===");
        
        // Find our spheres
        const upperSpheroid = scene.getObjectByName('upperSpheroid');
        const lowerSpheroid = scene.getObjectByName('lowerSpheroid');
        
        if (upperSpheroid && lowerSpheroid) {
            // First, get the original bounding boxes to understand sphere dimensions
            const originalUpperBox = new THREE.Box3().setFromObject(upperSpheroid);
            const originalLowerBox = new THREE.Box3().setFromObject(lowerSpheroid);
            
            // Calculate sphere heights (should be diameter)
            const lowerHeight = originalLowerBox.max.y - originalLowerBox.min.y;
            const upperHeight = originalUpperBox.max.y - originalUpperBox.min.y;
            const lowerRadius = lowerHeight / 2;
            const upperRadius = upperHeight / 2;
            
            console.log("Original sphere dimensions:");
            console.log("  Lower sphere height:", lowerHeight.toFixed(2), "radius:", lowerRadius.toFixed(2));
            console.log("  Upper sphere height:", upperHeight.toFixed(2), "radius:", upperRadius.toFixed(2));
            console.log("  Lower sphere position - X:", originalLowerBox.min.x.toFixed(2), "to", originalLowerBox.max.x.toFixed(2));
            console.log("  Lower sphere position - Z:", originalLowerBox.min.z.toFixed(2), "to", originalLowerBox.max.z.toFixed(2));
            console.log("  Upper sphere position - X:", originalUpperBox.min.x.toFixed(2), "to", originalUpperBox.max.x.toFixed(2));
            console.log("  Upper sphere position - Z:", originalUpperBox.min.z.toFixed(2), "to", originalUpperBox.max.z.toFixed(2));
            
            // Position spheres so they touch AND are aligned on X and Z axes:
            // Both spheres should be centered at X=0, Z=0
            // Lower sphere bottom at -lowerRadius, top at 0
            // Upper sphere bottom at 0, top at +upperRadius
            lowerSpheroid.position.set(0, -lowerRadius, 0);   // Center at origin, move down
            upperSpheroid.position.set(0, upperRadius, 0);    // Center at origin, move up
            
            // Force matrix updates to ensure positioning takes effect immediately
            lowerSpheroid.updateMatrixWorld(true);
            upperSpheroid.updateMatrixWorld(true);
            
            console.log("Repositioned for touching and alignment:");
            console.log("  Lower sphere positioned at:", lowerSpheroid.position.x.toFixed(2), lowerSpheroid.position.y.toFixed(2), lowerSpheroid.position.z.toFixed(2));
            console.log("  Upper sphere positioned at:", upperSpheroid.position.x.toFixed(2), upperSpheroid.position.y.toFixed(2), upperSpheroid.position.z.toFixed(2));
            
            // Get bounding boxes AFTER repositioning
            const upperBox = new THREE.Box3().setFromObject(upperSpheroid);
            const lowerBox = new THREE.Box3().setFromObject(lowerSpheroid);
            
            // Calculate total height spanning both stacked spheres
            const combinedMinY = lowerBox.min.y;  // Bottom of lower sphere
            const combinedMaxY = upperBox.max.y;  // Top of upper sphere
            const totalHeight = combinedMaxY - combinedMinY;
            const zoneHeight = totalHeight / 7;
            
            console.log("Stacked sphere dimensions:");
            console.log("  Combined Y range:", combinedMinY.toFixed(2), "to", combinedMaxY.toFixed(2));
            console.log("  Total height:", totalHeight.toFixed(2));
            console.log("  Zone height:", zoneHeight.toFixed(2));
            console.log("  Lower sphere Y:", lowerBox.min.y.toFixed(2), "to", lowerBox.max.y.toFixed(2));
            console.log("  Upper sphere Y:", upperBox.min.y.toFixed(2), "to", upperBox.max.y.toFixed(2));
            
            // Calculate Y boundaries for each chakra zone across the entire stacked structure
            const zoneBoundaries = [];
            for (let i = 0; i < 7; i++) {
                const yStart = combinedMinY + (i * zoneHeight);
                const yEnd = combinedMinY + ((i + 1) * zoneHeight);
                zoneBoundaries.push({ yStart, yEnd, chakra: i + 1, color: chakraColors[i] });
            }
            
            console.log("Chakra zone boundaries across stacked spheres:");
            zoneBoundaries.forEach(zone => {
                console.log(`  ${zone.chakra}. Y ${zone.yStart.toFixed(2)} to ${zone.yEnd.toFixed(2)}`);
            });
            
            // Apply shader material to BOTH spheres for consistent chakra zones
            const shaderMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    chakraColors: { value: chakraColors.map(c => new THREE.Color(c)) },
                    chakraIntensities: { value: new Array(7).fill(0.0) }, // All off initially
                    zoneBoundaries: { value: zoneBoundaries.map(z => [z.yStart, z.yEnd]).flat() },
                    minY: { value: combinedMinY },
                    maxY: { value: combinedMaxY }
                },
                vertexShader: `
                    varying vec3 vPosition;
                    varying vec3 vWorldPosition;
                    varying vec3 vNormal;
                    
                    void main() {
                        vPosition = position;
                        vNormal = normalize(normalMatrix * normal);
                        
                        // Get world position for consistent zone calculation
                        vec4 worldPos = modelMatrix * vec4(position, 1.0);
                        vWorldPosition = worldPos.xyz;
                        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 chakraColors[7];
                    uniform float chakraIntensities[7];
                    uniform float zoneBoundaries[14]; // 7 zones * 2 values (start, end)
                    uniform float minY;
                    uniform float maxY;
                    
                    varying vec3 vPosition;
                    varying vec3 vWorldPosition;
                    varying vec3 vNormal;
                    
                    void main() {
                        vec3 baseColor = vec3(0.8, 0.8, 0.8); // Default gray
                        vec3 emissiveColor = vec3(0.0);
                        
                        // Use world position Y for consistent zone calculation across both spheres
                        float worldY = vWorldPosition.y;
                        
                        for (int i = 0; i < 7; i++) {
                            float zoneStart = zoneBoundaries[i * 2];
                            float zoneEnd = zoneBoundaries[i * 2 + 1];
                            
                            if (worldY >= zoneStart && worldY <= zoneEnd) {
                                float intensity = chakraIntensities[i];
                                baseColor = mix(baseColor, chakraColors[i], intensity);
                                emissiveColor = chakraColors[i] * intensity * 0.3;
                                break;
                            }
                        }
                        
                        // Simple lighting calculation
                        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                        float lightIntensity = max(0.0, dot(vNormal, lightDir)) * 0.8 + 0.2;
                        
                        vec3 finalColor = baseColor * lightIntensity + emissiveColor;
                        gl_FragColor = vec4(finalColor, 1.0);
                    }
                `
            });
            
            console.log("Applying unified shader material to both spheres");
            lowerSpheroid.material = shaderMaterial;
            upperSpheroid.material = shaderMaterial;
            
            // Store data for future use
            lowerSpheroid.userData.shaderMaterial = shaderMaterial;
            upperSpheroid.userData.shaderMaterial = shaderMaterial;
            upperSpheroid.userData.zoneBoundaries = zoneBoundaries;
            lowerSpheroid.userData.zoneBoundaries = zoneBoundaries;
            
            console.log("Chakra zone setup complete - ready for animation control");
        }
        
        console.log("=== CHAKRA SETUP COMPLETE ===\n");
    }, [scene, chakraColors]);
    
    return <primitive object={scene} {...props} />;
}
