var binom = require('binomial')

module.exports = solver // takes a rayray of control points of n scale bezier curves

function beezn(scale){
  var fn = ''
  var bi = Array(scale + 1).fill(0).map(function(e,i){
    return binom.get(scale, i)
  })
  for(var x = 0; x <= scale; x++){
    fn += '(Math.pow(1 - x, ' + (scale - x) + ') * Math.pow(x, ' + x + ') * y['+x+'] '
    if(x > 0 && x < scale) fn += '* ' + bi[x] + ') '
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

  return function(t, i){
      let _y = fn(t, y)
    let _x = fn(t, x)
    let yx = (fn(_x, y) * _y) + (_y/2) 
    var dy = fn(Math.pow(_x,1/4), y)
    //if(_y - _x > 0) dy = fn(_x, y) * _x//Math.sqrt(Math.pow(_y, 2) + Math.pow(_x, 2))//2e6)//.map((e,i) => e - _x[i])
    //else dy = Math.sqrt(Math.pow(_y, 2) - Math.pow(_x, 2))//2e6)//.map((e,i) => e - _x[i])
    return [_x, _y, dy ]

//    return [fn(t, x), fn(t, y)]
    //return fn(fn(t, x), y)
  }
}
