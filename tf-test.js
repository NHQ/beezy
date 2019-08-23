var beezy = require('./tf-beezy')
var param = require('../parametrical')
var beezn = require('./')
var ui = require('getids')()


var cp = [[.25, .9],[.97,.35], [0, 0], [0,1], [1,0.7]]

var para = param({
  bezier: {type: "bezier", value: cp, el: ui.bezel},
  bezier2: {type: "bezier", value: cp.map(e=>[.5, .5]), el: ui.bezel2}
})

//para[1].update(cp)
//process.exit()
//console.log(t)



ui.train.addEventListener('click', ()=>{
  var i = 0
  var sr = 16
  var bzs = beezn(cp)
  var x = []
  var y = []
  for(var i = 0; i < sr; i++){
    var z = bzs(i/sr)
    x[i] = z[0]
    y[i] = z[1]
  }
  var fn = beezy(cp.length, sr)
  var solv = fn(x, y, .0001, (x,y, train)=>{
    if(++i%10===0){
      x= x.sum(1).dataSync()
      y = y.sum(1).dataSync()
      para[1].update(cp.map((e,i)=>[x[i], y[i]]))    
    }
    if(!train) window.alert('Done')
    u
    return
  })
  solv[0].sum(1).print()
  solv[1].sum(1).print()
  solv[0] = solv[0].sum(1).dataSync()
  solv[1] = solv[1].sum(1).dataSync()
  //para[1].update(cp.map((e,i)=>[solv[0][i], solv[1][i]]))    
})

//z[0].print()
