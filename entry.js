var solver = require('../beezy')
var hover = require('mouse-around')
var touchdown = require('../touchdown')
var findPos = require('./findPosition')

var curves = [[0,0], [0, 1],[1, 1], [1,0]]



var canvas = canv()//document.createElement('canvas')
var parEl = parent()

parEl.appendChild(canvas)
document.body.appendChild(parEl)
var input = document.createElement('input')
input.type = 'text'
document.body.appendChild(input)
//canvas.width = window.innerWidth

//canvas.height = window.innerHeight

var draw = function(){
  var ctx = canvas.getContext('2d')
  input.value = '[' + curves.map(function(e){
    return `[${e.toString()}]`
  }).join().toString() + ']'
  var solve = solver(curves)
  ctx.clearRect(0,0,canvas.width, canvas.height)
  ctx.moveTo(0, canvas.height)
  ctx.beginPath()
  for(var x = 0; x < canvas.width; x+= 1){
    ctx.lineTo(x, (1 - solve( x / canvas.width)) * canvas.height)
  }
  ctx.stroke()
}

draw()

canvas.pos = findPos(canvas)
curves.forEach(function(e, i){
  var dot = handle(e, canvas.pos)
  touchdown.start(dot)
  ;(function(dot, i){
  dot.addEventListener('deltavector', function(e){
    //console.log(e, e.detail.offsetX, e.detail.offsetY)
    window.requestAnimationFrame(function(){
      dot.style.left = e.detail.x - 15 + 'px'
      dot.style.top = e.detail.y - 15 + 'px'
      curves[i][0] = (e.detail.x  - canvas.pos[0]) / canvas.width
      curves[i][1] = (canvas.height - e.detail.y + canvas.pos[1]) / canvas.height
      draw()
    })
  })})(dot, i)
  parEl.appendChild(dot)
})

function parent(){
  var node = document.createElement('div')
  var $ = node.style
  $.width = 400 + 'px'
  $.height = 244 + 'px'
  $.border = '3px solid black'
  $.display = 'flex'
  $.alignItems =  'center'
  $.justifyContent = 'center'
  return node
}

function canv(){
  var node = document.createElement('canvas')
  var $ = node.style
  node.width = 244
  $.width  = node.width + 'px'
  node.height = 122
  $.height = node.height + 'px'
  $.border = '3px solid purple'
  $.boxSizing = 'border-box'
  $.background = 'green'
  //$.position = 'absolute'
  //$.left = 22 + 'px'
  //$.top = 66 + 'px'
  return node

}

function handle(vec, pos){
  var node = document.createElement('div')
  var $ = node.style
  $.height = $.width = '30px'
  $.position = 'absolute'
  $.border = '3px solid blue'
  $.background = 'hsla(167, 50%, 50%, 1)'
  $.borderRadius = '50% 50%'
  $.zIndex = '100'
  $.left = vec[0] * canvas.width - 15 + pos[0] + 'px'
  $.top = canvas.height - vec[1] * canvas.height - 15 + pos[1] +  'px'
  return node
}
