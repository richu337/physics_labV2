export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  topic: 'wave-optics'
}

export const quizData: QuizQuestion[] = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
