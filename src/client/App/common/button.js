var STATE_DOWN = 0;
var STATE_UP = 1;
var STATE_RELEASED = 2;

function Button(x, y, width, height, upImage, downImage, isPressed, isActive, currentState)
{
	// Properties
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.upImage = upImage;
	this.downImage = downImage;
	this.isPressed = isPressed;
	this.isActive = isActive;
	this.currentState = currentState;
	
	// Methods
	this.update = function(mx, my, mpressed, prev_mpressed) {
		if (this.isActive)
    	{
			if (inside(mx, my, this.x, this.y, this.x+this.width, this.y+this.height))
        	{
				//alert("inside button");
				if (mpressed)
            	{
					// mouse is currently down
                	this.currentState = STATE_DOWN;
					//alert("Button Pressed test");
            	}
            	else if (!mpressed && prev_mpressed)
            	{
					// mouse was just released
                	if (this.currentState == STATE_DOWN)
                	{
						// button was just down
                    	this.currentState = STATE_RELEASED;
						//alert("Button activated");
               	 	}
           		 }

            	else
            	{
					this.currentState = STATE_UP;
            	}
			} // end is collision
		
        	else
        	{
				this.currentState = STATE_UP;
        	}

        	if (this.currentState == STATE_RELEASED)
        	{
				this.isPressed = true;
        	}	
    	} // end is button active
	};
	this.draw = function(context2D) {
		if (this.currentState == STATE_DOWN) // If the button is pressed.
		context2D.drawImage(this.downImage,this.x, this.y, this.width, this.height);

    else // If the button is not pressed.
		context2D.drawImage(this.upImage,this.x, this.y, this.width, this.height);
	};
} // end Button

/*function update(mx, my, mpressed, prev_mpressed)
{
	if (this.isActive)
    {
		if (inside(mx, my, this.x, this.y, this.x+this.width, this.y+this.height))
        {
			//alert("inside button");
			if (mpressed)
            {
				// mouse is currently down
                this.currentState = STATE_DOWN;
				//alert("Button Pressed test");
            }
            else if (!mpressed && prev_mpressed)
            {
				// mouse was just released
                if (this.currentState == STATE_DOWN)
                {
					// button was just down
                    this.currentState = STATE_RELEASED;
					//alert("Button activated");
                }
            }

            else
            {
				this.currentState = STATE_UP;
            }
		} // end is collision
		
        else
        {
			this.currentState = STATE_UP;
        }

        if (this.currentState == STATE_RELEASED)
        {
			this.isPressed = true;
        }	
    } // end is button active
} // end update

function draw(context2D)
{
	if (this.currentState == STATE_DOWN) // If the button is pressed.
		context2D.drawImage(this.downImage,this.x, this.y, this.width, this.height);

    else // If the button is not pressed.
		context2D.drawImage(this.upImage,this.x, this.y, this.width, this.height);
} // end draw
/*
function draw(x, y, context)
{
	if (this.currentState == STATE_DOWN) // If the button is pressed.
		context2D.drawImage(this.downImage,x, y);

    else // If the button is not pressed.
		context2D.drawImage(this.upImage,x, y);
} // end draw
*/

