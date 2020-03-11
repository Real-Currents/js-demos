js-demos
========

<canvas id="fathers" width="720" height="480"  style="image-rendering: optimizespeed !important; width: 480px; height: 360px; position: fixed; top: 25%;">
</canvas>
<br />
<div style="text-align: center">
<a id="aud1_play" href="#" onclick="(function(evt) { playVideo(); aud1.currentTime=0; aud1.muted=false; evt.target.innerHTML='Now Playing'; userTriggered=true; var control=window.document.querySelector('div#control'); if (control.style.display != 'none') control.style.display='none' else control.style.display='inline-block'; } (event));">Play</a>
</div>

These are some very loosely organized experiments, for the purpose of improving my understanding.

Here's an equally loose index of what can be viewed online:

[WebGL Video Cube](fathers.html)
(Projection of HTML5 video onto a WebGL Cube with deformed normals)
<br /><br /><br /><br />

![Visualizer+Video](fathers.png)
[Visualizer (+VIDEO) ](happy-b-day.html)
(Exploration of music visualization, adding real-time compositing of HTML5 video)
<br /><br /><br /><br />


[FFT Simple ](fft-simple.html)
(first try at music visualization using pre-analyzed fft data)


[FFT More ](fft.html)
(continues exploration of music visualization using pre-analyzed fft data)


![Visualizer+](visualizer.png)
[Visualizer (+input) ](visualizer.html)
(continues exploration of music visualization, adding mouse interaction)
<br /><br /><br /><br />


[Stylogical Maps ](stymaps/intro.005.html)
(these demos were my first efforts with HTML5 Canvas, initially using the Processing.js API. Later demos in the series use direct calls to the Canvas API)

![Stymaps11](stymaps/images/stymaps11.gif) 	![Stymaps12](stymaps/images/stymaps12.gif)
![Stymaps15](stymaps/images/stymaps15.gif) 	![Stymaps25](stymaps/images/stymaps25.gif)
<br /><br /><br /><br />
<br /><br /><br /><br />
<br /><br /><br /><br />
<br /><br /><br /><br />


![Koch Snowflake](kochflake.png)
[Koch Snowflake ](kochflake.html)
(expansion of example from 'Canvas Pocket Reference' by D. Flanagan, 2011)
<br /><br /><br /><br />


![Gradient Example](gradient.png)
[Gradient ](gradient.html)
(Gradient example converted to Canvas API from [Processing API](http://processing.org/examples/lineargradient.html) )
<br /><br /><br /><br />
<br /><br /><br /><br />
<br /><br /><br /><br />
<br /><br /><br /><br />


[MOV16 ](mov16.html)
(output shows up in console; an emulation of an assembly MOV opperation on a 16-bit microprocessor)

[Range2 Class ](class.html)
(based on example from 'JavaScript Pocket Reference' by D. Flanagan, 2012)

[Try 'this' ](this.html)
(comparing use of 'this' v.s. vars within methods; partially based on code from 'JavaScript Enlightenment' by C. Lindley, 2012)


<h1 id="text_title" style="display:none;">Fathers</h1>

<p id="text_copy" style="display:none;">
Don't Give Up

On Yourself

On Your Dreams

This is the moment

Your power has never been greater

Your priviledge has never stood higher

Your influence is without measure

Only your fear

Only your lost spirit

Can keep you from the promised land

The land of your ancestors

The land of your children

Where you would join them

If you would lead and follow

As your heart demands
</p>

<div id="stream" style="display:none; text-align:center">
<video id="aud1" poster="/js-demos/images/fathers.jpg" preload="auto" muted="true" controls="true">
<source src="/js-demos/video/fathers.mp4" />
<source src="/js-demos/video/fathers.ogv" />
</video>
</div>

<p id="vstatus"></p>

<p id="license" style="color:#fff">
<img src="http://i.creativecommons.org/l/by-sa/3.0/nz/88x31.png"  style="width: 88px;" alt="Creative Commons Licence"><br />
<em>These demos by <a href="mailto:john@real-currents.com">John</a> are licensed under the <a href="http://creativecommons.org/licenses/by-sa/3.0/nz/deed.en_GB">Creative Commons Attribution-ShareAlike 3.0 License, 2009-2020</a></em>
</p>

<script type="text/javascript" id="cvSrc" src="/js-demos/scripts/interact-visualizer.js"></script>

<script type="text/javascript" id="fathersSrc" src="/js-demos/scripts/inner-video-cube.js"></script>
