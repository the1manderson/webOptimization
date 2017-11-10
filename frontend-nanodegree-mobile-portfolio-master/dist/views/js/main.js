/*
Welcome to the 60fps project! Your goal is to make Cam's Pizzeria website run
jank-free at 60 frames per second.

There are two major issues in this code that lead to sub-60fps performance. Can
you spot and fix both?


Built into the code, you'll find a few instances of the User Timing API
(window.performance), which will be console.log()ing frame rate data into the
browser console. To learn more about User Timing API, check out:
http://www.html5rocks.com/en/tutorials/webperformance/usertiming/

Creator:
Cameron Pittman, Udacity Course Developer
cameron *at* udacity *dot* com
*/



//Relevant pizza making code moved to web-worker and associated script.
var pizzaMakingWorker = new Worker("js/pizza-worker.js");
  

// resizePizzas(size) is called when the slider in the "Our Pizzas" section of the website moves.
var resizePizzas = function(size) {
  window.performance.mark("mark_start_resize");   // User Timing API function

  // Changes the value for the size of the pizza above the slider
  function changeSliderLabel(size) {
    switch(size) {
      case "1":
        document.getElementById("pizzaSize").innerHTML = "Small";
        return;
      case "2":
        document.getElementById("pizzaSize").innerHTML = "Medium";
        return;
      case "3":
        document.getElementById("pizzaSize").innerHTML = "Large";
        return;
      default:
        console.log("bug in changeSliderLabel");
    }
  }

  changeSliderLabel(size);

   // Returns the size difference to change a pizza element from one size to another. Called by changePizzaSlices(size).
  function determineDx (elem, size) {
    var oldWidth = elem.offsetWidth;
    var windowWidth = document.getElementById("randomPizzas").offsetWidth;
    var oldSize = oldWidth / windowWidth;

    // Changes the slider value to a percent width
    function sizeSwitcher (size) {
      switch(size) {
        case "1":
          return 0.25;
        case "2":
          return 0.3333;
        case "3":
          return 0.5;
        default:
          console.log("bug in sizeSwitcher");
      }
    }

    var newSize = sizeSwitcher(size);
    var dx = (newSize - oldSize) * windowWidth;

    return dx;
  }

  // Iterates through pizza elements on the page and changes their widths
  function changePizzaSizes(size) {
	var elem = document.getElementsByClassName("randomPizzaContainer");
	var dx = determineDx(elem[0], size);
    var newwidth = (elem[0].offsetWidth + dx) + 'px';
    for (var i = 0; i < elem.length; i++) {
      elem[i].style.width = newwidth;
    }
  }

  changePizzaSizes(size);

  // User Timing API is awesome
  window.performance.mark("mark_end_resize");
  window.performance.measure("measure_pizza_resize", "mark_start_resize", "mark_end_resize");
  var timeToResize = window.performance.getEntriesByName("measure_pizza_resize");
  console.log("Time to resize pizzas: " + timeToResize[timeToResize.length-1].duration + "ms");
};

window.performance.mark("mark_start_generating"); // collect timing data

// Moved for-loop to worker, sending message to worker to trigger relevant process.
	pizzaMakingWorker.postMessage({
		status: 'PIZZA-NAME',
		allThesePizzas: ''
	});
	var pizzaToBeAppended = "";
	pizzaMakingWorker.onmessage = function(e){
		var data = e.data;
		//console.log('Data returned from Worker: ', data);

		if(data.status === "STARTED"){
			console.log("Worker Started!");
		}else if (data.status === "STOPPED"){
			console.log("Worker Stopped!");
			pizzaMakingWorker.terminate();
		}else if (data.status === "PIZZA-NAMED"){
			pizzaToBeAppended = data.allThesePizzas;
			console.log('Pizza Menu Served.');
		}else{
			console.log('Why does our pizza have a name?.');
		  }
	};
	// Implemented setTimeout to delay the appending of menu until element string is returned from worker.
	setTimeout(function(){
		var tempEl = document.createElement('div');
			tempEl.innerHTML = pizzaToBeAppended;

		var pizzasDiv = document.getElementById("randomPizzas");
			pizzasDiv.appendChild(tempEl);
	}, 1400);


// User Timing API again. These measurements tell you how long it took to generate the initial pizzas
window.performance.mark("mark_end_generating");
window.performance.measure("measure_pizza_generation", "mark_start_generating", "mark_end_generating");
var timeToGenerate = window.performance.getEntriesByName("measure_pizza_generation");
console.log("Time to generate pizzas on load: " + timeToGenerate[0].duration + "ms");

// Iterator for number of times the pizzas in the background have scrolled.
// Used by updatePositions() to decide when to log the average time per frame
var frame = 0;

// Logs the average amount of time per 10 frames needed to move the sliding background pizzas on scroll.
function logAverageFrame(times) {   // times is the array of User Timing measurements from updatePositions()
  var numberOfEntries = times.length;
  var sum = 0;
  for (var i = numberOfEntries - 1; i > numberOfEntries - 11; i--) {
    sum = sum + times[i].duration;
  }
  console.log("Average scripting time to generate last 10 frames: " + sum / 10 + "ms");
}

// implemented requestAnimationFrame as seen on http://www.html5rocks.com/en/tutorials/speed/animations/
// declare variable for known scroll position
var latestKnownScrollY = 0,
ticking = false;

// Callback for scroll event
function onScroll() {
  latestKnownScrollY = window.scrollY;
  requestTick();
}

// calls requestAnimationFrame
function requestTick() {
  if(!ticking) {
    window.requestAnimationFrame(updatePositions);
  }
  ticking = true;
}

// The following code for sliding background pizzas was pulled from Ilya's demo found at:
// https://www.igvita.com/slides/2012/devtools-tips-and-tricks/jank-demo.html

// Moves the sliding background pizzas based on scroll position
function updatePositions() {
  frame++;
  window.performance.mark("mark_start_frame");

  var items = document.getElementsByClassName("mover");
  // document.body.scrollTop is no longer supported in Chrome.
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  for (var i = 0; i < items.length; i++) {
    var phase = Math.sin((scrollTop / 1250) + (i % 5));
    items[i].style.left = items[i].basicLeft + 100 * phase + 'px';
  }

  // User Timing API to the rescue again. Seriously, it's worth learning.
  // Super easy to create custom metrics.
  window.performance.mark("mark_end_frame");
  window.performance.measure("measure_frame_duration", "mark_start_frame", "mark_end_frame");
  if (frame % 10 === 0) {
    var timesToUpdatePosition = window.performance.getEntriesByName("measure_frame_duration");
    logAverageFrame(timesToUpdatePosition);
  }
  window.ticking = false;
}


// runs updatePositions on scroll  
// window.addEventListener('scroll', updatePositions);

//replaced scroll event listener with requestAnimationFrame
window.addEventListener('scroll', onScroll, false);

//moved parent element outside of DOMContentLoaded event listener and into variable to optimize performance
var masterPizzaContainer = document.getElementById("movingPizzas1");

// Generates the sliding pizzas when the page loads.
document.addEventListener('DOMContentLoaded', window.requestAnimationFrame(function() {
	var s = 256;
	var h = screen.height;
	var cols = 8;
	//adding rows to dynamically recalculate the needed amount based on screen height at load time.
	var rows = Math.floor(h / s);
	var l = cols * rows;
	var elem = '';
	  //moved image element var to outside of loop
	for (var i = 0; i <= l; i++) {
		elem = document.createElement("img");
		elem.className = 'mover';
		elem.src = "images/pizza.png";
		elem.style.height = "100px";
		elem.style.width = "73.333px";
		elem.basicLeft = (i % cols) * s;
		elem.style.top = (Math.floor(i / cols) * s) + 'px';
		masterPizzaContainer.appendChild(elem);
		console.log(elem);
	  }
  
  
  // items variable moved here to make it accessible globally
  window.items = document.getElementsByClassName("mover");
  window.requestAnimationFrame(updatePositions);
  
  /*
	I reviewed https://github.com/JordanFriesen/udacity-optimization-project/blob/gh-pages/views/js/main.js for more information on how to use requestAnimationFrame - the lectures available on Udacity were not the best, however, this lack of practical implementation made this project the most rewarding.
  */
  
}));