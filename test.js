var beezy = require('./')

var cp = [[0.8791666666666667,0.15416666666666667],[-0.44583333333333336,1.3458333333333334],[1.4,0.9625],[0.12916666666666668,0.19166666666666668]]
var fn = beezy(cp)

var t = 0
var sr = 16

x = []
y = []
for(t = 0; t <= 1; t+=1/sr){
  xy = fn(t)
  x.push(xy[0])
  y.push(xy[1])
}

console.log(x)
console.log(y)

