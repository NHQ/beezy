var binom = require('binomial')
var $ = require('../various/utils.js')
var tf = $.tf

module.exports = solver // takes a rayray of control points of n scale bezier curves

function solver(scale, sr, rate=.001){
  var t = Array(sr).fill(0).map((e, i) => i / sr)
  t = tf.tensor(t, [sr, 1], 'float32')
  var stack = beezn(scale - 1, t)
  var oz = tf.train.adam(rate)
  var x = tf.variable(tf.eye(scale).mul($.scalar(.5))) 
  var y = tf.variable(tf.eye(scale).mul($.scalar(.5)))
  var eye = tf.eye(scale)

  return async function(solveX, solveY, loss=.01, cb=null){
    solveX = tf.tensor(solveX, [sr])
    solveY = tf.tensor(solveY, [sr])
    var d = []
    var train = true
    while(train){
      let l = oz.minimize(_ => {
        var xs = tf.sum(tf.matMul(stack, x.mul(eye)), 1)
        var ys = tf.sum(tf.matMul(stack, y.mul(eye)), 1)
        //var xl = solveX.sub(xs)
        //var yl = solveY.sub(ys)
        var ls = tf.losses.meanSquaredError(solveX, xs).add(tf.losses.meanSquaredError(solveY, ys))
        //var l = tf.sqrt(tf.mean(tf.pow(tf.concat([xl, yl], [1]), $.scalar(2)), [1]))
        //ls.print()
        d.push(xs, ys)
        return ls.asScalar()
      }, true)
      //console.log(JSON.stringify(tf.memory()))
      train = (l.dataSync()[0] > loss)
      if(cb) {
        cb(x, y, train)
        await tf.nextFrame()
      }
      d.push(l)
      tf.dispose(d)
      d = []
    }
    return [x, y]
    //return fn(fn(t, x), y)
  }
}

function beezn(scale, t){
  var fn = ''
  var bi = Array(scale + 1).fill(0).map(function(e,i){
    return binom.get(scale, i)
  })
  var nt = $.scalar(1).sub(t)
  var timestack = []
  for(var i =0; i <= scale; i++){
    var cpt
    if(i === 0){
      cpt = tf.pow(nt, $.scalar(scale - i))
    }
    else if(i === scale) cpt = tf.pow(t, $.scalar(i))
    else {
      cpt = tf.pow(nt, $.scalar(scale - i))
      cpt = cpt.mul($.scalar(bi[i]))
      cpt = cpt.mul(tf.pow(t, $.scalar(i)))
    }
    timestack.push(cpt)
  }
  timestack = tf.concat(timestack, [1])

  return timestack
  /*
  for(var x = 0; x <= scale; x++){
    fn += '($.tf.pow($.scalar(1).sub(x), $.scalar(' + (scale - x) + ')).mul($.tf.pow(x, $.scalar(' + x + '))))'
    if(x > 0 && x < scale) fn += '.mul($.scalar(' + bi[x] + '))'
    //else fn += ')'
    if(x > 0) fn+=')'
    if(x < scale) fn += '.add('
  }
  fn = new Function('$, x', 'return ' + fn)
  return fn 
  */
}

