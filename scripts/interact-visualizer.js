/* Accelerated Visualizing
 * I've had some success with analyzing an audio file and visualizing the output.
 * Now I would like to speed up the drawing algorithms
 */

var sBuffer = [],
	fftReady = false,
	fftProgress = -1,
	fftLoader = 0,
	appStarted = false,
	appDelay = 0,
	statsBox = document.createElement('div');
statsBox.id = 'statBox';
statsBox.style.width = statsBox.style.minWidth = statsBox.style.maxWidth = 
statsBox.style.height = statsBox.style.minHeight = statsBox.style.maxHeight = "120px";
statsBox.style.position = "relative";
statsBox.style.marginTop = "-180px";
statsBox.style.marginLeft = "42.5%";
statsBox.style.color = "#FFFFFF";
statsBox.style.textAlign = "center";
statsBox.innerHTML = ( location.pathname.match(/(\.html)/)!==null )?
	'<img src="images/bw-loader.gif" /><br />Loading... ':
	'<img src="/js-demos/images/bw-loader.gif" /><br />Loading... ';

var canvasApp = function canvasApp(cv) {

	/* START Global Vars */
	window.audio = window.aud1;
	window.audioLoad = false; 
	window.audioReady = false;
	window.audioName = audio.children[0].src.match(/[\/|\\]*([\w|\-|]+)\.\w\w\w$/)[1];
	window.audio.onloadstart = (typeof audio.onloadstart === "object")?
		function() { audioLoad = true; return audioLoad; } : 
		(function(){ audioLoad = true; return {audioLoad:true}; })();
	window.audio.oncanplaythrough = (typeof audio.oncanplaythrough === "object")?
	  function() { 
		Debugger.log("audio is ready"); 
		audioReady = true;
		return audioReady; 
	  } : 
	  (function() {
		/*
		Debugger.log( "Inline video is not supported\n" );
		return false;
		*/
		audioReady = true; 
		return {audioReady:true};
	  })();
	window.canvasApp.canDrawVideo = true;
	/* END Global Vars */

	/* Get canvas properties */
	var canvas = canvasApp.cv = (typeof canvasApp.cv === "object")? canvasApp.cv: cv ;
	//Debugger.log( "Using canvas '"+ canvas.id +"'\n" );
	canvas.id = "layer1";
	canvas.alt = "Interactive Audio Visualizer";
	canvas.src = (location.pathname.match(/(\.html)/) !== null)?
        "visualizer.png":
	   "http://"+ window.location.host +"/js-demos/visualizer.png";
	canvas.width = canvas.width || "1024";
	canvas.height = canvas.height || "576";
	canvas.setAttribute( 'onmouseover', 'canvasApp.mouseOver=true;' );
	canvas.setAttribute( 'onmouseout', 'clearInterval(canvasApp.mouseEvent);canvasAppmouseOver=false;' );
	canvas.setAttribute( 'onmousemove', 'canvasApp.colorChange(event);' );
	canvasApp.mouseOver = false;
	canvasApp.mouseEvent = 0;
	canvasApp.tx = 0;
	canvasApp.strokeStyle = window['foreground01'].style.color || 'rgba(50%,100%,50%,1.0)';
	canvasApp.colorChange = function(evt){
		clearInterval(this.mouseEvent);
		if( canvasApp.mouseOver ) window.mouseEvent = setTimeout( function(evt) {
			var width = window.innerWidth,
				height = window.innerHeight;
			//Debugger.log( "width: "+ width +" mouse x: "+ evt.clientX );
			var strokeB, strokeR = canvasApp.strokeStyle.match(/rgb\((\d+)/)[1]/255;
			if( strokeR === null ) { 
				strokeR = 50;
			} else {
				strokeR = parseFloat(strokeR)/2;
				if( strokeR > 49 ) strokeR--;
				if( strokeR < 1 ) strokeR++;
			}
			strokeB = 50 - strokeR;
			if(evt.clientX > width/2) {
				canvasApp.strokeStyle = window['foreground02'].style.color || 'rgba('+ (++strokeR)*2 +'%,100%,'+ (--strokeB)*2 +'%,1.0)';
			} else {
				canvasApp.strokeStyle = window['foreground03'].style.color || 'rgba('+ (--strokeR)*2 +'%,100%,'+ (++strokeB)*2 +'%,1.0)';
			}
			//Debugger.log( canvasApp.strokeStyle );
		}, 33, evt);
	};
  
  /* Insert loader just after the canvas */
  if( document.getElementById('statBox') === null )
    canvas.parentNode.appendChild(statsBox);

  /* Track fft amplitudes */
  var amp1=0, amp2=0;

  var fftLoad = canvasApp.fftLoad = function fftLoad ( aname, pr, single ) {
	//audio.load();
	var part;
	if( pr < 0 ) {
		fftProgress = [];
		part = fftProgress.length;
	} else {
		part = pr;
	}
	  
	if( (pr > 99) || (part > 99) ) {
		clearTimeout(fftLoader);
		return true;
	} else {
		var sr = document.createElement('script'),
			fname = (part < 10)? 
				( location.pathname.match(/(\.html)/) !== null )?
					"data/"+ aname +"-0"+ part +".js":
					"/js-demos/data/"+ aname +"-0"+ part +".js" :
				( location.pathname.match(/(\.html)/) !== null )?
					"data/"+ aname +"-"+ part +".js":
					"/js-demos/data/"+ aname +"-"+ part +".js" ;	
		sr.src = fname;
		document.body.appendChild(sr);
		if( (part < 99) && (!single) )
		  fftLoader = setTimeout( fftLoad, 99, aname, ++part );
	}
	return true;
  };
    
if(! fftReady ) {
	Debugger.log( "Progress "+ fftProgress.length +"%" );
	statsBox.innerHTML = statsBox.innerHTML.match(/.+\.\.\./)[0] + fftProgress.length +"%";
	if( fftProgress < 0 ) { 
		for( var p=fftProgress, z=10; p<z; p++) {
			fftLoad(audioName, p, true);
		}
		return appDelay = setTimeout(canvasApp, 333, canvasApp.cv);
	} else if( fftProgress.length > 9 ) {
		fftReady = true;
		statsBox.parentNode.removeChild(statsBox);
		setTimeout(function(){ audio.play(); }, 3333);
	} else {
		return appDelay = setTimeout(canvasApp, 333, canvasApp.cv);
	}
} else if(! audioReady ) {
	//Debugger.log( audioReady );
	if( audioLoad === false ) audio.load();
	return appDelay = setTimeout(canvasApp, 333, canvasApp.cv);
} else clearTimeout(appDelay);
if( appStarted ) return appStarted;

  var time = 0;
  
  /* Textual stuff */
  var announcement = document.title;
  var title = (window.text_title) ? window.text_title.innerHTML: "Real~Currents";
  //Debugger.log( title );
  var copy = (window.text_copy) ? window.text_copy.innerHTML.split(/[\n|\r]/): "";
  //Debugger.log( copy );
	
  /* Audio visualization stuff */
  var aidx = canvasApp.aidx = 0;
  var aBuffer = canvasApp.aBuffer = [];
  var fBuffer = canvasApp.fBuffer = [];
  var vBuffer = canvasApp.vBuffer = [];
  var w = canvas.width, h = canvas.height;
  var hcorrect =  h / 2;
  if( sBuffer.length > 0 ) {
	for( var i=1, z=sBuffer.length; i<z; i++ ) {
		var a=[], f=[], v=[];
		if( typeof sBuffer[i] !== 'object' ) {
			Debugger.log( "sBuffer has hole at "+ i +"\n" );
			for( var p=0, z=11, buf=true; p<z; p++ ) {
				if( (p < 10) && (!fftProgress[p]) ) {
				  buf = false;
				  fftLoad(audioName, p, true);
				} else if(! buf ) {
					fftReady = false;
					appStarted = false;
					canvas.parentNode.appendChild(statsBox);
					return appDelay = setTimeout(canvasApp, 333, canvasApp.cv);
				}
			}
			continue;
		}
		for( var j=0, n=sBuffer[i].length; j<n; j++ ) {
			var afv = sBuffer[i][j].split(',');
			/* Draw a curve of the amplitude data */
			var curveh = -afv[0]*hcorrect + hcorrect;
			a[j] = curveh;
			f[j] = afv[1];
			v[j] = afv[2];
			
		}
		aBuffer.push(a);
		fBuffer.push(f);
		vBuffer.push(v);
		//Debugger.log( "V*h="+ aBuffer[i-1]*canvas.height +" w="+ canvas.width +" h="+ canvas.height +" \n" );
	}
	fftLoad(audioName, 10);
	//Debugger.log( "Total frames: "+ (aBuffer.length) );
  } else for( var i=0, z=2000; i<z; i++ ) aBuffer.push(0.5);
	
	var aCanvas = document.createElement('canvas');
	var bCanvas = document.createElement('canvas');
	aCanvas.width = bCanvas.width = w>>2; //aBuffer[0].length;
	aCanvas.height = bCanvas.height = canvas.height;
	var actx = canvasApp.actx = aCanvas.getContext('2d');
	var bctx = canvasApp.bctx = bCanvas.getContext('2d');
	//audio.play();
 
  /* Draw main function */
  
  function draw (ctx,w,h) {
	  
	var actx = canvasApp.actx;
	var bctx = canvasApp.bctx;
    function drawVideo( video ) {
	   /* Draw video input, if any */
		var vx =( video !== null )? (canvas.width/2 - video.videoWidth/2): 0;
		ctx.globalCompositeOperation = "lighter";
		if ( (video !== null) && (video.readyState > 2) && (!video.paused) )
			ctx.drawImage(video, vx, 0, video.videoWidth, video.videoHeight);
		/* Composite fill blue background with tranparency tied to bass v */
		ctx.globalCompositeOperation = "source-atop";
		ctx.fillStyle = "rgba(0%, 0%, 100%, "+ (0.5 - vBuffer[aidx][0]*2) +")";
		ctx.fillRect(vx, 0, video.videoWidth, video.videoHeight);
		/* Now fill red background tied to snare v */
		ctx.fillStyle = "rgba(100%, 0%, 0%, "+ (0.25 - vBuffer[aidx][5]*2) +")";
		ctx.fillRect(vx, 0, video.videoWidth, video.videoHeight);
		/* Now fill green background */
		ctx.fillStyle = "rgba(0%, 100%, 0%, "+ (0.25 - vBuffer[aidx][12]*2) +")";
		ctx.fillRect(vx, 0, video.videoWidth, video.videoHeight);
		ctx.globalCompositeOperation = "source-over";
    }

	ctx.globalCompositeOperation = "source-over";
	ctx.globalAlpha = 1.0;

    try {
        if( time%2 ) {
            bctx.clearRect(0, 0, w, h);

            for( var o = 6; o > 0; o-- ) {
                aidx = canvasApp.aidx = 
                  graphSamples(actx, audio, aBuffer, fBuffer, vBuffer, aidx, w, h, o);
            }
            ctx.drawImage(aCanvas, 0, 0, (w>>1), h);
            ctx.save();
            ctx.translate(w, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(aCanvas, 0, 0, (w>>1), h);
            ctx.restore();

            bctx.drawImage(aCanvas, 1, 2, (w>>2)-1, h-4);
            bctx.fillStyle = window['background01'].style.color || "rgba(0%,0%,0%,0.005)";
            bctx.fillRect(0, 0, w, h);
        } else {
            actx.clearRect(0, 0, w, h);
            actx.drawImage(bCanvas, 1, 2, (w>>2)-1, h-4);
            actx.fillStyle = window['background02'].style.color || "rgba(0%,0%,0%,0.025)";
            actx.fillRect(0, 0, w, h);
        }
          if( window.canvasApp.canDrawVideo === true )
            drawVideo(audio);
        
	} catch (err) {
		Debugger.on = true;
		Debugger.log("Failed to draw: "+ err.stack);
		window.canvasApp.canDrawVideo = false;
		Debugger.on = false;
	}

	/* Text */
	ctx.lineWidth = 2;
	ctx.fillStyle = "hsl(180, 100%, 100%)";
	ctx.strokeStyle = "#fff";
	//Debugger.log( "aBuffer index: "+ aidx );
	if( aidx < 100 ) {
		ctx.font = "bold "+ aidx*2 +"px Comfortaa";
		if( aidx%2 === 0) { 
			ctx.fillText(announcement, 24, h>>1);
		} else ctx.strokeText(announcement, 24, h>>1);
	} else if( aidx > 300 ) {
		ctx.font = "bold 12px Verdana";
		ctx.fillText(title, 24, 128);
		if( (aidx > 1500) && (aidx < 3500) ) for(var i=0, z=copy.length; i<z; i++)
			ctx.fillText(copy[i], w>>1, (2500 - aidx) + (i*20) );
	}

	time++;
	if (time == "undefined") {
	  time = 0;
	}

	Debugger.log( "time: "+ time );
  }
  
  /* Graph samples */
  function graphSamples( ctx, audio, abuf, fbuf, vbuf, aidx, w, h, o ) {
	  
	try {
		if( abuf.length < 1 ) return aidx;
		if( audio.paused ) return aidx;
		if(! (audio.readyState > 3) ) return aidx;

		var idx = Math.floor( audio.currentTime*15.03 ) - 6;
		if(! abuf[parseInt(idx + o)] ) {
			Debugger.log( "abuf["+ idx +"] has not been recieved\n" );
			return aidx;
		}
		//Debugger.log( "aBuffer index: "+ idx );
		
		/* Reset canvas ctx properties */
		ctx.globalCompositeOperation = "source-over";
		ctx.globalAlpha = 1.0;
		ctx.font = "bold 10px Verdana";
		var hcorrect =  h / 2;
		/* Plot each sample on line that moves from left to right
		 * until we reach the end of the screen or the end of the sample
		 */
		if( idx < 1 ) {
			ctx.moveTo( 0, hcorrect );
		} else ctx.moveTo( 0, -(abuf[parseInt(idx + o)][0]*2*hcorrect) + hcorrect  );
		
		ctx.beginPath();
		var verts = 6;
		for( var i=0, z=abuf[parseInt(idx + o)].length, n=z; i<z; i++ ) {
			/* Draw a curve of the amplitude data */
			if( i > 0 ) {
				ctx.strokeStyle = canvasApp.strokeStyle;
				ctx.strokeWidth = canvasApp.strokeWidth;
				ctx.quadraticCurveTo(
					(i-1)*4, abuf[parseInt(idx + o)][i] + o,
					i*4, abuf[parseInt(idx + o)][i] + o
				);
			}
			/* Draw bars for the eq levels (fft) data */
			var barh = h - vbuf[parseInt(idx + o)][i]*h;
			amp2 = amp1;
			amp1 = (i === 3 && vbuf[parseInt(idx + o)][i] > 0.05)? vbuf[parseInt(idx + o)][i] : amp1;
			verts = (amp2 !== amp1)? parseInt(Math.rand()*10) : verts;
			if( (i <= n) ) {
				var freq = Math.floor(fbuf[parseInt(idx + o)][i]);
				ctx.fillStyle = "hsl("+ (200 - vbuf[parseInt(idx + o)][i]*180) +", 100%, 50%)";
				ctx.fillRect( i*4, barh, 4, h );
				//ctx.fillText( vbuf[parseInt(idx + o)][i]*360, i*24, barh-10 );
			}
		}
		
		polygon(ctx, verts, idx%(w)-(w>>3), idx%(h), (parseFloat(amp2+amp1)/2)*w, idx, 0);
		ctx.stroke();
		
		return ++idx;
		
	} catch(e) {
		Debugger.log( "graphSamples failed: " + e.message +" at frame "+ aidx +"\n"+ e.stack );
		return aidx;
	}
  }

  /* Draw polygons */
  function polygon(c, n, x, y, r, angle, counterclockwise, order) {
    var order = order || null;
    if (order === (null || "first")) {
      c.beginPath();
    }
    var angle = angle || 0;
    var counterclockwise = counterclockwise || false;
    //Compute vertex position and begin a subpath there
    c.moveTo(x + r*Math.sin(angle),
             y - r*Math.cos(angle));
    var delta = 2*Math.PI/n;
    //For remaining verts, 
    for (var i=1; i < n; i++) {
      //compute angle of this vertex,
      angle += counterclockwise ? -delta : delta;
      //then compute position of vertex and add line
      c.lineTo(x + r*Math.sin(angle),
               y - r*Math.cos(angle));
    }
    //Connect last vertex back to first
    c.closePath();
    
    if (order === (null || "last")) {
      //Fill the poly
      c.fill();
      //Outline the poly
      c.stroke();
    }
  }

  /* Begin draw loop */
  try {
    var context = canvas.getContext('2d');
	time = 0;
    drawLoop = setInterval(draw,31,context,canvas.width,canvas.height);
    Debugger.log("Draw loop started");
	appStarted = true;
	return appStarted;
  } catch(e) { 
    Debugger.log("drawLoop failed to start"); 
    return;
  }
};

canvasApp.updateFFT = function(prog) { setTimeout( function(prog) {
  fftProgress[prog] = true;
  Debugger.log( fftProgress[prog] );
  var aidx = canvasApp.aidx;
  var aBuffer = canvasApp.aBuffer;
  var fBuffer = canvasApp.fBuffer;
  var vBuffer = canvasApp.vBuffer;
  var firstBreak = false;
  var w = canvasApp.cv.width, h = canvasApp.cv.height;
  var hcorrect =  h / 2;
  if( 
	  typeof sBuffer !== 'object' ||
	  typeof aBuffer !== 'object' ||
	  typeof fBuffer !== 'object' ||
	  typeof vBuffer !== 'object'
	) return Debugger.log( "canvas Buffers are undefined");
  Debugger.log( "Progress "+ fftProgress.length +"%" );
  if( fftProgress.length < 10 ) return;
  
  if( sBuffer.length > 0 ) {
	var idx = ( aidx > aBuffer.length )? aidx: (aBuffer.length-1);
	for( var i=0, z=aBuffer.length; i<z; i++ ) {
		if(! aBuffer[i] ) {
			idx = i;
			break;
		}
	}
	for( var i=idx, z=sBuffer.length; i<z; i++ ) {
		var a=[], f=[], v=[];
		if( (typeof sBuffer[i] !== 'object') ) {
			if(! firstBreak ) {
				Debugger.log( "sBuffer has hole at "+ i +"\n" );
				for( var p in fftProgress ) {
					if( (p < prog) && (!fftProgress[p]) )
					  fftLoad(audioName, p, true);
				}
				firstBreak = true;
			}
			continue;
		}

		for( var j=0, n=sBuffer[i].length; j<n; j++ ) {
			var afv = sBuffer[i][j].split(',');
			/* Draw a curve of the amplitude data */
			var curveh = -afv[0]*hcorrect + hcorrect;
			a[j] = curveh;
			f[j] = afv[1];
			v[j] = afv[2];
		}
		aBuffer.push(a);
		fBuffer.push(f);
		vBuffer.push(v);
	}
	Debugger.log( "Total frames: "+ (aBuffer.length) );
  }
}, 266, prog); };
