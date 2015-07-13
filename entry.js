var solver = require('./beezy')

var curves = [[0,1/2], [1/4, 0], [1, 0], [1/2,8], [3/4,0], [1,1/2]]

var solve = solver(curves)

var canvas = document.createElement('canvas')

document.body.appendChild(canvas)

canvas.width = window.innerWidth

canvas.height = window.innerHeight

canvas.style.background = 'green'

var ctx = canvas.getContext('2d')

ctx.moveTo(0, window.innerHeight)
ctx.beginPath()

for(var x = 0; x < window.innerWidth; x+= 1){
  ctx.lineTo(x, (1 - solve(x / window.innerWidth)) * window.innerHeight)
}

ctx.stroke()
