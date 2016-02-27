---
layout: post
title: Introduction and Timbre.js
excerpt: "An introduction to the blog and a tutorial on Timbre.js."
modified: 2016-02-13
tags: [intro, beginner, timbrejs, tutorial, waterbear]
comments: true
---
Hello everyone and welcome to my brand new blog! This is a place where I'll be sharing my thoughts on music, technology, and also self development: three things that I truly enjoy. I'm very excited to finally be getting this started so without further ado, here we go!

Back in September I began participating in a distributed open-source software project called [Waterbear](http://waterbearlang.com/), a visual programming language with a great mascot: ![Waterbear Mascot](../images/mascot-steampunk.jpg) 

As one of the projects included in an interesting opportunity called [UCOSP](http://ucosp.ca/), it was one that many people have been involved with across several years. It has already been through multiple iterations and continues to grow in all sorts of directions. The benefit of this being that each participant is welcome to contribute to it in any way he or she can imagine.

###What to do?

For me, it wasn't long until I realized the opportunity I had to improve the sound blocks it offered. Originally it was using a library called [Sound.js](http://createjs.com/soundjs), a simple-to-use but limited option. After researching and considering other web-audio libraries I decided on [Timbre.js](https://mohayonao.github.io/timbre.js/), mainly because of the awesome examples in their documentation and the quality of their sounds.

We decided that out of all the functionality we could add to this part of Waterbear, the top priorities were to be:

- Playback of files
- Generation of sound effects
- Manipulation of samples
- Recording and saving audio
- Building songs from notes

###The Basics

I began with generating some waveforms. The most primitive example that provides a sine wave looks something like this:

```
T("sin", {freq:880}).play();
```

Here the Timbre Object ('T') is being created with parameters for the type of wavform and the frequency. The dictionary attribute containing the frequency can include a number of parameters to further customize the synth. Then the play method is called on it to generate the tone.

To see more of what Timbre.js can do check out [ChordWork](https://mohayonao.github.io/timbre.js/chord.html) as well as the other examples they provide.

###Playback of files

###Generation of sound effects

###Building songs from notes

###Conclusion