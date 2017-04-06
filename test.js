var beezy = require('./')

var cp = [[0,0],[0,1],[1,1],[1,0]]

var fn = beezy(cp)

var t = 0
var sr = 4

for(t = 0; t <= 1; t+=1/sr){
  console.log(fn(t))
}
