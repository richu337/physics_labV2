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
]
