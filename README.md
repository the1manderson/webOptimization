To execute site:
Copy the URL below into your browser and go
https://the1manderson.github.io/webOptimization

To test Pagespeed, use Chrome Canary and browse to https://developers.google.com/speed/pagespeed/insights/
Then enter https://the1manderson.github.io/webOptimization into the "Enter URL" field

Note: this file must be rendered from localhost or github pages. Due to pizza-worker. If you run pizza.html from drive, you will get an error in Chrome only. It renders correctly in IE and Firefox. Refer to https://stackoverflow.com/questions/21408510/chrome-cant-load-web-worker for more information on chrome cant load worker.


Enhancements made to improve performance:
Inlined style.css
Change pic height to 75px
Added async to analytics.js
Moved js to end of body
converted profilepic.jpg to profilepic.png
compressed Pizzeria jpg by 75%
removed Google web fonts
corrected Https error on google analytics link

Pizza:
replaced any querySelectors with getElementById or getElementsByClassName
moved declarations outside of loops
put pizza html creation logic to WebWorker


References:(In addition to inital builds and forums by udacity staff and fellow rookies)
Sliding background pizza code credited to Ilya Grigorik, was pulled from: https://www.igvita.com/slides/2012/devtools-tips-and-tricks/jank-demo.html
html and worker Sructures based on work by Aleksandar Petrovic

