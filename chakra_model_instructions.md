# Chakra Model Instructions

## Project Overview
- **Goal**: AuraFlow breathing companion with 3D chakra visualization
- **Learning Focus**: React + Three.js/R3F + 3D graphics + audio synchronization
- **Development Philosophy**: Small, testable increments
- **Target Platform**: iOS web app (responsive design required)
- **Development Strategy**: Do as much dev as possible in VSCode, move to Xcode only when needed

## Development Principles
- Always build the simplest version first
- Test each feature before adding complexity
- One component/feature per iteration
- Debug immediately, don't accumulate issues
- Refer to this file for consistency and to avoid repetition

## Tech Stack
- **Frontend**: React + Vite
- **3D**: Three.js + React Three Fiber + Drei
- **Models**: Blender → GLB format
- **Audio**: Tone.js for pitch modulation and synthesis
- **State**: Zustand (only if needed for timer/animation coordination)
- **No Backend**: Sessions not saved in this version

## File Structure & Conventions
```
chackra_model/
├── core/           # Shared business logic
├── ios/            # iOS-specific code (Xcode when needed)
├── web/            # Web development (VSCode primary)
│   ├── public/
│   │   └── models/
│   │       └── spheroids.glb
│   ├── src/
│   │   ├── components/
│   │   │   └── BreathingCanvas.jsx
│   │   └── App.jsx
│   └── package.json
└── chakra_model_instructions.md
└── index.html
```

## 3D Model Structure
```
Upper Sphere (chakras 5-7 + top half of 4)
     `----'     ← Chakra 7 (crown)
   .'      `.   
  /----------\  ← Chakra 6 (third eye)
 |            |
 |------------|  ← Chakra 5 (throat)
 |            |
  \----------/   ← Top half of Chakra 4 (heart)
   `.      .'   
     `    '     ← Connection point
     `    '     
   .'      `.   
  /----------\   ← Bottom half of Chakra 4 (heart)
 |            |
 |------------|  ← Chakra 3 (solar plexus)
 |            |
 |------------|  ← Chakra 2 (sacral)
 |            |
  \----------/   ← Chakra 1 (root)
   `.      .'   
     `----'     
Lower Sphere (chakras 1-3 + bottom half of 4)
```

## Chakra System
- **7 chakras total**, each = 1/7th of combined sphere volume
- **Chakra 4 (heart)** spans both spheres, split 50/50 at connection point
- **Color sequence**: 1=Red, 2=Orange, 3=Yellow, 4=Green, 5=Blue, 6=Indigo, 7=Violet
- **Zones**: Spherical bands/zones, not rings

## Animation Specifications

### Breathing Pattern (Initial)
- **Inhale**: 5 seconds
- **Exhale**: 5 seconds
- **Future**: Multiple patterns, user-selectable durations (0.5s intervals)

### Chakra Zone Animation
- **Inhale (5s)**: Zones light up progressively 1→2→3→4→5→6→7
- **Exhale (5s)**: Zones dim progressively 7→6→5→4→3→2→1
- **Effects**: Glow, saturation, physics effects
- **Experimentation needed**: Final brightness levels, dimming curves

### Comet Animation
- **Path**: True figure-8 (∞) around both spheres
- **Route**: Bottom lower sphere → up one side → through connection → up upper sphere → curve at top → down opposite side → through connection → down opposite side lower sphere → back to start
- **Appearance**: Bright head with glowing tail
- **Status**: Experimental - may be additional to OR instead of zone lighting

### Audio Synchronization
- **Inhale**: Rising tone (pitch increases with zone brightening)
- **Exhale**: Descending tone (pitch decreases with zone dimming)
- **Requirement**: Perfect sync between visual and audio
- **Implementation**: Tone.js for smooth pitch modulation

## Current State
- ✅ Basic 3D scene with camera controls
- ✅ GLB model loading (two spheroids)
- ✅ Camera positioned at [5, 5, 5] for good 3D view
- 🔄 **Currently working on**: Instructions file creation

## 3D Model Guidelines
- **Path**: `/models/spheroids.glb` (served from public/models/)

## Component Guidelines
- **BreathingCanvas.jsx**: Main 3D scene container
- **SpheroidsModel**: GLB loader component
- Keep components small and focused
- Use React Three Fiber patterns
- Handle loading states with Suspense

## Testing Approach
- Test each feature immediately after implementation
- Use browser console for debugging 3D scene
- Verify model loading with console.log
- Test responsiveness on different iPhone screen sizes
- Audio testing: ensure sync with visual animations

## Next Steps Queue
See the detailed implementation plan: /implementation_plan.md

## Key Reminders
- Build incrementally - one feature at a time
- Always refer to this file for specifications
- Chakra 4 spans both spheres at connection point
- Comet traces true figure-8, not figure-3
- Each chakra = 1/7th of total combined sphere volume
- Audio and visual must stay perfectly synchronized
- Develop primarily in VSCode, use Xcode only when necessary
