import { Link } from 'wouter'

export default function Body() {
  return (
    <>
      <p>
        An extension of the original{' '}
        <Link href="/work/oceanic-datanimism">Oceanic “Datanimism”</Link>, this
        experiment brought the idea into virtual reality.
      </p>
      <p>
        The{' '}
        <a href="https://aframe.io/" target="_blank" rel="noreferrer">
          A-Frame web framework
        </a>{' '}
        was used to create the visuals. The music was created with{' '}
        <a href="https://tonejs.github.io/" target="_blank" rel="noreferrer">
          Tone.js
        </a>
        . Audio samples under a Creative Commons license were found on{' '}
        <a href="https://freesound.org/" target="_blank" rel="noreferrer">
          Freesound
        </a>
        .
      </p>
      <p>
        The global mean sea level rise from 1880 to 2020 was sonified with
        data from{' '}
        <a
          href="https://ourworldindata.org/grapher/sea-level-rise?country=~OWID_WRL"
          target="_blank"
          rel="noreferrer"
        >
          Our World in Data
        </a>
        .
      </p>
      <p>
        A huge thanks to the Canada Council for the Arts for supporting this
        creative research project.
      </p>
      <p>
        Plug in a VR headset to experience this piece as it’s meant to be —
        or view it in a desktop browser without one.
      </p>
    </>
  )
}
