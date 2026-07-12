export interface VideoTopic {
  id: string
  title: string
  description: string
  videoId: string
  icon: string
  topic: string
}

export const videos: VideoTopic[] = [
  {
    id: 'youngs-double-slit',
    title: 'Young\'s Double Slit Experiment',
    description: 'A detailed explanation of Young\'s classic double slit experiment demonstrating wave interference of light.',
    videoId: 'pJx3dQxcHaQ',
    icon: '🔬',
    topic: 'Wave Optics',
  },
  {
    id: 'interference-waves',
    title: 'Interference of Waves',
    description: 'Understanding constructive and destructive interference patterns in wave optics.',
    videoId: 'VUl_kkiTCj8',
    icon: '🌊',
    topic: 'Wave Optics',
  },
  {
    id: 'diffraction-light',
    title: 'Diffraction of Light',
    description: 'Learn how light bends around obstacles and apertures, creating diffraction patterns.',
    videoId: 'XMC0Cd_TK3U',
    icon: '💡',
    topic: 'Wave Optics',
  },
  {
    id: 'polarisation',
    title: 'What is Polarisation',
    description: 'An introduction to the concept of polarisation of light and its applications.',
    videoId: 'Un-9fbqlIKo',
    icon: '🧲',
    topic: 'Wave Optics',
  },
  {
    id: 'superposition-waves',
    title: 'Principles of Superposition of Waves',
    description: 'Explore the superposition principle and how waves combine to form interference patterns.',
    videoId: 'LgJStYrk2fc',
    icon: '📡',
    topic: 'Wave Optics',
  },
]
