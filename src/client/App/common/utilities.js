var gameUtilities = function() {
	var exports = {};
	// Draw Text onto a canvas
exports.drawCanvasText = function(context2D, txt, pX, pY, clr, fnt)
{
	context2D.fillStyle = clr; // color
	context2D.font = fnt; // font
	context2D.fillText(txt, pX, pY); // text at position X, Y
} // end drawCanvasText

// Gets a random number inclusive to the parameters, so if the parameters are 10, 20, the number is between 10 and 20.
exports.randomFromTo = function(from, to)
{
    return Math.floor(Math.random() * (to - from + 1) + from);
}

// See if point x, y is inside the box specified by left, top, right, and bottom
exports.inside = function(x, y, left, top, right, bottom)
{
	if (x > left && x < right && y > top && y < bottom)
		return true;
	else
		return false;
} // end inside
return exports;
}