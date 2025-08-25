# AuraFlow Implementation Plan

**Project**: Chakra breathing companion with 3D visualization  
**Timeline**: 6-8 weeks MVP  
**Philosophy**: Small, testable increments - one feature at a time

---

## Phase 1: Foundation & Model Preparation (Week 1)

### Step 1.1: Model Analysis & Chakra Zone Definition
**Goal**: Understand current model structure and identify chakra zones  
**Time**: 1-2 days  
**Tasks**:
- [ ] Inspect current GLB model in Blender to understand geometry structure
- [ ] Identify if spheroids have separate meshes or are single objects
- [ ] Document model hierarchy (groups, meshes, materials)
- [ ] Determine how to divide spheres into 7 chakra zones (by vertex groups, UV mapping, or geometry)
- [ ] Create test version with visible zone boundaries for verification

**Deliverable**: Documentation of model structure and chakra zone strategy

### Step 1.2: Basic Timer Component
**Goal**: Create simple 5s inhale/5s exhale timer  
**Time**: 1 day  
**Tasks**:
- [ ] Create `Timer.jsx` component with useState for current time
- [ ] Implement basic countdown: 5s inhale → 5s exhale → repeat
- [ ] Add phase tracking: 'inhale' | 'exhale'
- [ ] Display timer state in UI for testing
- [ ] Add start/stop controls

**Deliverable**: Working timer component with visual feedback

**Test**: Timer counts accurately, phases transition correctly

### Step 1.3: Timer Integration with 3D Scene
**Goal**: Connect timer to BreathingCanvas  
**Time**: 1 day  
**Tasks**:
- [ ] Pass timer state to BreathingCanvas as props
- [ ] Create useEffect in BreathingCanvas to respond to timer changes
- [ ] Add console.log to verify timer data reaches 3D scene
- [ ] Test phase transitions trigger in 3D component

**Deliverable**: Timer state flowing to 3D scene

**Test**: Console shows timer updates in 3D component

---

## Phase 2: Basic Chakra Zone Lighting (Week 2)

### Step 2.1: Model Material Setup
**Goal**: Prepare model for programmable lighting  
**Time**: 2 days  
**Tasks**:
- [ ] Modify GLB model to have separate materials for each chakra zone
- [ ] Create 7 distinct materials with chakra colors (red→violet)
- [ ] Test material assignments in Three.js
- [ ] Implement material.emissive control for glow effect
- [ ] Verify each zone can be controlled independently

**Deliverable**: Model with 7 controllable chakra zone materials

**Test**: Each chakra zone can change color/brightness independently

### Step 2.2: Progressive Zone Lighting - Inhale
**Goal**: Light up zones 1→7 during 5s inhale  
**Time**: 2 days  
**Tasks**:
- [ ] Create `ChakraController.jsx` component
- [ ] Calculate which chakras should be active based on timer progress
- [ ] Map timer progress (0-1) to chakra activation (zones 1-7)
- [ ] Implement smooth brightness interpolation for each zone
- [ ] Connect to timer inhale phase

**Deliverable**: Chakras light up progressively during inhale

**Test**: All 7 chakras gradually brighten over 5 seconds during inhale

### Step 2.3: Progressive Zone Dimming - Exhale
**Goal**: Dim zones 7→1 during 5s exhale  
**Time**: 1 day  
**Tasks**:
- [ ] Reverse the progression for exhale phase
- [ ] Map timer progress to chakra deactivation (zones 7-1)
- [ ] Implement smooth dimming interpolation
- [ ] Test full cycle: brighten on inhale, dim on exhale

**Deliverable**: Complete chakra lighting cycle

**Test**: Full breath cycle shows smooth lighting transitions

---

## Phase 3: Audio Integration (Week 3)

### Step 3.1: Tone.js Setup
**Goal**: Basic audio infrastructure  
**Time**: 1 day  
**Tasks**:
- [ ] Install and configure Tone.js
- [ ] Create `AudioController.jsx` component
- [ ] Set up basic oscillator for tone generation
- [ ] Test audio playback in browser
- [ ] Handle browser audio permission requirements

**Deliverable**: Working Tone.js setup with basic sound

**Test**: Can generate and play simple tones

### Step 3.2: Pitch Modulation - Inhale
**Goal**: Rising tone during inhale  
**Time**: 2 days  
**Tasks**:
- [ ] Map timer progress to frequency range for inhale
- [ ] Choose frequency range (e.g., 200Hz → 400Hz)
- [ ] Implement smooth frequency transitions
- [ ] Sync audio start/stop with timer phases
- [ ] Test audio-visual synchronization

**Deliverable**: Rising tone during inhale phase

**Test**: Tone pitch rises smoothly as chakras light up

### Step 3.3: Pitch Modulation - Exhale
**Goal**: Falling tone during exhale  
**Time**: 1 day  
**Tasks**:
- [ ] Implement descending frequency for exhale phase
- [ ] Ensure smooth transition from inhale to exhale pitch
- [ ] Test full audio cycle
- [ ] Fine-tune frequency ranges for pleasant sound

**Deliverable**: Complete audio breathing cycle

**Test**: Audio and visual are perfectly synchronized

### Step 3.4: Audio Polish
**Goal**: Improve audio quality and user experience  
**Time**: 1 day  
**Tasks**:
- [ ] Add volume controls
- [ ] Implement audio fade in/out for smooth start/stop
- [ ] Choose better waveform (sine, triangle, etc.)
- [ ] Add subtle reverb or effects for ambiance
- [ ] Test on different devices/browsers

**Deliverable**: Polished audio experience

**Test**: Audio sounds good and works across devices

---

## Phase 4: Visual Polish & Effects (Week 4)

### Step 4.1: Glow Effects
**Goal**: Add glowing effects to chakra zones  
**Time**: 2 days  
**Tasks**:
- [ ] Implement bloom post-processing effect
- [ ] Add emissive materials to chakra zones
- [ ] Control glow intensity with breathing cycle
- [ ] Test performance impact
- [ ] Optimize for smooth frame rate

**Deliverable**: Glowing chakra zones

**Test**: Glow effects enhance visual without performance issues

### Step 4.2: Color Saturation & Transitions
**Goal**: Smooth color transitions and saturation effects  
**Time**: 2 days  
**Tasks**:
- [ ] Implement smooth color interpolation between chakra colors
- [ ] Add saturation control for breathing phases
- [ ] Create smooth transitions between inactive/active states
- [ ] Test color accuracy on different screens
- [ ] Ensure accessibility (color blind considerations)

**Deliverable**: Beautiful color transitions

**Test**: Colors transition smoothly and are visually appealing

### Step 4.3: Camera and Scene Polish
**Goal**: Optimize viewing experience  
**Time**: 1 day  
**Tasks**:
- [ ] Fine-tune camera position and controls
- [ ] Add subtle camera movements (optional)
- [ ] Optimize lighting for best visual impact
- [ ] Test different viewing angles
- [ ] Ensure model is well-framed on all devices

**Deliverable**: Optimized 3D scene presentation

**Test**: 3D scene looks great from all angles

---

## Phase 5: Comet Animation (Week 5)

### Step 5.1: Figure-8 Path Creation
**Goal**: Mathematical path for comet movement  
**Time**: 2 days  
**Tasks**:
- [ ] Create mathematical function for figure-8 path around spheres
- [ ] Map path coordinates to 3D space
- [ ] Test path visualization (simple sphere following path)
- [ ] Ensure path follows sphere surfaces correctly
- [ ] Adjust path to match breathing timing

**Deliverable**: Working figure-8 path

**Test**: Object can smoothly follow figure-8 path around spheres

### Step 5.2: Comet Visual Design
**Goal**: Create comet appearance with tail  
**Time**: 2 days  
**Tasks**:
- [ ] Design comet head (bright sphere/particle)
- [ ] Implement trailing effect (particle system or geometry)
- [ ] Control comet brightness and tail length
- [ ] Test different visual approaches for best effect
- [ ] Optimize performance

**Deliverable**: Visually appealing comet with tail

**Test**: Comet looks good and performs well

### Step 5.3: Comet Animation Integration
**Goal**: Sync comet with breathing cycle  
**Time**: 1 day  
**Tasks**:
- [ ] Map breathing cycle to comet position on path
- [ ] Sync comet speed with timer
- [ ] Test comet + chakra zone lighting together
- [ ] Decide on comet as addition to or replacement for zone lighting
- [ ] Fine-tune for best visual impact

**Deliverable**: Comet animation synchronized with breathing

**Test**: Comet moves smoothly and enhances the breathing experience

---

## Phase 6: State Management & Multiple Patterns (Week 6)

### Step 6.1: Zustand Setup
**Goal**: Centralized state management  
**Time**: 1 day  
**Tasks**:
- [ ] Install and configure Zustand
- [ ] Move timer state to Zustand store
- [ ] Move audio/visual settings to store
- [ ] Refactor components to use store
- [ ] Test state persistence and updates

**Deliverable**: Centralized state management

**Test**: All components access state through store correctly

### Step 6.2: Multiple Breathing Patterns
**Goal**: Support different timing patterns  
**Time**: 2 days  
**Tasks**:
- [ ] Create pattern definitions (4-7-8, box breathing, etc.)
- [ ] Implement pattern selection UI
- [ ] Update timer to support variable durations
- [ ] Test audio/visual sync with different patterns
- [ ] Add pattern switching during runtime

**Deliverable**: Multiple breathing pattern support

**Test**: All patterns work correctly with audio/visual sync

### Step 6.3: Custom Duration Settings
**Goal**: User-configurable timing  
**Time**: 2 days  
**Tasks**:
- [ ] Create duration input controls (0.5s increments)
- [ ] Update timer to accept custom durations
- [ ] Validate input ranges (reasonable limits)
- [ ] Test custom patterns with audio/visual
- [ ] Save user preferences (localStorage)

**Deliverable**: Customizable breathing timing

**Test**: Users can create and use custom breathing patterns

---

## Phase 7: Mobile Responsiveness & iOS Optimization (Week 7)

### Step 7.1: Responsive Design
**Goal**: Work well on all iPhone sizes  
**Time**: 2 days  
**Tasks**:
- [ ] Test on various iPhone screen sizes
- [ ] Adjust camera and UI for mobile viewports
- [ ] Optimize touch controls for mobile
- [ ] Test landscape/portrait orientations
- [ ] Ensure proper scaling on different pixel densities

**Deliverable**: Mobile-responsive experience

**Test**: App works well on all target iPhone models

### Step 7.2: Performance Optimization
**Goal**: Smooth performance on mobile devices  
**Time**: 2 days  
**Tasks**:
- [ ] Profile performance on mobile devices
- [ ] Optimize 3D rendering for mobile GPUs
- [ ] Reduce memory usage
- [ ] Optimize audio processing
- [ ] Test battery usage impact

**Deliverable**: Optimized mobile performance

**Test**: App runs smoothly with good battery life

### Step 7.3: iOS Web App Features
**Goal**: Native-like iOS experience  
**Time**: 1 day  
**Tasks**:
- [ ] Add PWA manifest for "Add to Home Screen"
- [ ] Configure iOS Safari meta tags
- [ ] Test fullscreen mode
- [ ] Handle iOS-specific audio quirks
- [ ] Test offline capability (if needed)

**Deliverable**: iOS-optimized web app

**Test**: App feels native on iOS devices

---

## Phase 8: Final Polish & Testing (Week 8)

### Step 8.1: User Experience Polish
**Goal**: Refined, intuitive experience  
**Time**: 2 days  
**Tasks**:
- [ ] Add subtle UI animations and transitions
- [ ] Implement loading states and error handling
- [ ] Add user onboarding/instructions
- [ ] Test accessibility features
- [ ] Polish visual design details

**Deliverable**: Polished user experience

**Test**: App is intuitive and delightful to use

### Step 8.2: Comprehensive Testing
**Goal**: Ensure reliability across scenarios  
**Time**: 2 days  
**Tasks**:
- [ ] Test all breathing patterns thoroughly
- [ ] Test audio/visual sync in various conditions
- [ ] Test performance under different loads
- [ ] Test error conditions and recovery
- [ ] Conduct user testing with target audience

**Deliverable**: Thoroughly tested application

**Test**: App works reliably in all scenarios

### Step 8.3: Documentation & Deployment Prep
**Goal**: Ready for deployment  
**Time**: 1 day  
**Tasks**:
- [ ] Update documentation
- [ ] Create deployment instructions
- [ ] Prepare for iOS app store submission (if needed)
- [ ] Create user guide/help content
- [ ] Final code cleanup and comments

**Deliverable**: Deployment-ready application

**Test**: App is ready for production use

---

## Risk Mitigation & Contingencies

### High-Risk Items:
1. **Audio-visual sync complexity**: If sync proves difficult, implement simple click-based rhythm first
2. **Comet animation performance**: If too complex, focus on chakra zone lighting only
3. **3D model limitations**: If current model unsuitable, create simpler geometric version
4. **Mobile performance**: If poor, reduce visual effects and optimize aggressively

### Buffer Time:
- Each phase includes 10-15% buffer for unexpected issues
- Week 8 can extend into week 9 if needed
- Comet animation (Phase 5) can be moved to post-MVP if necessary

### Success Metrics:
- [ ] Smooth 60fps animation on target devices
- [ ] Perfect audio-visual synchronization
- [ ] Intuitive user experience requiring minimal instruction
- [ ] Visually beautiful and calming atmosphere
- [ ] Reliable performance across different iOS devices
