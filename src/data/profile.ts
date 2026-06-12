export const profile = {
  name: 'Alex MacLean',
  alias: 'Sunntack',
  tagline:
    'Immersive media artist, experimental electronic musician, and creative technologist based in London, Ontario.',
  roles: [
    'Immersive Media Artist',
    'Electronic Musician',
    'Creative Technologist',
  ],
  location: 'London, Ontario, Canada',
  /**
   * One line under the hero — keep it fresh: the latest or next show.
   * Set to null to hide.
   */
  now: {
    label: 'Out July 31',
    text: 'Small Vibrations — the debut Sunntack LP',
    href: '/sunntack',
  } as { label: string; text: string; href: string } | null,
  bluheron: {
    name: 'BluHeron Interactive',
    role: 'Co-Founder & Technical Director',
    url: 'https://bluheroninteractive.com',
  },
  /* Verbatim from the previous site's About page */
  bio: [
    'Alex MacLean (aka Sunntack) stands at the crossroads of art and technology. A new media artist, software developer, and live AV performer, he ventures into the unexplored territories of experimental electronic music, shaping auditory landscapes that push the conventional boundaries.',
    'His performances are a fusion of audio-reactive video projections, an immersive marriage of sound and visuals. With a deep-seated curiosity for human ecology, Alex’s work revolves around exploring related themes through the lens of the audiovisual.',
    'Alex’s contributions have graced renowned stages at international conferences and festivals such as ICLC, NIME, and the Network Music Festival. Notably, his creative endeavors were acknowledged with the 2022 City of Hamilton Arts Awards Shirley Elford Emerging Artist Commission Prize, highlighting his innovative approach and impactful presence in the artistic sphere.',
    'Through Alex’s hands, technology becomes a tool for expression, and sound becomes a conduit for storytelling, crafting experiences that engage and resonate with audiences, offering glimpses into the uncharted territories of art and innovation.',
  ],
  recognition: [
    {
      title: 'Shirley Elford Emerging Artist Commission Prize',
      detail: 'City of Hamilton Arts Awards, 2022',
    },
    {
      title: 'International performances & presentations',
      detail: 'ICLC · NIME · Network Music Festival',
    },
  ],
  funders: [
    'Canada Council for the Arts',
    'Ontario Arts Council',
    'London Arts Council & City of London',
    'Ocean Week Canada',
  ],
  music: {
    linktree: 'https://linktr.ee/alexjsmac',
    soundcloud: 'https://soundcloud.com/xanderjohnscott',
  },
  socials: [
    { label: 'Instagram', href: 'https://instagram.com/alexjsmac' },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/alex-maclean-ba018543',
    },
    { label: 'GitHub', href: 'https://github.com/alexjsmac' },
    { label: 'SoundCloud', href: 'https://soundcloud.com/xanderjohnscott' },
  ],
  contactNote:
    'Please feel free to reach out on Instagram or LinkedIn. I’m always interested in collaborating on new projects or discussing ideas.',
  contact: {
    /** Formspree form ID — submissions deliver to the address below. */
    formspreeId: 'meewlvwv',
    /* Kept split so the address never appears verbatim in the bundle */
    emailUser: 'alex',
    emailDomain: 'bluheroninteractive.com',
  },
  cvUrl: '/cv.pdf',
}
