// fixed, from http://www.quirksmode.org/js/findpos.html

module.exports = function(obj){

  var curleft = curtop = 0;

  if (obj.parentElement) {

    do {
      
      curleft += obj.offsetLeft;
      
      curtop += obj.offsetTop;

    } while (obj = obj.parentElement);

  }

  return [curleft,curtop];

}
