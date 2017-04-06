module.exports = solver // takes a rayray of control points of n scale bezier curves

function beezn(scale){
  var fn = ''
  for(var x = 0; x <= scale; x++){
    fn += '(Math.pow(1 - x, ' + (scale - x) + ') * Math.pow(x, ' + x + ') * y['+x+'] '
    if(x > 0 && x < scale) fn += '* ' + scale + ') '
    else fn += ') '
    if(x < scale) fn += '+ '
  }
  fn = new Function('x,y', 'return ' + fn)
  return fn 
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
