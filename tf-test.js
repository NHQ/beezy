var beezy = require('./tf-beezy')
var param = require('../parametrical')
var beezn = require('./')
var ui = require('getids')()


var cp = [[0,0],[.25,0], [.5, 1], [.75,0], [1,0]]

var para = param({
  bezier: {type: "bezier", value: cp, el: ui.bezel}
})

//process.exit()
var sr = 16
//console.log(t)
var bzs = beezn(cp)
var x = []
var y = []

for(var i = 0; i < sr; i++){
  var z = bzs(i/sr)
  x[i] = z[0]
  y[i] = z[1]
}

console.log(x, y)


setTimeout(()=>{
//  var fn = beezy(cp.length, sr)
//  var solv = fn(x, y, .001)
//  solv[0].sum(1).print()
//  solv[1].sum(1).print()
}, 1000)
//z[0].print()
