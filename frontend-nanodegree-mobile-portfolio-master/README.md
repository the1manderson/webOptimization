## Instructions for optimization project.

First: index.html 

1. Navigate to https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Falpe88.github.io%2Ffrontend-nanodegree-mobile-portfolio%2Fsrc%2F
2. Verify result

Second: pizza.html
1. Navigate to https://alpe88.github.io/frontend-nanodegree-mobile-portfolio/src/views/pizza.html
2. Verify the page runs per outlined criteria.

Third: Run Locally
1. Download repo from https://github.com/alpe88/frontend-nanodegree-mobile-portfolio
2. Start your local server pointed at the dist/views folder
3. Navigate to pizza.html file via the server




##Changes made:
	Index:
		-minified assets
		-applied core styles as inline
		-deferred css calls per Google PageSpeed suggestion
		-deferred js calls where appropriate
		-applied loading of WebFonts per Google PageSpeed suggestion

	Pizza:
		-replaced any querySelector and querySelectorAll calls with getElementById or getElementsByClassName
		-moved variable declarations outside of loops where appropriate - i.e.: background pizza generation logic
		-moved all of pizza html creation logic to WebWorker
		-using animation frames to update positions
	