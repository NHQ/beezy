# beezy

this modules solves amplitude over time for bezier curves with any amount of control points (any scale).

It was designed for use creating audio envelopes. See [entry.js](entry.js) for an example that uses this module to draw an envelope.  To see the example in action, serve the public folder on localhost, and load index.html in your browser.

## usage

Note that bezier functions operate in the normalized space `0 <= t <= 1`, ergo this module does as well. See also modules `normalize-time` and `nvelope`.

Initiate the solver function with a rayray of control point coordinates:

```js
var solver = require('beezy')

//  the coordinates
var curves = [[0,0], [.05, 1], [.2, .25],[.75, .5],  [1,0]]

var solve = solver(curves)

for(var t = 0; t < 100; t++){
  var y = solve(t/100)
}

```

