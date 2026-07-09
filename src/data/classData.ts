export interface Topic {
  id: string
  title: string
  description: string
  content: string
  formulas: { name: string; formula: string }[]
  icon: string
  topic: 'ray-optics' | 'wave-optics'
}

export const topics: Topic[] = [
  {
    id: 'reflection',
    title: 'Reflection of Light',
    description: 'Laws of reflection, plane and spherical mirrors',
    icon: '🪞',
    topic: 'ray-optics',
    content: `Reflection is the phenomenon where light bounces off a surface. The two laws of reflection state:
1. The incident ray, reflected ray, and normal all lie in the same plane.
2. The angle of incidence equals the angle of reflection (i = r).

For plane mirrors, the image is virtual, erect, and the same size as the object.
For spherical mirrors (concave and convex), image formation depends on the object's position relative to the focal point and center of curvature.

Key terms:
- Focus (F): Point where parallel rays converge/meet
- Center of Curvature (C): Center of the sphere
- Radius of Curvature (R): R = 2f
- Principal Axis: Line through C and F`,
    formulas: [
      { name: 'Mirror Formula', formula: '1/f = 1/u + 1/v' },
      { name: 'Magnification', formula: 'm = -v/u = hᵢ/hₒ' },
      { name: 'Focal Length', formula: 'f = R/2' },
    ],
  },
  {
    id: 'refraction',
    title: 'Refraction of Light',
    description: 'Snell\'s law, refractive index, total internal reflection',
    icon: '💧',
    topic: 'ray-optics',
    content: `Refraction is the bending of light when it passes from one medium to another due to a change in speed.

Snell's Law: n₁ sin θ₁ = n₂ sin θ₂

The refractive index (n) of a medium is the ratio of the speed of light in vacuum to that in the medium:
n = c/v

Total Internal Reflection (TIR) occurs when:
1. Light travels from a denser to a rarer medium
2. The angle of incidence exceeds the critical angle

Critical angle: sin(θ_c) = n₂/n₁

Applications: Optical fibers, mirages, diamonds' sparkle, endoscopy.`,
    formulas: [
      { name: "Snell's Law", formula: 'n₁ sin θ₁ = n₂ sin θ₂' },
      { name: 'Refractive Index', formula: 'n = c/v' },
      { name: 'Critical Angle', formula: 'sin θ_c = n₂/n₁' },
    ],
  },
  {
    id: 'lenses',
    title: 'Lenses & Optical Instruments',
    description: 'Lens formula, power, microscope, telescope',
    icon: '🔬',
    topic: 'ray-optics',
    content: `A lens is a transparent medium bounded by two spherical surfaces.

Types:
- Convex (converging): Thicker at center, brings rays together
- Concave (diverging): Thinner at center, spreads rays apart

Lens Maker's Formula: 1/f = (n - 1)(1/R₁ - 1/R₂)

Power of a lens: P = 1/f (in meters), unit: Diopter (D)
For combination: P = P₁ + P₂

Optical Instruments:
- Simple Microscope: Magnifies using a single convex lens
- Compound Microscope: Uses objective + eyepiece
- Astronomical Telescope: Uses large objective + eyepiece`,
    formulas: [
      { name: 'Lens Formula', formula: '1/f = 1/v - 1/u' },
      { name: 'Lens Maker\'s Formula', formula: '1/f = (n-1)(1/R₁ - 1/R₂)' },
      { name: 'Power of Lens', formula: 'P = 1/f (meters)' },
      { name: 'Magnification (Simple)', formula: 'M = 1 + D/f' },
    ],
  },
  {
    id: 'dispersion',
    title: 'Dispersion of Light',
    description: 'Prism, rainbow formation, Cauchy\'s formula',
    icon: '🌈',
    topic: 'ray-optics',
    content: `Dispersion is the splitting of white light into its constituent colors when it passes through a prism.

The deviation depends on wavelength:
- Violet deviates the most (shortest λ, highest n)
- Red deviates the least (longest λ, lowest n)

Angular Dispersion: θ_v - θ_r
Dispersive Power: ω = (n_v - n_r)/(n_y - 1)

Rainbow Formation:
- Sunlight enters a raindrop
- Refraction at entry → dispersion → total internal reflection → refraction at exit
- Primary rainbow: 42° angle, red on top
- Secondary rainbow: 52° angle, violet on top

Cauchy's Formula: n = A + B/λ²`,
    formulas: [
      { name: 'Angular Dispersion', formula: 'θ_v - θ_r' },
      { name: 'Dispersive Power', formula: 'ω = (n_v - n_r)/(n_y - 1)' },
      { name: "Cauchy's Formula", formula: 'n = A + B/λ²' },
    ],
  },
  {
    id: 'interference',
    title: 'Interference of Light',
    description: 'Young\'s experiment, coherent sources, thin films',
    icon: '🌊',
    topic: 'wave-optics',
    content: `Interference is the superposition of two or more coherent light waves, producing a pattern of alternating bright and dark fringes.

Conditions for sustained interference:
1. Coherent sources (same frequency, constant phase difference)
2. Same amplitude (for best contrast)
3. Close separation between sources

Young's Double Slit Experiment:
- Two coherent sources from a single source
- Bright fringes: Path difference = nλ
- Dark fringes: Path difference = (2n+1)λ/2
- Fringe width: β = λL/d

Thin Film Interference:
Constructive: 2μt cos r = nλ
Destructive: 2μt cos r = (2n+1)λ/2

Applications: Anti-reflection coatings, Newton's rings, interferometry.`,
    formulas: [
      { name: 'Fringe Width', formula: 'β = λL/d' },
      { name: 'Path Difference', formula: 'Δx = d sin θ ≈ d(y/L)' },
      { name: 'Thin Film (Constructive)', formula: '2μt cos r = nλ' },
    ],
  },
  {
    id: 'diffraction',
    title: 'Diffraction of Light',
    description: 'Single slit, diffraction grating, resolving power',
    icon: '🔆',
    topic: 'wave-optics',
    content: `Diffraction is the bending of light around obstacles or through apertures, showing the wave nature of light.

Single Slit Diffraction:
- Central maximum: brightest and widest
- Minima: a sin θ = nλ (n = ±1, ±2, ...)
- Secondary maxima: less intense

Width of central maximum: 2λL/a

Diffraction Grating:
- Many parallel slits (N ~ 6000 lines/cm)
- Principal maxima: d sin θ = nλ
- Resolving power: R = Nn

Types:
- Fresnel Diffraction: Near-field (source/screen close)
- Fraunhofer Diffraction: Far-field (parallel light)

Applications: Spectroscopy, X-ray crystallography, CD/DVD reading.`,
    formulas: [
      { name: 'Single Slit Minima', formula: 'a sin θ = nλ' },
      { name: 'Grating Equation', formula: 'd sin θ = nλ' },
      { name: 'Resolving Power (Grating)', formula: 'R = Nn' },
      { name: 'Central Maximum Width', formula: 'w = 2λL/a' },
    ],
  },
  {
    id: 'polarization',
    title: 'Polarization of Light',
    description: 'Brewster\'s law, polaroids, applications',
    icon: '🔲',
    topic: 'wave-optics',
    content: `Polarization is the phenomenon that restricts the vibration of light waves to a single plane.

Unpolarized light vibrates in all directions perpendicular to propagation.
Polarized light vibrates in only one direction.

Methods of Polarization:
1. Reflection: At Brewster's angle, reflected light is completely polarized
2. Refraction: Through a pile of plates
3. Selective absorption: Using Polaroid sheets
4. Scattering: Light scattered at 90° is polarized

Brewster's Law: tan θ_B = n₂/n₁

Malus' Law: I = I₀ cos²θ

Applications:
- 3D movies (circular polarization)
- Sunglasses (reduce glare)
- LCD displays
- Stress analysis in materials`,
    formulas: [
      { name: "Brewster's Law", formula: 'tan θ_B = n₂/n₁' },
      { name: "Malus' Law", formula: 'I = I₀ cos²θ' },
    ],
  },
  {
    id: 'huygens',
    title: 'Huygens Principle',
    description: 'Wave theory, wavefronts, proof of laws',
    icon: '⭕',
    topic: 'wave-optics',
    content: `Huygens Principle states that every point on a wavefront acts as a source of secondary spherical wavelets. The new wavefront is the envelope of these secondary wavelets.

Key Concepts:
- Wavefront: Surface of constant phase
- Spherical wavefront: From a point source
- Plane wavefront: From a distant source (parallel rays)

Applications of Huygens Principle:
1. Proves laws of reflection and refraction
2. Explains diffraction and interference
3. Predicts the propagation of waves

Limitations:
- Doesn't explain rectilinear propagation
- Doesn't account for the amplitude of waves
- No explanation for the backward wave

Fresnel improved Huygens' principle by considering interference of secondary wavelets and their obliquity factor.`,
    formulas: [
      { name: 'Speed of Light in Medium', formula: 'v = c/n' },
      { name: 'Optical Path Length', formula: 'OPL = n × d' },
    ],
  },
]
