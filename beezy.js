var curves = [[0,0], [0,1], [0,1], [1,0]]

function solveY(t){
  return beezy(solveX(t), curves.map(function(e){ return e[1] }))
}

function solveX(t){
  return beezy(t, curves.map(function(e){ return e[0] }))
}

function beezy(x,y){
  return (Math.pow(1 - x, 3) * y[0]) + (3 * Math.pow(1 -x, 2) * x * y[1]) + (3 * (1 - x) * Math.pow(x, 2) * y[2]) + Math.pow(x, 3) * y[3]
}

function beezn(scale){
  var fn = ''
  for(var x = 0; x <= scale; x++){
    fn += '(Math.pow(1 - x, ' + (scale - x) + ') * Math.pow(x, ' + x + ') * y['+x+']) '
    if(x > 0 && x < scale) fn += '* ' + scale + ' '
    if(x < scale) fn += '+ '
  }
  return new Function('x,y', 'return ' + fn)
}

function solver(curves){
  var scale = curves.length
  var fn = beezn(scale - 1)
  var x = curves.map(function(e){return e[0]})
  var y = curves.map(function(e){return e[1]})

  return function(t){
    return fn(fn(t, x), y)
  }
}

var solve = solver(curves)

console.log(solve(0))


for(var t = 0; t < 1; t+=.00001){
  console.log(solveY(t), solve(t))
}

