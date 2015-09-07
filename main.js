/**
 * Created by ehtd on 9/6/15.
 */
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');


var bgReady = false;
var scaledImageReady = false;

var scaledMap;
var scale = 2;
var tileSize = 16 * scale;
var xTiles = 13;
var yTiles = 13;

var map = new Image();
map.src = 'mvh.png';
map.onload = function () {
    bgReady = true;
    scaledMap = resize(map, scale);
    scaledImageReady = true;
};



var reset = function () {

};

var update = function () {

};

var render = function () {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    drawBackground();

    // TODO: Add game render logic

    drawScanlines();
};

var loop = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    requestAnimationFrame(loop);
};

var drawBackground = function () {
    var background = [
        12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 13,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0,
        14, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 15];

    var x = 0;
    var y = 0;
    background.forEach(function(id){
        drawTile(id,
            tileSize,
            tileSize,
            x * tileSize,
            y * tileSize);
        x++;
        if (x == yTiles) {
            x = 0;
            y++;
        }
    });
};

var drawScanlines = function () {
    var x = 0;
    var y = 0;
    for (var i = 0; i < xTiles * yTiles; i++) {
        drawTile(11,
            tileSize,
            tileSize,
            x * tileSize,
            y * tileSize);
        x++;
        if (x == yTiles) {
            x = 0;
            y++;
        }
    }
};

var drawTile = function(tileId, width, height, x, y) {

    if (!scaledImageReady) return;

    var ox = tileId % 4;
    var oy = Math.floor(tileId / 4);
    var sx = ox * width;
    var sy = oy * height;

    ctx.drawImage(scaledMap, sx, sy, width, height, x, y, width, height);
}

// http://phoboslab.org/log/2012/09/drawing-pixels-is-hard
var resize = function( img, scale ) {
    // Takes an image and a scaling factor and returns the scaled image

    // The original image is drawn into an offscreen canvas of the same size
    // and copied, pixel by pixel into another offscreen canvas with the
    // new size.

    var widthScaled = img.width * scale;
    var heightScaled = img.height * scale;

    var orig = document.createElement('canvas');
    orig.width = img.width;
    orig.height = img.height;
    var origCtx = orig.getContext('2d');
    origCtx.drawImage(img, 0, 0);
    var origPixels = origCtx.getImageData(0, 0, img.width, img.height);

    var scaled = document.createElement('canvas');
    scaled.width = widthScaled;
    scaled.height = heightScaled;
    var scaledCtx = scaled.getContext('2d');
    var scaledPixels = scaledCtx.getImageData( 0, 0, widthScaled, heightScaled );

    for( var y = 0; y < heightScaled; y++ ) {
        for( var x = 0; x < widthScaled; x++ ) {
            var index = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
            var indexScaled = (y * widthScaled + x) * 4;
            scaledPixels.data[ indexScaled ] = origPixels.data[ index ];
            scaledPixels.data[ indexScaled+1 ] = origPixels.data[ index+1 ];
            scaledPixels.data[ indexScaled+2 ] = origPixels.data[ index+2 ];
            scaledPixels.data[ indexScaled+3 ] = origPixels.data[ index+3 ];
        }
    }
    scaledCtx.putImageData( scaledPixels, 0, 0 );
    return scaled;
};

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var then = Date.now();
reset();
loop();