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
  var _curves = curves.map(function(e){return e}).reverse()
//  curves.push(pop)
//  curves.unshift(shift)
  
  var fn = beezn(scale - 1)
  var x = _curves.map(function(e){return e[0]})
  var y = _curves.map(function(e){return e[1]})

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
