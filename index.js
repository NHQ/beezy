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

  return function(t, curves){
      let _y = fn(t, y)
    let _x = fn(t, x)
    let yx = fn(x, y)
    let dy = yx - _x//.map((e,i) => e - _x[i])
    console.log(dy)
    return [_x, _y, dy]

//    var x = curves[0] //.map(function(e){return e[0]})
//    var y = curves[1] //.map(function(e){return e[1]})
//    return [fn(t, x), fn(t, y)]
    //return fn(fn(t, x), y)
  }
}
