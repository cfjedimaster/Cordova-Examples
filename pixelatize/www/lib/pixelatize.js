
var pixelatizeModule = (function() {

  var ctx;

  var getAverageRGB = function(imgData) {
    var red = 0;
    var green = 0;
    var blue = 0;
    var total = 0;
    
    for ( var i = 0; i < imgData.length; i += 4 ) {
      if ( imgData[i+3] !== 0 ) {
        red += imgData[i+0];
        green += imgData[i+1];
        blue += imgData[i+2];
        total++;
      }
    }
    
    var avgRed = Math.floor(red/total);
    var avgGreen = Math.floor(green/total);
    var avgBlue = Math.floor(blue/total);
    
    return 'rgba(' + avgRed + ',' + avgGreen + ',' + avgBlue + ', 1)';
  };
  
  var pixelatize = function(size) {
    for ( var x = 0; x < imgWidth; x += size ) {
      for ( var y = 0; y < imgHeight; y += size ) {
        var pixels = ctx.getImageData(x, y, size, size);
        var averageRGBA = getAverageRGB(pixels.data);
        ctx.fillStyle = averageRGBA;
        ctx.fillRect(x, y, size, size);
      }
    }
    console.log('done with pixeling '+size);
  };

  return {

    pixelatizeImage:function(imgDom, canvasDom, pixelSize) {
      console.log('calling inner func with '+imgDom+','+canvasDom+','+pixelSize);
      ctx = canvasDom.getContext('2d');

      img = new Image();
      img.onload = function() {
        console.log('img.onload');
        imgWidth = img.width;
        imgHeight = img.height;
        console.log(imgWidth+','+imgHeight);
        canvasDom.setAttribute('width', imgWidth);
        canvasDom.setAttribute('height', imgHeight);
        ctx.drawImage(img,0,0);
        pixelatize(pixelSize);

        //console.log(canvasDom.toDataURL('image/png'));
      }
      //img.src = URL.createObjectURL(img);
      img.src = imgDom.src;

    }
  }

}());

/*
  var $canvas ;
  var $size;
  var ctx;


$(function(){

  $canvas = $('#image');
  $size = $('#pixel-size');
  ctx = $canvas[0].getContext('2d');
});

  var getAverageRGB = function(imgData) {
    var red = 0;
    var green = 0;
    var blue = 0;
    var total = 0;
    
    for ( var i = 0; i < imgData.length; i += 4 ) {
      if ( imgData[i+3] !== 0 ) {
        red += imgData[i+0];
        green += imgData[i+1];
        blue += imgData[i+2];
        total++;
      }
    }
    
    var avgRed = Math.floor(red/total);
    var avgGreen = Math.floor(green/total);
    var avgBlue = Math.floor(blue/total);
    
    return 'rgba(' + avgRed + ',' + avgGreen + ',' + avgBlue + ', 1)';
  };
  
  var pixelatize = function(size) {
    for ( var x = 0; x < imgWidth; x += size ) {
      for ( var y = 0; y < imgHeight; y += size ) {
        var pixels = ctx.getImageData(x, y, size, size);
        var averageRGBA = getAverageRGB(pixels.data);
        ctx.fillStyle = averageRGBA;
        ctx.fillRect(x, y, size, size);
      }
    }
  };

function testPix() {

    img = new Image();
    img.onload = function() {
      imgWidth = img.width;
      imgHeight = img.height;
      $canvas.attr('width', imgWidth);
      $canvas.attr('height', imgHeight);
      ctx.drawImage(img,0,0);
console.log(parseInt($size.val()));
      pixelatize(parseInt($size.val()));
      $('.hidden').removeClass('hidden');
    }
    var imgSel = $("#selectedImage").get(0);
console.log(imgSel.src);
    //img.src = URL.createObjectURL(img);
    img.src = imgSel.src;

};
*/