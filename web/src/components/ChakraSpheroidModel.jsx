import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export default function ChakraSpheroidModel(props) {
    const { scene } = useGLTF("/models/spheroids.glb");
    
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
        const lowerSpheroid = scene.getObjectByName('lowerSpheroid');
        
        if (lowerSpheroid?.userData.shaderMaterial) {
            const material = lowerSpheroid.userData.shaderMaterial;
            material.uniforms.chakraIntensities.value[chakraIndex] = intensity;
            material.needsUpdate = true;
            console.log(`Chakra ${chakraIndex + 1} intensity set to ${intensity}`);
        }
    };

    // Test chakra control after setup (temporary for testing)
    useEffect(() => {
        const timer = setTimeout(() => {
            console.log("=== TESTING CHAKRA CONTROL ===");
            // Light up chakra 1 (root) at 50% intensity
            setChakraIntensity(0, 0.5);
            
            // Light up chakra 4 (heart) at 75% intensity after 1 second
            setTimeout(() => setChakraIntensity(3, 0.75), 1000);
            
            // Light up chakra 7 (crown) at 100% intensity after 2 seconds
            setTimeout(() => setChakraIntensity(6, 1.0), 2000);
        }, 2000);
        
        return () => clearTimeout(timer);
    }, [scene]);
    
    useEffect(() => {
        console.log("=== FULL CHAKRA ZONE SETUP ===");
        
        // Find our spheres
        const upperSpheroid = scene.getObjectByName('upperSpheroid');
        const lowerSpheroid = scene.getObjectByName('lowerSpheroid');
        
        if (upperSpheroid && lowerSpheroid) {
            // Get bounding boxes
            const upperBox = new THREE.Box3().setFromObject(upperSpheroid);
            const lowerBox = new THREE.Box3().setFromObject(lowerSpheroid);
            
            // Calculate total height and zone boundaries
            const totalHeight = Math.abs(upperBox.max.y) + Math.abs(lowerBox.min.y);
            const zoneHeight = totalHeight / 7;
            
            console.log("Total height:", totalHeight);
            console.log("Zone height:", zoneHeight);
            console.log("Lower sphere Y range:", lowerBox.min.y, "to", lowerBox.max.y);
            console.log("Upper sphere Y range:", upperBox.min.y, "to", upperBox.max.y);
            
            // Calculate Y boundaries for each chakra zone
            const zoneBoundaries = [];
            for (let i = 0; i < 7; i++) {
                const yStart = lowerBox.min.y + (i * zoneHeight);
                const yEnd = lowerBox.min.y + ((i + 1) * zoneHeight);
                zoneBoundaries.push({ yStart, yEnd, chakra: i + 1, color: chakraColors[i] });
            }
            
            console.log("Chakra zone boundaries:", zoneBoundaries);
            
            // Create shader material for lower sphere (chakras 1-3 + half of 4)
            const lowerShaderMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    chakraColors: { value: chakraColors.map(c => new THREE.Color(c)) },
                    chakraIntensities: { value: new Array(7).fill(0.0) }, // All off initially
                    zoneBoundaries: { value: zoneBoundaries.map(z => [z.yStart, z.yEnd]).flat() },
                    minY: { value: lowerBox.min.y },
                    maxY: { value: lowerBox.max.y }
                },
                vertexShader: `
                    varying vec3 vPosition;
                    varying vec3 vNormal;
                    
                    void main() {
                        vPosition = position;
                        vNormal = normalize(normalMatrix * normal);
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
                    varying vec3 vNormal;
                    
                    void main() {
                        vec3 baseColor = vec3(0.8, 0.8, 0.8); // Default gray
                        vec3 emissiveColor = vec3(0.0);
                        
                        // Determine which chakra zone this fragment belongs to
                        float worldY = vPosition.y;
                        
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
            
            // For now, use a simpler test - create upper sphere with violet, lower with red
            // We'll implement the full shader system next
            const testUpperMaterial = new THREE.MeshStandardMaterial({
                color: chakraColors[6], // Violet
                emissive: new THREE.Color(chakraColors[6]).multiplyScalar(0.1),
                emissiveIntensity: 0.2
            });
            
            const testLowerMaterial = new THREE.MeshStandardMaterial({
                color: chakraColors[0], // Red  
                emissive: new THREE.Color(chakraColors[0]).multiplyScalar(0.1),
                emissiveIntensity: 0.2
            });
            
            // Apply the shader material to lower sphere (for now, testing)
            console.log("Applying shader material to lower sphere");
            lowerSpheroid.material = lowerShaderMaterial;
            
            // Keep upper sphere simple for comparison
            upperSpheroid.material = testUpperMaterial;
            
            // Store data for future use
            lowerSpheroid.userData.shaderMaterial = lowerShaderMaterial;
            upperSpheroid.userData.zoneBoundaries = zoneBoundaries;
            lowerSpheroid.userData.zoneBoundaries = zoneBoundaries;
            
            console.log("Chakra zone setup complete - ready for animation control");
        }
        
        console.log("=== CHAKRA SETUP COMPLETE ===\n");
    }, [scene, chakraColors]);
    
    return <primitive object={scene} {...props} />;
}
