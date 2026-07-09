export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  topic: 'ray-optics' | 'wave-optics'
}

export const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the law of reflection?',
    options: [
      'Angle of incidence = Angle of refraction',
      'Angle of incidence = Angle of reflection',
      'Angle of incidence > Angle of reflection',
      'Angle of incidence < Angle of refraction',
    ],
    correctIndex: 1,
    explanation:
      'The law of reflection states that the angle of incidence is equal to the angle of reflection, measured from the normal to the surface.',
    topic: 'ray-optics',
  },
  {
    id: 2,
    question: 'What is Snell\'s law?',
    options: [
      'n₁ sin θ₂ = n₂ sin θ₁',
      'n₁ sin θ₁ = n₂ sin θ₂',
      'n₁ cos θ₁ = n₂ cos θ₂',
      'sin θ₁ / sin θ₂ = n₁ / n₂',
    ],
    correctIndex: 1,
    explanation:
      "Snell's law: n₁ sin θ₁ = n₂ sin θ₂, where n is refractive index and θ is angle from normal.",
    topic: 'ray-optics',
  },
  {
    id: 3,
    question: 'What is the critical angle?',
    options: [
      'Angle where refraction = 90°',
      'Angle where reflection = 0°',
      'Angle where incidence = 45°',
      'Angle where light stops',
    ],
    correctIndex: 0,
    explanation:
      'The critical angle is the angle of incidence at which the angle of refraction is 90°, causing total internal reflection beyond this angle.',
    topic: 'ray-optics',
  },
  {
    id: 4,
    question: 'What causes the formation of a rainbow?',
    options: [
      'Diffraction of light',
      'Dispersion of light through water droplets',
      'Interference of light',
      'Polarization of light',
    ],
    correctIndex: 1,
    explanation:
      'Rainbows are formed by dispersion, refraction, and reflection of sunlight by water droplets, separating white light into its constituent colors.',
    topic: 'ray-optics',
  },
  {
    id: 5,
    question: 'In Young\'s double-slit experiment, what happens to fringe width when slit separation increases?',
    options: [
      'Fringe width increases',
      'Fringe width decreases',
      'Fringe width stays the same',
      'Fringes disappear',
    ],
    correctIndex: 1,
    explanation:
      'Fringe width β = λL/d. As slit separation d increases, fringe width decreases.',
    topic: 'wave-optics',
  },
  {
    id: 6,
    question: 'What is the condition for constructive interference in thin films?',
    options: [
      '2μt cos r = nλ',
      '2μt sin r = nλ',
      'μt cos r = nλ',
      '2μt = nλ',
    ],
    correctIndex: 0,
    explanation:
      'For constructive interference in thin films: 2μt cos r = nλ, where μ is refractive index, t is thickness, r is angle of refraction.',
    topic: 'wave-optics',
  },
  {
    id: 7,
    question: 'What is the main difference between Fresnel and Fraunhofer diffraction?',
    options: [
      'Source and screen distance from aperture',
      'Wavelength of light used',
      'Size of the aperture',
      'Type of light source',
    ],
    correctIndex: 0,
    explanation:
      'Fresnel diffraction occurs when source/screen are close to aperture (near-field), while Fraunhofer occurs when both are far away (far-field / parallel light).',
    topic: 'wave-optics',
  },
  {
    id: 8,
    question: 'What is the power of a lens with focal length 20 cm?',
    options: ['+2 D', '+5 D', '+0.5 D', '+20 D'],
    correctIndex: 1,
    explanation:
      'Power P = 1/f (in meters). f = 20 cm = 0.2 m, so P = 1/0.2 = +5 D (convex lens).',
    topic: 'ray-optics',
  },
  {
    id: 9,
    question: 'In a single-slit diffraction pattern, what is the condition for the first minimum?',
    options: [
      'a sin θ = λ',
      'a sin θ = 2λ',
      'a sin θ = λ/2',
      'a sin θ = 3λ/2',
    ],
    correctIndex: 0,
    explanation:
      'For single-slit diffraction, minima occur at a sin θ = nλ, where a is slit width. First minimum: a sin θ = λ.',
    topic: 'wave-optics',
  },
  {
    id: 10,
    question: 'What is the resolving power of a telescope?',
    options: [
      '1 / θₘᵢₙ = D / 1.22λ',
      'θₘᵢₙ = 1.22λ / D',
      'R = λ / Δλ',
      'R = Nm',
    ],
    correctIndex: 0,
    explanation:
      'Resolving power of a telescope is 1/θₘᵢₙ = D/1.22λ, where D is the aperture diameter and θₘᵢₙ is the minimum angular separation resolvable.',
    topic: 'ray-optics',
  },
  {
    id: 11,
    question: 'What happens to the interference pattern when white light is used instead of monochromatic light?',
    options: [
      'No pattern is observed',
      'Colored fringes are observed',
      'Pattern becomes brighter',
      'Only central fringe is visible',
    ],
    correctIndex: 1,
    explanation:
      'With white light, each wavelength produces its own fringe pattern, resulting in colored fringes with the central fringe being white.',
    topic: 'wave-optics',
  },
  {
    id: 12,
    question: 'What is the Brewster angle?',
    options: [
      'Angle where reflected light is completely polarized',
      'Angle of minimum deviation',
      'Angle of total internal reflection',
      'Angle of maximum transmission',
    ],
    correctIndex: 0,
    explanation:
      "Brewster's angle is the angle of incidence at which reflected light becomes completely polarized, given by tan θ_B = n₂/n₁.",
    topic: 'ray-optics',
  },
  {
    id: 13,
    question: 'What is the principle of superposition of waves?',
    options: [
      'Waves cancel each other always',
      'Net displacement = sum of individual displacements',
      'Waves pass through each other unchanged',
      'Both B and C',
    ],
    correctIndex: 3,
    explanation:
      'The superposition principle states that the net displacement is the sum of individual displacements, and waves pass through each other unchanged.',
    topic: 'wave-optics',
  },
  {
    id: 14,
    question: 'What is the formula for the fringe width in Young\'s double-slit experiment?',
    options: [
      'β = λL/d',
      'β = dL/λ',
      'β = λd/L',
      'β = L/λd',
    ],
    correctIndex: 0,
    explanation:
      'Fringe width β = λL/d, where λ is wavelength, L is distance to screen, and d is slit separation.',
    topic: 'wave-optics',
  },
  {
    id: 15,
    question: 'What is the difference between interference and diffraction?',
    options: [
      'No difference',
      'Interference: finite sources; Diffraction: continuous source',
      'Interference: same source; Diffraction: different sources',
      'Interference: multiple slits; Diffraction: single slit',
    ],
    correctIndex: 1,
    explanation:
      'Interference involves superposition from a finite number of coherent sources, while diffraction involves superposition from a continuous distribution of sources (every point on a wavefront).',
    topic: 'wave-optics',
  },
  {
    id: 16,
    question: 'Which color deviates the most when white light passes through a prism?',
    options: ['Red', 'Green', 'Blue', 'Violet'],
    correctIndex: 3,
    explanation:
      'Violet light deviates the most because it has the shortest wavelength and highest refractive index in the prism material.',
    topic: 'ray-optics',
  },
  {
    id: 17,
    question: 'What is the condition for total internal reflection?',
    options: [
      'Light travels from rarer to denser medium',
      'Light travels from denser to rarer medium with i > critical angle',
      'Light travels from denser to rarer medium with i < critical angle',
      'Light travels from rarer to denser medium with i > critical angle',
    ],
    correctIndex: 1,
    explanation:
      'TIR occurs when light travels from a denser to a rarer medium and the angle of incidence exceeds the critical angle.',
    topic: 'ray-optics',
  },
  {
    id: 18,
    question: 'In diffraction grating, what is the condition for principal maxima?',
    options: [
      '(a+b) sin θ = nλ',
      'a sin θ = nλ',
      'd cos θ = nλ',
      'a sin θ = (2n+1)λ/2',
    ],
    correctIndex: 0,
    explanation:
      'For a diffraction grating with slit spacing d = a+b (a: slit width, b: opaque space), principal maxima occur at d sin θ = nλ.',
    topic: 'wave-optics',
  },
  {
    id: 19,
    question: 'What is the focal length of a concave mirror?',
    options: ['Positive', 'Negative', 'Zero', 'Infinite'],
    correctIndex: 0,
    explanation:
      'By the Cartesian sign convention, the focal length of a concave mirror is negative (focus is in front of the mirror).',
    topic: 'ray-optics',
  },
  {
    id: 20,
    question: 'What is coherence in wave optics?',
    options: [
      'Waves having same frequency',
      'Waves having constant phase difference',
      'Waves having same amplitude',
      'Both A and B',
    ],
    correctIndex: 3,
    explanation:
      'Coherent sources have the same frequency and a constant phase difference, which is essential for observing stable interference patterns.',
    topic: 'wave-optics',
  },
]
