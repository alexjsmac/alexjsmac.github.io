/**
 * Sunntack EPK content. Show history compiled from the 2026 press kit and
 * the March 2026 CV; bios adapted from the CV artist statement.
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
    label: 'New album',
    title: 'Small Vibrations',
    detail: 'Debut full-length album · June 2026',
    href: 'https://linktr.ee/alexjsmac',
  },

  bios: {
    short:
      'Sunntack is the live A/V project of Alex MacLean, a new media artist and programmer based in London, Ontario. His performances blend experimental electronic music with audio-reactive projections and synthesized light — improvised systems in which sound, image, and language process one another in real time. Drawing on human ecology, alternative futures, and science fiction, Sunntack has appeared at international festivals and conferences including ICLC, NIME, and the Network Music Festival, and was recognized with the 2022 Shirley Elford Emerging Artist Commission Prize. His debut full-length album is Small Vibrations (June 2026).',
    long: 'Alex MacLean, also known as Sunntack, stands at the crossroads of art and technology. A new media artist and live AV performer, Alex ventures into the unexplored territories of experimental electronic music, shaping auditory landscapes that push the conventional boundaries.\n\nHis performances blend audio-reactive video projections, merging sound and visuals into an immersive experience. With a deep-seated curiosity for human ecology, alternative futures, and science fiction, Alex’s work revolves around exploring these themes through the lens of sound.\n\nAlex’s contributions have graced renowned stages at international conferences and festivals such as ICLC, NIME, and the Network Music Festival. His creative endeavours garnered recognition through the 2022 City of Hamilton Arts Awards Shirley Elford Emerging Artist Commission Prize, along with an invitation to serve as a featured artist for Ocean Week Canada 2024. His debut full-length album is Small Vibrations (June 2026).\n\nThrough Alex’s hands, technology becomes a tool for expression, and sound becomes a conduit for storytelling, crafting experiences that engage and resonate with audiences, offering glimpses into the uncharted territories of art and innovation.',
  },

  /** The current live set */
  currentSet: {
    title: 'Terminal Taxonomy',
    description:
      'The current Sunntack set is Terminal Taxonomy — a meditation on the cascading erosion of language and life in the age of algorithmic mediation. A custom TouchDesigner system built around a modified speech-to-text operator transcribes live vocal samples, reporting the detected language and its own confidence; those transcriptions drive the entire piece. As the system loses confidence in its evaluations, entropy increases and it becomes unstable — in both the audio and the visuals — while Alex improvises with the results in real time, alongside ten Art-Net LED bars that map the system’s state into physical light.',
    demoHref: 'https://www.youtube.com/watch?v=TIn3faKxXOg',
    workSlug: 'terminal-taxonomy',
  },

  shows: [
    {
      date: 'Apr 2026',
      title: 'A/V Nights 2: An Immersive Art Showcase',
      venue: 'London, ON',
      note: 'Organizer, host & performer',
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
    { date: 'Jul 2025', title: 'Honey Dip', venue: 'London, ON' },
    { date: 'May 2025', title: 'TWB Brewing', venue: 'Kitchener, ON' },
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
      'Terminal Taxonomy live — the transcription system projected behind the performer',
    ),
    photo(
      'sunntack-live-2',
      live2,
      'Sunntack on stage with laptop and modular synthesizer',
    ),
    photo('sunntack-portrait', portrait, 'Portrait of Sunntack in the studio'),
  ],

  rider: {
    href: '/press/sunntack-terminal-taxonomy-tech-rider.pdf',
    summary:
      'Ten addressable LED pixel bars on floor stands, a 2–4 universe Art-Net node, stereo DI, vocal mic, and a 6,000+ lumen projector. Full rider with stage plot:',
  },

  links: [
    { label: 'Linktree', href: 'https://linktr.ee/alexjsmac' },
    { label: 'SoundCloud', href: 'https://soundcloud.com/xanderjohnscott' },
    { label: 'Instagram', href: 'https://instagram.com/alexjsmac' },
  ],
}
