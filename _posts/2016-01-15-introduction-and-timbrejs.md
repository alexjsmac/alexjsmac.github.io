---
title: Introduction and Timbre.js
excerpt: "An introduction to the blog and a tutorial on Timbre.js."
modified: 2016-02-13
tags: [intro, beginner, timbrejs, tutorial, waterbear]
comments: true
---
Hello everyone and welcome to my brand new blog! This is a place where I'll be sharing my thoughts on music and technology, as well as self development: three things that I truly enjoy. I'm very excited to finally be getting this started so without further ado, here we go!

I would like to begin this new adventure with a post about a Javascript audio library and an open-source project I became involved with back in September. The project is called [Waterbear](http://waterbearlang.com/) and it is a visual programming language with a great mascot:

![Waterbear Mascot](/images/mascot-steampunk.jpg)

As one of the projects included in an interesting opportunity called [UCOSP](http://ucosp.ca/), as well as [some others](https://github.com/waterbearlang/waterbear/wiki/Contributors-and-Acknowledgements), many people have been involved with it throughout several years. It has already been through multiple iterations and continues to grow in all sorts of directions. The benefit of this being that each participant is welcome to contribute to it in any way he or she can imagine.

### What to do?

For my contribution, it wasn't long until I realized the opportunity I had to improve the sound blocks that were being offered to users. Originally, the audio library being used was [Sound.js](http://createjs.com/soundjs), a simple but limited option. After researching and considering other libraries I decided on [Timbre.js](https://mohayonao.github.io/timbre.js/), mainly because of the awesome examples in their documentation and the quality of their sounds.

We decided that out of all the functionality we could add to the sound portion of the Waterbear project, the top priorities were to be:

- Playback of files
- Generation of sound effects
- Building songs from notes

Fortunately, Timbre.js was capable of implementing all of these things so it was a perfect candidate for the job.

### The Basics

*Note: You can play with these code examples on [JSFiddle](https://jsfiddle.net/) after including [this](https://mohayonao.github.io/timbre.js/timbre.js) as an external resource or just modify the examples on the [Timbre.js](https://mohayonao.github.io/timbre.js/) site.*

I began with generating some waveforms. The most primitive example that provides a sine wave looks something like this:

{% highlight javascript %}
T("sin", {freq:880}).play();
{% endhighlight %}

Here the Timbre Object ('T') is being created with parameters for the type of waveform and the frequency. The dictionary attribute containing the frequency can include a number of additional parameters such as volume and envelope to further customize the synth. The play method is then called on that object to generate the tone.

Timbre.js synthesis has the ability to play single notes as well as chords:

{% highlight javascript %}
var sine1 = T("sin", {freq:440, mul:0.5});
var sine2 = T("sin", {freq:660, mul:0.5});
var sine3 = T("sin", {freq:880, mul:0.5});

T("perc", {r:500}, sine1, sine2, sine3).on("ended", function() {
  this.pause();
}).bang().play();
{% endhighlight %}

In this example, several sine waves are being combined inside of a `"perc"` Timbre object. `on()` is called on that object to add a listener to the end of the listeners array when the synth has `"ended"`. When the Timbre object has ended, the listener will pause the synth so it can be started again later without reloading the script. Then `bang()` sets playback to be a short burst of sound rather than an ongoing signal and `play()` begins the processing. The release time is set to 500ms with `"{r:500}"`.

The block that was created to define synths within Waterbear includes options for the waveform, attack time, and release time. This provides a reasonable amount of sound-shaping for people to get started with:

![Synth block](/images/synth_def.png)

With this block a synth is being defined by the following:

{% highlight javascript %}
var osc = T("sine");
var env = T("perc", {a:10, r:300});
var oscenv = T("OscGen", {osc:osc, env:env, mul:0.15}).play();
{% endhighlight %}

To see an advanced example of what Timbre.js can do with audio synthesis check out [ChordWork](https://mohayonao.github.io/timbre.js/chord.html) as well as the other examples they provide.

### Playback of files

Audio files can easily be played:

{% highlight javascript %}
T("audio", {load:"/some/audio/file.wav"}).play();
{% endhighlight %}

But many effects such as [chorus](https://mohayonao.github.io/timbre.js/chorus.html), [delay](https://mohayonao.github.io/timbre.js/delay.html), [phaser](https://mohayonao.github.io/timbre.js/phaser.html), and [reverb](https://mohayonao.github.io/timbre.js/reverb.html) can be added to playback as well.

### Generation of sound effects

For Waterbear there was a demand to have sound effects ready to play at certain points within a program. Things such as lasers and alarms can be used at key points to alert the user of an action. Thus, it was important for the chosen audio library to generate such sounds.

Here is how to create a laser sound effect with Timbre.js:

{% highlight javascript %}
var table = [1760, [110, "200ms"]];

var freq = T("env", {table:table}).on("bang", function() {
    VCO.mul = 0.2;
}).on("ended", function() {
    VCO.mul = 0;
});
var VCO = T("saw", {freq:freq, mul:0}).play();
freq.bang();
{% endhighlight %}

Several sound effects were created in this way and a block was made with a drop-down menu to choose an effect from:

![Sound effect block](/images/sound_effect_block.png)

### Building songs from notes

Another big feature request was to be able to define notes with specific frequencies and durations so that they could be used to drag-and-click out a melody. See the "Twinkling Song" example on Waterbear to get a feel for what it's like to use a visual programming language to do so. For short parts it is quite convenient!

First, a synth must be defined, then optionally set the tempo (120bpm by default), and then notes can be added. When it is time to play the melody within the program, a play block must be dropped into Waterbear in the desired location:

![Sound notes example](/images/sound_notes.png)

In order to queue up notes for playback the information collected from the blocks has to first be converted into [Music Markup Language](http://www.musicmarkup.info/):

{% highlight javascript %}
global.runtime = {
	...
	addNote: function(note, octave, beats){
	    switch(note){
	        case "A":
	            note = "a";
	            break;
	        ...
	        case "Rest":
	            note = "r";
	            break;
	    }
	    if (octave > current_octave) {
	        var octave_diff = octave - current_octave;
	        for (var i = 0; i < octave_diff; i++) {
	            song += "<";
	        }
	    }
	    else if (octave < current_octave) {
	        var octave_diff = current_octave - octave;
	        for (var i = 0; i < octave_diff; i++) {
	            song += ">";
	        }
	    }
	    current_octave = octave;
	    var length;
	    switch(beats){
	        case "1/32":
	            length = "32";
	            break;
	        ...
	        case "1":
	            length = "1";
	            break;
	    }
	    var newNote = note + length;
	    song += newNote;
	},
	...
}
{% endhighlight %}

So that a string such as `song="o4 l4 V12 cd"` is created, then that string is passed to Timbre.js with the play block:

{% highlight javascript %}
T("mml", {mml:song}, sound).on("ended", function() {
    sound.pause();
    this.stop();
}).start();
{% endhighlight %}

Alternatively, uses can enter in MML directly to a different block:

![MML block example](/images/mml_block_example.png)

### Conclusion

The code that used Timbre.js resides in [runtime.js](https://github.com/waterbearlang/waterbear/blob/master/js/runtime.js#L999) and the HTML for the sound blocks is in [playground.html](https://github.com/waterbearlang/waterbear/blob/master/playground.html#L225). There are even more sound blocks than discussed here so I urge you to go and explore the rest on your own.

I found this project to be a great experience with taking an audio library and implementing it in an interesting way. Visual programming languages are meant to teach people to think like coders so a lot of consideration was put into making all options visible and understandable in order for users to quickly grasp what's available to them.

So thanks very much for reading and I hope you enjoyed my overerview of these musical technologies. If you have any thoughts or opinions then please feel free to share them in the comments below or send me a message!
