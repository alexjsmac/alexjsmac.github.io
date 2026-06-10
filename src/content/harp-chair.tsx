export default function Body() {
  return (
    <>
      <p>
        The Digital Harp Chair is an interactive art installation that
        transforms a piece of furniture into an expressive musical instrument.
        By merging classic design with modern technology, this project invites
        users to create music through the simple act of touch.
      </p>
      <p>
        The chair features two harp-shaped armrests, each strung with
        touch-sensitive aluminum bars. When a user sits down and runs their
        hands over the bars, they trigger a series of musical notes, much like
        playing a real harp. This intuitive interface makes musical expression
        accessible to everyone, regardless of their musical background.
      </p>
      <h2>Features &amp; functionality</h2>
      <p>
        The chair is more than just a simple instrument; it’s a complete
        sound-sculpting station. Integrated controls, located discreetly on
        the top of the harp armrests, allow the user to customize their sound
        in real-time.
      </p>
      <ul>
        <li>
          Touch-sensitive “strings” — the core of the instrument: six aluminum
          bars on each armrest act as capacitive touch sensors to play notes.
        </li>
        <li>
          Octave control — users can shift the pitch up or down, expanding the
          chair’s musical range.
        </li>
        <li>Volume control — the overall volume can be easily adjusted.</li>
        <li>
          Effects control — a dedicated sensor allows for the application of
          various audio effects, adding depth and character to the music.
        </li>
      </ul>
      <h2>Technical implementation</h2>
      <p>
        At the heart of the Digital Harp Chair is a Bela microcontroller,
        renowned for its ultra-low latency audio and sensor processing
        capabilities. This ensures a responsive and seamless musical
        experience with no noticeable delay between touch and sound.
      </p>
      <p>
        The entire system is powered by custom C++ code, which handles
        everything from processing the capacitive touch inputs to synthesizing
        the audio output. The electronics, including the Bela board and a
        speaker system, are neatly housed underneath the chair.
      </p>
      <h2>Design and collaboration</h2>
      <p>
        This project was a collaborative effort, designed and fabricated by
        the talented students at Holy Cross Catholic Secondary School with
        guidance and support from Museum London. The result is a unique fusion
        of art, design, and technology, showcasing how creative collaboration
        can produce truly innovative and engaging experiences. The back of the
        chair features an engraved panel proudly displaying the “HCC ART TECH”
        contribution.
      </p>
    </>
  )
}
