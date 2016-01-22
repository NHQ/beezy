(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = solver // takes a rayray of control points of n scale bezier curves

function beezn(scale){
  var fn = ''
  for(var x = 0; x <= scale; x++){
    fn += '(Math.pow(1 - x, ' + (scale - x) + ') * Math.pow(x, ' + x + ') * y['+x+'] '
    if(x > 0 && x < scale) fn += '* ' + scale + ') '
    else fn += ') '
    if(x < scale) fn += '+ '
  }
//  console.log(fn)
  return new Function('x,y', 'return ' + fn)
}

function solver(curves){
  var scale = curves.length
  
//  var pop = curves.pop()
//  var shift = curves.shift()
  curves = curves.reverse()
//  curves.push(pop)
//  curves.unshift(shift)
  
  var fn = beezn(scale - 1)
  var x = curves.map(function(e){return e[0]})
  var y = curves.map(function(e){return e[1]})

  return function(t){
    return fn(fn(t, x), y)
  }
}
/* a test, perhaps

var solve = solver(curves)

console.log(solve(0))


for(var t = 0; t < 1; t+=.00001){
  console.log(solveY(t), solve(t))
}

*/

},{}],2:[function(require,module,exports){
var jsynth = require('jsynth')
var master = new AudioContext


var solver = require('./beezy')


var curves = [[0,0], [.05, 1], [.2, .25],[.75, .5],  [1,0]]

var b = [[0,.50], [.05, 1], [.2, .25],[.75, .5],  [1,0]]

var solve = solver(curves)
var bass = solver(b)
var tempo = 88 / 60
var synth = jsynth(master, function(t){

  var a = Math.sin(t * 2 * Math.PI * 1215) * bass((tempo * (t - .125)) / 2 % 1)
  var b = Math.sin(t * 2 * Math.PI * 55) * bass((tempo * t / 2) % 1)
  var m = Math.sin(t * 2 * Math.PI * 202) * solve((tempo * t * 4 % 1)) 
  return b / 2 
       + m / 4
       + a / 4
})

synth.connect(master.destination)

var canvas = document.createElement('canvas')

document.body.appendChild(canvas)

canvas.width = window.innerWidth

canvas.height = window.innerHeight

canvas.style.background = 'green'

var ctx = canvas.getContext('2d')

ctx.moveTo(0, window.innerHeight)
ctx.beginPath()

for(var x = 0; x < window.innerWidth; x+= 1){
  ctx.lineTo(x, (1 - solve( x / window.innerWidth)) * window.innerHeight)
}

ctx.stroke()

},{"./beezy":1,"jsynth":3}],3:[function(require,module,exports){
module.exports = function (context, fn, bufSize) {

    if (typeof context === 'function') {
      fn = context;
      context = new webkitAudioContext() ;
    }

    if(!bufSize) bufSize = 4096;

    var self = context.createScriptProcessor(bufSize, 1, 1);

    self.fn = fn

    var tt = 0.0
    var ii = 0
    const rate = context.sampleRate

    self.i = self.t = 0

    window._SAMPLERATE = self.sampleRate = self.rate = context.sampleRate;

    self.duration = Infinity;

    self.recording = false;

    self.onaudioprocess = function(e){
      var output = e.outputBuffer.getChannelData(0)
      ,   input = e.inputBuffer.getChannelData(0);
      self.tick(output, input);
    };

    self.tick = function (output, input) { // a fill-a-buffer function

      for (var i = 0; i < output.length; i += 1) {

          tt = ii / rate
          ii = ii + 1
          output[i] = self.fn(tt, ii, input[i]);

      }

      return output
      
    };

    self.stop = function(){
    
      self.disconnect();

      self.playing = false;

      if(self.recording) {}
    };

    self.play = function(opts){

      if (self.playing) return;

      self.connect(self.context.destination);

      self.playing = true;

      return
    
    };

    self.record = function(){

    };

    self.reset = function(){
      self.i = self.t = 0
    };

    self.createSample = function(duration){
      self.reset();
      var buffer = self.context.createBuffer(1, duration, self.context.sampleRate)
      var blob = buffer.getChannelData(0);
      self.tick(blob);
      return buffer
    };

    return self;
};

function mergeArgs (opts, args) {
    Object.keys(opts || {}).forEach(function (key) {
        args[key] = opts[key];
    });

    return Object.keys(args).reduce(function (acc, key) {
        var dash = key.length === 1 ? '-' : '--';
        return acc.concat(dash + key, args[key]);
    }, []);
}

function signed (n) {
    if (isNaN(n)) return 0;
    var b = Math.pow(2, 15);
    return n > 0
        ? Math.min(b - 1, Math.floor((b * n) - 1))
        : Math.max(-b, Math.ceil((b * n) - 1))
    ;
}

},{}]},{},[2]);
