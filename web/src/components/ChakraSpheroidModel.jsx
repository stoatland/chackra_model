import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import debug from '../utils/debug';

export default function ChakraSpheroidModel({ timerState, ...props }) {
    const { scene } = useGLTF("/models/spheroids.glb");
    
    // Log timer state changes in the model
    useEffect(() => {
        if (timerState) {
            debug.chakra("=== CHAKRA MODEL RECEIVED TIMER UPDATE ===");
            debug.chakra("Timer Phase:", timerState.phase);
            debug.chakra("Timer Progress:", timerState.progress.toFixed(3));
            debug.chakra("Timer Running:", timerState.isRunning);
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
        
        debug.chakra(`Chakra ${chakraIndex + 1} intensity set to ${intensity}`);
    };

        // Timer-driven chakra control - Phase 2.1
    useEffect(() => {
        if (!timerState || !timerState.isRunning) return;
        
        debug.chakra(`Timer-driven chakra control: phase=${timerState.phase}, progress=${timerState.progress}`);
        
        if (timerState.phase === 'inhale') {
            // Progressive chakra activation (1-7) during inhale
            const activeChakras = Math.min(7, Math.floor(timerState.progress * 7) + 1);
            const currentProgress = (timerState.progress * 7) % 1; // Fractional part for smooth transitions
            
            for (let i = 0; i < 7; i++) {
                let intensity = 0.1; // Base dim level
                
                if (i < activeChakras - 1) {
                    // Fully activated chakras
                    intensity = 1.0;
                } else if (i === activeChakras - 1) {
                    // Currently activating chakra with smooth transition
                    intensity = 0.1 + (0.9 * currentProgress);
                }
                
                setChakraIntensity(i, intensity);
            }
        } else if (timerState.phase === 'exhale') {
            // Progressive chakra deactivation (7-1) during exhale
            const dimmedChakras = Math.min(7, Math.floor(timerState.progress * 7) + 1);
            const currentProgress = (timerState.progress * 7) % 1; // Fractional part for smooth transitions
            
            for (let i = 0; i < 7; i++) {
                const reverseIndex = 6 - i; // 6,5,4,3,2,1,0 for chakras 7,6,5,4,3,2,1
                let intensity = 1.0; // Start fully bright
                
                if (reverseIndex < dimmedChakras - 1) {
                    // Fully dimmed chakras
                    intensity = 0.1;
                } else if (reverseIndex === dimmedChakras - 1) {
                    // Currently dimming chakra with smooth transition
                    intensity = 1.0 - (0.9 * currentProgress);
                }
                
                setChakraIntensity(i, intensity);
            }
        }
    }, [timerState]);
    
    useEffect(() => {
        debug.chakra("=== FULL CHAKRA ZONE SETUP ===");
        
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
            
            debug.chakra("Original sphere dimensions:");
            debug.chakra("  Lower sphere height:", lowerHeight.toFixed(2), "radius:", lowerRadius.toFixed(2));
            debug.chakra("  Upper sphere height:", upperHeight.toFixed(2), "radius:", upperRadius.toFixed(2));
            debug.chakra("  Lower sphere position - X:", originalLowerBox.min.x.toFixed(2), "to", originalLowerBox.max.x.toFixed(2));
            debug.chakra("  Lower sphere position - Z:", originalLowerBox.min.z.toFixed(2), "to", originalLowerBox.max.z.toFixed(2));
            debug.chakra("  Upper sphere position - X:", originalUpperBox.min.x.toFixed(2), "to", originalUpperBox.max.x.toFixed(2));
            debug.chakra("  Upper sphere position - Z:", originalUpperBox.min.z.toFixed(2), "to", originalUpperBox.max.z.toFixed(2));
            
            // Position spheres so they touch AND are aligned on X and Z axes:
            // Both spheres should be centered at X=0, Z=0
            // Lower sphere bottom at -lowerRadius, top at 0
            // Upper sphere bottom at 0, top at +upperRadius
            lowerSpheroid.position.set(0, -lowerRadius, 0);   // Center at origin, move down
            upperSpheroid.position.set(0, upperRadius, 0);    // Center at origin, move up
            
            // Force matrix updates to ensure positioning takes effect immediately
            lowerSpheroid.updateMatrixWorld(true);
            upperSpheroid.updateMatrixWorld(true);
            
            debug.chakra("Repositioned for touching and alignment:");
            debug.chakra("  Lower sphere positioned at:", lowerSpheroid.position.x.toFixed(2), lowerSpheroid.position.y.toFixed(2), lowerSpheroid.position.z.toFixed(2));
            debug.chakra("  Upper sphere positioned at:", upperSpheroid.position.x.toFixed(2), upperSpheroid.position.y.toFixed(2), upperSpheroid.position.z.toFixed(2));
            
            // Get bounding boxes AFTER repositioning
            const upperBox = new THREE.Box3().setFromObject(upperSpheroid);
            const lowerBox = new THREE.Box3().setFromObject(lowerSpheroid);
            
            // Calculate total height spanning both stacked spheres
            const combinedMinY = lowerBox.min.y;  // Bottom of lower sphere
            const combinedMaxY = upperBox.max.y;  // Top of upper sphere
            const totalHeight = combinedMaxY - combinedMinY;
            const zoneHeight = totalHeight / 7;
            
            debug.chakra("Stacked sphere dimensions:");
            debug.chakra("  Combined Y range:", combinedMinY.toFixed(2), "to", combinedMaxY.toFixed(2));
            debug.chakra("  Total height:", totalHeight.toFixed(2));
            debug.chakra("  Zone height:", zoneHeight.toFixed(2));
            debug.chakra("  Lower sphere Y:", lowerBox.min.y.toFixed(2), "to", lowerBox.max.y.toFixed(2));
            debug.chakra("  Upper sphere Y:", upperBox.min.y.toFixed(2), "to", upperBox.max.y.toFixed(2));
            
            // Calculate Y boundaries for each chakra zone across the entire stacked structure
            const zoneBoundaries = [];
            for (let i = 0; i < 7; i++) {
                const yStart = combinedMinY + (i * zoneHeight);
                const yEnd = combinedMinY + ((i + 1) * zoneHeight);
                zoneBoundaries.push({ yStart, yEnd, chakra: i + 1, color: chakraColors[i] });
            }
            
            debug.chakra("Chakra zone boundaries across stacked spheres:");
            zoneBoundaries.forEach(zone => {
                debug.chakra(`  ${zone.chakra}. Y ${zone.yStart.toFixed(2)} to ${zone.yEnd.toFixed(2)}`);
            });
            
            // Apply shader material to BOTH spheres for consistent chakra zones
            const shaderMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    chakraColors: { value: chakraColors.map(c => new THREE.Color(c)) },
                    chakraIntensities: { value: new Array(7).fill(0.1) }, // Start dim
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
                        vec3 baseColor = vec3(0.3, 0.3, 0.4); // Darker base for better contrast
                        vec3 emissiveColor = vec3(0.0);
                        
                        // Use world position Y for consistent zone calculation across both spheres
                        float worldY = vWorldPosition.y;
                        
                        for (int i = 0; i < 7; i++) {
                            float zoneStart = zoneBoundaries[i * 2];
                            float zoneEnd = zoneBoundaries[i * 2 + 1];
                            
                            if (worldY >= zoneStart && worldY <= zoneEnd) {
                                float intensity = chakraIntensities[i];
                                
                                // Enhanced color mixing and emissive glow
                                baseColor = mix(baseColor, chakraColors[i], intensity * 0.7);
                                emissiveColor = chakraColors[i] * intensity * 0.5; // Stronger emissive
                                break;
                            }
                        }
                        
                        // Simple lighting calculation
                        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                        float lightIntensity = max(0.0, dot(vNormal, lightDir)) * 0.6 + 0.4;
                        
                        vec3 finalColor = baseColor * lightIntensity + emissiveColor;
                        gl_FragColor = vec4(finalColor, 1.0);
                    }
                `
            });
            
            debug.chakra("Applying unified shader material to both spheres for timer control");
            lowerSpheroid.material = shaderMaterial;
            upperSpheroid.material = shaderMaterial;
            
            // Store data for future use
            lowerSpheroid.userData.shaderMaterial = shaderMaterial;
            upperSpheroid.userData.shaderMaterial = shaderMaterial;
            upperSpheroid.userData.zoneBoundaries = zoneBoundaries;
            lowerSpheroid.userData.zoneBoundaries = zoneBoundaries;
            
            debug.chakra("Chakra zone setup complete - ready for animation control");
        }
        
        debug.chakra("=== CHAKRA SETUP COMPLETE ===\n");
    }, [scene, chakraColors]);
    
    return <primitive object={scene} {...props} />;
}
