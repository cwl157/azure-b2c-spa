/*****************************************************************************************************
 * Object: Sprite                                                                                    *
 * Description: Handles updating position, animation, and drawing of objects. All objects that are   *
 *              drawn to the screen inherit this object.                                             *
 * Author: Carl Layton                                                                               *
 * Origin Date: 2012-09-16                                                                           *
 *****************************************************************************************************/
function Sprite(imageFileName, newx, newy, width, height, xVel, yVel, maxVel, xDelay, yDelay, totalFrames, frameCols, animDir, frameDelay, health, damage, alive, xDirection, yDirection)
{
	// Movement info
    this.xDirection = xDirection;
	this.yDirection = yDirection;
    this.alive = alive;
    this.x = newx;
    this.y = newy;
	this.xVel = xVel;
	this.yVel = yVel;
	this.maxVel = maxVel;
    this.xDelay = xDelay;
    this.yDelay = yDelay;
    this.xCounter = 0;
    this.yCounter = 0;
	this.jump = 0;
    this.faceAngle = 0;
	// Drawing info
    this.width = width;
    this.height = height;
	this.srcWidth = 0;
	this.srcHeight = 0;
	this.rotationDelay = 0;
	this.rotationCounter = 0;
	this.rotation = 0;
	// Animation info
    this.curFrame = 0;
    this.totalFrames = totalFrames;
    this.frameCols = frameCols;
    this.animDir = animDir;
    this.frameCounter = 0;
    this.frameDelay = frameDelay;
	// Other info
	this.id;
	this.type;
	this.points;
	this.health = health;
	this.damage = damage;
    this.image = new Image();
    this.image.src = imageFileName;
} // end Sprite

Sprite.prototype.updateAnimation = function()
{
	if (this.alive)
	{
		//update frame based on animdir
		if (++this.frameCounter > this.frameDelay)
		{
			this.frameCounter = 0;
			this.curFrame += this.animDir;

			if (this.curFrame < 0)
			{
				this.curFrame = this.totalFrames-1;
			}
			if (this.curFrame > this.totalFrames-1)
			{
				this.curFrame = 0;
			}
		}
	} // end is alive
};

Sprite.prototype.updatePosition = function ()
{
	if (this.alive)
	{
		//update x position
		if (++this.xCounter > this.xDelay)
		{
			this.xCounter = 0;
			this.x += this.xVel * this.xDirection;
		}

		//update y position
		if (++this.yCounter > this.yDelay)
		{
			this.yCounter = 0;
			this.y += this.yVel * this.yDirection;
		}
	} // end is alive
};

Sprite.prototype.updateRotation = function()
{
	if (this.alive)
	{
	//	if (++this.rotationCounter > this.rotationDelay)
	//	{
		//	this.rotationCounter = 0;
			this.rotation = (this.rotation + 10) % 360;
			//if (this.rotation > 360)
		//		this.rotation = 0;
		//}
	}
}

Sprite.prototype.spawn = function()
{
    this.alive = true;
}

Sprite.prototype.kill = function()
{
    this.alive = false;
}

//Sprite.prototype.inside = function(x,y,left,top,right,bottom)
// See if point x, y is inside the box specified by left, top, right, and bottom
function inside(x, y, left, top, right, bottom)
{
	if (x > left && x < right && y > top && y < bottom)
        return true;
	else
		return false;
}; // end inside

Sprite.prototype.collided = function(otherSprite, shrink)
{
    objLeft = otherSprite.x;
	objRight = otherSprite.x+otherSprite.width;
    objTop = otherSprite.y;
	objBottom = otherSprite.y+otherSprite.height;

    if ((inside(this.x, this.y, objLeft, objTop, objRight, objBottom)) ||
		(inside(this.x+(this.width/2), this.y, objLeft, objTop, objRight, objBottom)) ||
		(inside(this.x+this.width, this.y, objLeft, objTop, objRight, objBottom)) ||
		(inside(this.x, this.y+this.height, objLeft, objTop, objRight, objBottom)) ||
		(inside(this.x+(this.width/2), this.y+this.height, objLeft, objTop, objRight, objBottom)) ||
		(inside(this.x+this.width, this.y+this.height, objLeft, objTop, objRight, objBottom)))
		{
            return true;
        }
    else
        return false;
};

// Needs to be improved so the width and height in the source image can be different from the width and height it gets drawn at
Sprite.prototype.drawFrame = function(destContext)
{
    if (this.alive)
    {
        var srcx = (this.curFrame % this.frameCols) * this.width;
        // The next 2 calculations are needed because we need to round the row down to the nearest whole number so it always picks from the correct row.
        var tempSrcY = this.curFrame / this.frameCols;
        var roundDownSrcY = Math.floor(tempSrcY);
        var srcy = roundDownSrcY * this.height;
        destContext.drawImage(this.image, srcx, srcy, this.width, this.height, this.x, this.y, this.width, this.height);
    } // end only draw if we're alive
}; // end drawFrame

Sprite.prototype.drawFrame1 = function(destContext, img)
{
    if (this.alive)
    {
        var srcx = (this.curFrame % this.frameCols) * this.width;
        // The next 2 calculations are needed because we need to round the row down to the nearest whole number so it always picks from the correct row.
        var tempSrcY = this.curFrame / this.frameCols;
        var roundDownSrcY = Math.floor(tempSrcY);
        var srcy = roundDownSrcY * this.height;
        destContext.drawImage(img, srcx, srcy, this.width, this.height, this.x, this.y, this.width, this.height);
    } // end only draw if we're alive
}; // end drawFrame

Sprite.prototype.drawFrame2 = function(destContext, img)
{
    if (this.alive)
    {
        var srcx = (this.curFrame % this.frameCols) * this.width;
        // The next 2 calculations are needed because we need to round the row down to the nearest whole number so it always picks from the correct row.
        var tempSrcY = this.curFrame / this.frameCols;
        var roundDownSrcY = Math.floor(tempSrcY);
        var srcy = roundDownSrcY * this.height;
        destContext.drawImage(img, srcx, srcy, this.srcWidth, this.srcHeight, this.x, this.y, this.width, this.height);
    } // end only draw if we're alive
}; // end drawFrame

Sprite.prototype.drawImageRot = function(ctx, img)
{
	if (this.alive)
	{
	var srcx = (this.curFrame % this.frameCols) * this.width;
    // The next 2 calculations are needed because we need to round the row down to the nearest whole number so it always picks from the correct row.
    var tempSrcY = this.curFrame / this.frameCols;
    var roundDownSrcY = Math.floor(tempSrcY);
    var srcy = roundDownSrcY * this.height;
		
	//Convert degrees to radian 
	var rad = this.rotation * Math.PI / 180;

    //Set the origin to the center of the image
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(img, srcx, srcy, this.srcWidth, this.srcHeight, this.width / 2 * (-1), this.height / 2 * (-1), this.width, this.height);

    //reset the canvas  
    ctx.rotate(rad * ( -1 ) );
    ctx.translate((this.x + this.width / 2) * (-1), (this.y + this.height / 2) * (-1));
	}
}