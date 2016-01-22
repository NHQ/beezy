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
