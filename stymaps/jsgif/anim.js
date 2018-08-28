//This Demonstrates calling the animWorker.js web worker, allowing for non-blocking
//Gif building.


function animDelayValue() //Gets a user defined frame delay from user input (dom element), displays current value on dom
{
	var value = new Number(document.getElementById("animDelay").value/1000);
	value.toFixed(2);
	document.getElementById("animDelayVal").innerHTML = value;
}
animDelayValue(); //initialize delay value display 
this.animDelayValue = animDelayValue;	//make animDelayValue global
this.gifalizer = function() //function, called from DOM to build gif.
{
	function getAnimScaleFactor()
	{
		var autosaveElements = document.getElementsByName("animScale"); //DOM widget to set scale factor to 100%, 50% or 25%
		var autosaveValue = "4"
		for (var i=0; i < autosaveElements.length; i++)
		{
			if (autosaveElements[i].checked)
			{
				autosaveValue = autosaveElements[i].value;
				break;
			}
		}
		if(autosaveValue == "1")
		{
			return 1;
		}
		if(autosaveValue == "2")
		{
			return 2;
		}
		else
		{
			return 4;
		}
	}
	
	var delay = document.getElementById("animDelay").value;
	var scale = getAnimScaleFactor();
	
	var animation_parts = new Array(paintedCanvases.length);

	var worker = new Worker('animWorker.js');
	//worker.onmessage = function(e)
	//{
	//	console.log(e.data);
	//}
	
	//call web worker. 
	worker.onmessage = function(e)
	{
		//handle stuff, like get the frame_index
		var frame_index = e.data["frame_index"];
		var frame_data = e.data["frame_data"];
		animation_parts[frame_index] = frame_data;
		console.log(frame_index);
		for(var j = 0; j < paintedCanvases.length; j++)
		{
			if(animation_parts[j] == null)
			{
				return;
			}
		}
		console.log("append");
		//check when everything else is done and then do animation_parts.join('') and have fun
		var binary_gif = animation_parts.join('');
		var data_url = 'data:image/gif;base64,'+window.btoa(binary_gif);
		
		var gifItem = new Image();
		gifItem.src = data_url;
		var thumbs = document.getElementById("gifContainer");
		
		//nuke all child nodes!
		while(thumbs.hasChildNodes())
		{
			thumbs.removeChild(thumbs.lastChild);
		}
		document.getElementById("gifContainer").appendChild(gifItem);	
	}

	var imageItems = new Array(); //hacky way to ensure that an arbitrary number of onload events occur.
	//paintedCanvases is an array of canvas data generated by a canvas toDataURL calls elsewhere in the parent scope. Replicate this how you wish.
	for(var i = 0; i < paintedCanvases.length; i++)
	{
		imageItems[i] = new Image();
		imageItems[i].src = paintedCanvases[i];
		imageItems[i].isloaded = false;
		imageItems[i].index = i;
		imageItems[i].onload = function()
		{
			var scratchCanvas = document.createElement("canvas"); 
			scratchCanvas.width = comicPane.width/scale;
			scratchCanvas.height = comicPane.height/scale;
			var scratchCanvasContext = scratchCanvas.getContext("2d");
			scratchCanvasContext.fillStyle = "#FFFFFF";
			scratchCanvasContext.fillRect(0,0,scratchCanvas.width, scratchCanvas.height);
			scratchCanvasContext.drawImage(this,0,0,scratchCanvas.width,scratchCanvas.height);
			var imdata = scratchCanvasContext.getImageData(0,0, scratchCanvas.width, scratchCanvas.height).data;
			console.log(this.index);
			worker.postMessage({"frame_index": this.index, "delay": delay, "frame_length":paintedCanvases.length-1, "height":scratchCanvas.height, "width":scratchCanvas.width, "imageData":imdata}); //imarray.join(',')

		}
	}
}