/**
 * Sunntack EPK content. Show history compiled from the 2026 press kit, the
 * March 2026 CV, and Alex's corrections; bio adapted from the CV artist
 * statement; album details from the CAIP 2025 final report.
 */
import manifest from './image-manifest.json'

import press1 from '@/assets/press/sunntack-press-1.webp'
import press2 from '@/assets/press/sunntack-press-2.webp'
import live1 from '@/assets/press/sunntack-live-1.webp'
import live2 from '@/assets/press/sunntack-live-2.webp'
import portrait from '@/assets/press/sunntack-portrait.webp'

interface Dim {
  width: number
  height: number
}
const pressDims = manifest.press as Record<string, Dim>

export interface PressPhoto {
  src: string
  width: number
  height: number
  alt: string
  /** Print-quality original in public/press/ */
  download: string
}

function photo(slug: string, src: string, alt: string): PressPhoto {
  const dim = pressDims[slug]
  if (!dim) throw new Error(`Missing press image "${slug}" — run npm run migrate`)
  return { src, ...dim, alt, download: `/press/${slug}.jpg` }
}

export const sunntack = {
  name: 'Sunntack',
  oneLiner:
    'Live audiovisual performance — experimental electronics, generative visuals, and synthesized light, improvised as one instrument.',
  location: 'London, Ontario, Canada',

  album: {
    label: 'Coming July 31, 2026',
    title: 'Small Vibrations',
    detail: 'Debut full-length album · Listen on release via',
    description:
      'A sonic tribute to declining insect populations: six tracks tracing an arc from the emergence of the first insects to their extinction and the sterile world left behind — built from field recordings, modular synthesis, and generative composition. Released digitally and as a limited two-colour vinyl edition.',
    support:
      'Created with the support of the London Arts Council’s Community Arts Investment Program and the City of London.',
    href: 'https://linktr.ee/alexjsmac',
  },

  bio:
    'Sunntack is the live A/V project of Alex MacLean, a new media artist and programmer based in London, Ontario. His performances blend experimental electronic music with audio-reactive projections and synthesized light — improvised systems in which sound, image, and language process one another in real time. Drawing on human ecology, alternative futures, and science fiction, Sunntack has appeared at international festivals and conferences including ICLC, NIME, and the Network Music Festival, and was recognized with the 2022 Shirley Elford Emerging Artist Commission Prize. His debut full-length album, Small Vibrations, arrives July 31, 2026.',

  /** The current live set */
  currentSet: {
    title: 'Terminal Taxonomy',
    description:
      'The current Sunntack set is Terminal Taxonomy — a meditation on the cascading erosion of language and life in the age of algorithmic mediation. A custom TouchDesigner system built around a modified speech-to-text operator transcribes live vocal samples, reporting the detected language and its own confidence; those transcriptions drive the entire piece. As the system loses confidence in its evaluations, entropy increases and it becomes unstable — in both the audio and the visuals — while Alex improvises with the results in real time, alongside ten Art-Net LED bars that map the system’s state into physical light.',
    workSlug: 'terminal-taxonomy',
  },

  shows: [
    {
      date: 'Mar 2026',
      title: 'Brew.exe',
      venue: 'TWB Brewing, Kitchener, ON',
    },
    {
      date: 'Feb 2026',
      title: 'Polaris Pitch Competition',
      venue: 'London Music Hall, London, ON',
    },
    {
      date: 'Feb 2026',
      title: 'Terminal Taxonomy',
      venue: 'Honey Dip Bar, London, ON',
      note: 'w/ Mas Aya',
    },
    { date: 'Oct 2025', title: 'CoQuest', venue: 'Sevens Social, London, ON' },
    {
      date: 'Sep 2025',
      title: 'A/V Nights: An Immersive Art Showcase',
      venue: 'XUUX Artists, London, ON',
    },
    {
      date: 'Aug 2025',
      title: 'Ambient Afternoon',
      venue: 'Standard Time, Toronto, ON',
    },
    {
      date: 'Aug 2025',
      title: 'Hear There',
      venue: 'Museum London, London, ON',
    },
    {
      date: 'Jul 2025',
      title: 'Honey Dip',
      venue: 'London, ON',
      note: 'w/ Bitters, Closeout, and SD Henhawke',
    },
    {
      date: 'May 2025',
      title: 'Kitchener Electronic Music Open Mic Night',
      venue: 'TWB Brewing, Kitchener, ON',
    },
    {
      date: 'Oct 2024',
      title: 'Sonic Horizons',
      venue: 'Heads & Tails, London, ON',
    },
    {
      date: 'Jun 2024',
      title: 'Our Home Your Home',
      venue: 'Vibra-Fusion Lab, Hamilton, ON',
    },
    {
      date: 'Feb 2024',
      title: 'Hear Here: Ambient Avant-Garde Sounds',
      venue: 'Forest City Gallery, London, ON',
    },
    {
      date: 'Jul 2023',
      title: 'Synth Syntax',
      venue: 'The Casbah, Hamilton, ON',
    },
    {
      date: 'Jul 2023',
      title: 'AUTO{}Construcción: Algorithmic Concert',
      venue: 'Factory Media Centre, Hamilton, ON',
    },
    {
      date: 'Oct 2022',
      title: 'Chirping Circuits',
      venue: 'Factory Media Centre, Hamilton, ON',
    },
    {
      date: 'Jul 2020',
      title: 'Network Music Festival',
      venue: 'Remote',
      note: 'w/ The Cybernetic Orchestra',
    },
    {
      date: 'Feb 2020',
      title: 'ICLC — International Conference on Live Coding',
      venue: 'Limerick, Ireland',
      note: 'Multi-lingual audio-visual collaboration',
    },
  ],

  photos: [
    photo(
      'sunntack-press-1',
      press1,
      'Sunntack at the modular rig in blue and violet light',
    ),
    photo(
      'sunntack-press-2',
      press2,
      'Sunntack performing in front of audio-reactive projections',
    ),
    photo(
      'sunntack-live-1',
      live1,
      'Terminal Taxonomy at the Polaris Pitch Competition, London Music Hall — the transcription system projected behind the performer',
    ),
    photo(
      'sunntack-live-2',
      live2,
      'Sunntack on stage at London Music Hall with laptop and modular synthesizer',
    ),
    photo('sunntack-portrait', portrait, 'Portrait of Sunntack in the studio'),
  ],

  links: [
    { label: 'Linktree', href: 'https://linktr.ee/alexjsmac' },
    { label: 'SoundCloud', href: 'https://soundcloud.com/xanderjohnscott' },
    { label: 'Instagram', href: 'https://instagram.com/alexjsmac' },
  ],
}
