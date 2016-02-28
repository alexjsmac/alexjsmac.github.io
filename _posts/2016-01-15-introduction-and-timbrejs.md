---
layout: post
title: Introduction and Timbre.js
excerpt: "An introduction to the blog and a tutorial on Timbre.js."
modified: 2016-02-13
tags: [intro, beginner, timbrejs, tutorial, waterbear]
comments: true
---
Hello everyone and welcome to my brand new blog! This is a place where I'll be sharing my thoughts on music and technology, as well as self development: three things that I truly enjoy. I'm very excited to finally be getting this started so without further ado, here we go!

I would like to begin with an application I became involved with back in September. It is a distributed open-source software project called [Waterbear](http://waterbearlang.com/), a visual programming language with a great mascot: 

![Waterbear Mascot](../images/mascot-steampunk.jpg) 

As one of the projects included in an interesting opportunity called [UCOSP](http://ucosp.ca/), it was one that many people have been involved with across several years. It has already been through multiple iterations and continues to grow in all sorts of directions. The benefit of this being that each participant is welcome to contribute to it in any way he or she can imagine.

### What to do?

For me, it wasn't long until I realized the opportunity I had to improve the sound blocks that were being offered. Originally it was using a library called [Sound.js](http://createjs.com/soundjs), a simple-to-use but limited option. After researching and considering other web-audio libraries I decided on [Timbre.js](https://mohayonao.github.io/timbre.js/), mainly because of the awesome examples in their documentation and the quality of their sounds.

We decided that out of all the functionality we could add to this part of the Waterbear project, the top priorities were to be:

- Playback of files
- Generation of sound effects
- Building songs from notes

Fortunately Timbre.js was capable of implementing all of these things so it was a perfect candidate for the job.

### The Basics

I began with generating some waveforms. The most primitive example that provides a sine wave looks something like this:

{% highlight javascript %}
T("sin", {freq:880}).play();
{% endhighlight %}

Here the Timbre Object ('T') is being created with parameters for the type of waveform and the frequency. The dictionary attribute containing the frequency can include a number of additional parameters such as volume and envelope to further customize the synth. Then the play method is called on it to generate the tone.

Timbre.js synthesis has the ability to play single notes as well as chords:

{% highlight javascript %}
var sine1 = T("sin", {freq:440, mul:0.5});
var sine2 = T("sin", {freq:660, mul:0.5});
var sine3 = T("sin", {freq:880, mul:0.5});

T("perc", {r:500}, sine1, sine2, sine3).on("ended", function() {
  this.pause();
}).bang().play();
{% endhighlight %}

In this example, several sine waves are being combined inside of a `"perc"` Timbre object. `On()` is called on that object to add a listener to the end of the listeners array when the synth has `"ended"`. When the Timbre object has ended, the listener will pause the synth so it can be started again later without reloading the script. Then `bang()` sets playback to be a short burst of sound rather than an ongoing signal and `play()` begins the processing. The release time is set to 500ms with `"{r:500}"`.

To see an advanced example of what Timbre.js can do with audio synthesis check out [ChordWork](https://mohayonao.github.io/timbre.js/chord.html) as well as the other examples they provide.

### Playback of files

Audio files can easily be played with a segment such as:

{% highlight javascript %}
T("audio", {load:"/some/audio/file.wav"}).play();
{% endhighlight %}

But many effects such as [chorus](https://mohayonao.github.io/timbre.js/chorus.html), [delay](https://mohayonao.github.io/timbre.js/delay.html), [phaser](https://mohayonao.github.io/timbre.js/phaser.html), and [reverb](https://mohayonao.github.io/timbre.js/reverb.html) can be added to playback as well.

### Generation of sound effects

Within Waterbear there is a demand to have sound effects ready to run at certain points within a program. Things such as lasers and alarms can be used at key points to alert the user of an action. Thus, it was important for the chosen audio library to easily mainpulate these sounds. 

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

### Building songs from notes

### Conclusion