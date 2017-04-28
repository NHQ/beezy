var solver = require('../beezy')
var hover = require('mouse-around')
var touchdown = require('../touchdown')
var findPos = require('./findPosition')

var curves = [[0,0],[0,1],[.33, .33],[.66, .66],[1,1],[1,0]]



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
  ctx.lineWidth = 7
  ctx.lineColor = 'yellow'
  for(var x = 0; x < canvas.width; x+=1 ){
    var s = solve( x / canvas.width) 
    ctx.lineTo(s[0] * canvas.width, (1 - s[1]) * canvas.height)
  }
  ctx.stroke()
}

draw()

canvas.pos = findPos(canvas)
curves.forEach(function(e, i){
  var dot = handle(e, canvas.pos, i)
  touchdown.start(dot)
  ;(function(dot, i){
  dot.addEventListener('deltavector', function(e){
    //console.log(e, e.detail.offsetX, e.detail.offsetY)
    window.requestAnimationFrame(function(){
      dot.style.left = e.detail.x - 7.5 + 'px'
      dot.style.top = e.detail.y - 7.5 + 'px'
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
  $.width = 480 + 'px'
  $.height = 480 + 'px'
  $.border = '3px solid black'
  $.display = 'flex'
  $.alignItems =  'center'
  $.justifyContent = 'center'
  return node
}

function canv(){
  var node = document.createElement('canvas')
  var $ = node.style
  node.width = 240
  $.width  = node.width + 'px'
  node.height = 240
  $.height = node.height + 'px'
  $.border = '3px solid black'
  $.boxSizing = 'border-box'
  $.backgroundColor ='#eee'
  $.backgroundImage = 'linear-gradient(45deg, gray 25%, transparent 25%, transparent 75%, gray 75%, gray), linear-gradient(45deg, gray 25%, transparent 25%, transparent 75%, gray 75%, gray)'
  $.backgroundSize='30px 30px'
  $.backgroundPosition = '0 0, 15px 15px'
  //$.position = 'absolute'
  //$.left = 22 + 'px'
  //$.top = 66 + 'px'
  return node

}

function handle(vec, pos, i){
  var c = ['red', 'green', 'yellow', 'blue']
  var node = document.createElement('div')
  var $ = node.style
  var r = 15
  $.height = $.width = r+'px'
  $.position = 'absolute'
  $.border = '3px solid black'
  $.background = c[i % c.length] 
  $.borderRadius = '50% 50%'
  $.zIndex = '100'
  $.left = vec[0] * canvas.width - r/2 + pos[0] + 'px'
  $.top = canvas.height - vec[1] * canvas.height - r/2 + pos[1] +  'px'
  return node
}
