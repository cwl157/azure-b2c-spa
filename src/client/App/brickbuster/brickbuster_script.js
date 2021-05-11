var brickBuster = function () {
var exports = {};
var FPS = 30;

var SOURCE_PADDLE_IMAGE = "/brickbuster/images/paddle.png";
var SOURCE_BALL_IMAGE = "/brickbuster/images/ball.png";
var SOURCE_BLOCK1_IMAGE = "/brickbuster/images/block1.png";
var SOURCE_BLOCK2_IMAGE = "/brickbuster/images/block2.png";
var SOURCE_BLOCK3_IMAGE = "/brickbuster/images/block3.png";
var SOURCE_BLOCK4_IMAGE = "/brickbuster/images/block4.png";
var SOURCE_BLOCK5_IMAGE = "/brickbuster/images/block5.png";
var SOURCE_BLOCK6_IMAGE = "/brickbuster/images/block6.png";
var SOURCE_BUTTON_BACK_DOWN = "/brickbuster/images/button_back_downstate.png";
var SOURCE_BUTTON_BACK_UP = "/brickbuster/images/button_back_upstate.png";
var SOURCE_BUTTON_END_DOWN = "/brickbuster/images/button_end_downstate.png";
var SOURCE_BUTTON_END_UP = "/brickbuster/images/button_end_upstate.png";
var SOURCE_BUTTON_INSTRUCTIONS_DOWN = "/brickbuster/images/button_instructions_downstate.png";
var SOURCE_BUTTON_INSTRUCTIONS_UP = "/brickbuster/images/button_instructions_upstate.png";
var SOURCE_BUTTON_PLAYGAME_DOWN = "/brickbuster/images/button_playgame_downstate.png";
var SOURCE_BUTTON_PLAYGAME_UP = "/brickbuster/images/button_playgame_upstate.png";

var GAME_STATE_START = 0;
var GAME_STATE_PLAYING = 1;
var GAME_STATE_END = 2;
var GAME_STATE_INSTRUCTIONS = 3;

var DIRECTION_DOWN = 0;
var DIRECTION_DOWNLEFT = 1;
var DIRECTION_DOWNRIGHT = 2;
var DIRECTION_UP = 3;
var DIRECTION_UPLEFT = 4;
var DIRECTION_UPRIGHT = 5;

var TOTAL_COLS = 9;
var TOTAL_ROWS = 6;
var COL_BUFFER = 4;
var ROW_BUFFER = 16;
var START_ROW = 64;

var ID_BLOCK_NONE = 0;
var ID_BLOCK_RED = 1;
var ID_BLOCK_ORANGE = 2;
var ID_BLOCK_YELLOW = 3;
var ID_BLOCK_GREEN = 4;
var ID_BLOCK_BLUE = 5;
var ID_BLOCK_LIGHT_BLUE = 6;

var X_DYING_VALUE = 21;
var Y_DYING_VALUE = 10;

var BLOCKS_RESET_THRESHOLD = (TOTAL_ROWS * TOTAL_COLS) - 10;; // When there 5 or less blocks lefts have the blocks reset.

var SCORE_MULTIPLIER = 2;

var BALL_STARTING_X = 225;
var BALL_STARTING_Y = 500;
var BALL_STARTING_VELOCITY = 3;
var BALL_VELOCITY_INCREASE_THRESHOLD = 5;
var MAX_BALL_VELOCITY = 8;

var PADDLE_STARTING_X = 225;
var PADDLE_STARTING_Y = 580;
var PADDLE_DECREASE_WIDTH = 10;

var canvas = null;
var context2D = null;

var paddleImage = null;
var paddlePosX = PADDLE_STARTING_X;
var paddlePosY = PADDLE_STARTING_Y;
var paddleVelX = 0;
var maxPaddleVelX = 8;
var minPaddleVelX = -8;
var paddleWidth = 54;
var paddleWidthBlocksDestroyed = 10;

var ballImage = null;
var ballPosX = BALL_STARTING_X;
var ballPosY = BALL_STARTING_Y;
var ballVelX = BALL_STARTING_VELOCITY;
var ballVelY = BALL_STARTING_VELOCITY; // start at 3
var ballIncreaseVelocityInterval = BALL_VELOCITY_INCREASE_THRESHOLD;
var totalBallDirections = 6;
var ballDirection = DIRECTION_UP;

var blocks = null;

var block1Image = null;
var block2Image = null;
var block3Image = null;
var block4Image = null;
var block5Image = null;
var block6Image = null;

var score = 0;
var scoreBlocksDestroyed = 0; // Keeps track of the number of blocks destroyed for each life, used for calculating scores.
var blocksDestroyed = 0; // Keeps track of the number of total blocks destroyed.
var livesLeft = 3;
var gameState = GAME_STATE_START;

var button_Back = null
var button_BackDownStateImage = null;
var button_BackUpStateImage = null;
var button_End = null;
var button_EndDownStateImage = null;
var button_EndUpStateImage = null;
var button_Instructions = null;
var button_InstructionsDownStateImage = null;
var button_InstructionsUpStateImage = null;
var button_PlayGame = null;
var button_PlayGameDownStateImage = null;
var button_PlayGameUpStateImage = null;

var mpressed = false;
var prev_mpressed = false;

var intervalId = -1; // used to control if there is already an interval set or not.

var keys = new Array();

var utilities = gameUtilities();

//window.onload = loadGame;

document.addEventListener('keydown',keyDown,true);
document.addEventListener('keyup',keyUp,true);
function keyDown(evt)
{
	keys[evt.keyCode] = true;
    evt.returnValue = false;
}
function keyUp(evt)
{
	keys[evt.keyCode] = false;
    evt.returnValue = false;
}

window.addEventListener('mousemove', mouseMoved, true);
window.addEventListener('mouseup', clicked, true);
window.addEventListener('mousedown', onMouseDown, true);
var mouseX = 0;
var mouseY = 0;

function mouseMoved(e)
{ 
	if (e.pageX || e.pageY)
	{ 
		mouseX = e.pageX;
		mouseY = e.pageY;
	}
	else
	{ 
		mouseX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
		mouseY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
	} 
	mouseX -= canvas.offsetLeft;
	mouseY -= canvas.offsetTop;
} // end mouseMoved

function onMouseDown(e)
{
	prev_mpressed = mpressed;
	mpressed = true;
} // end onMouseDown

function clicked(e)
{
	prev_mpressed = mpressed;
    mpressed = false;
} // end clicked

function Block(id, x, y, alive, isDying, dyingWidth, dyingHeight)
{
	this.id = id;
	this.x = x;
	this.y = y;
	this.alive = alive;
	this.isDying = isDying;
	this.dyingWidth = dyingWidth;
	this.dyingHeight = dyingHeight;
} // end Object Block

function loadBlocks()
{
	block1Image = new Image();
	block1Image.src = SOURCE_BLOCK1_IMAGE;
	block2Image = new Image();
	block2Image.src = SOURCE_BLOCK2_IMAGE;
	block3Image = new Image();
	block3Image.src = SOURCE_BLOCK3_IMAGE;
	block4Image = new Image();
	block4Image.src = SOURCE_BLOCK4_IMAGE;
	block5Image = new Image();
	block5Image.src = SOURCE_BLOCK5_IMAGE;
	block6Image = new Image();
	block6Image.src = SOURCE_BLOCK6_IMAGE;
	blocks = new Array();
	for (var i = 0; i < TOTAL_ROWS; i++)
	{
		blocks[i] = new Array(TOTAL_COLS);
	}
	
	for (var i = 0; i < TOTAL_ROWS; i++)
	{
		for (var j = 0; j < TOTAL_COLS; j++)
		{
			blocks[i][j] = new Block(0, 0, 0, false, false, block1Image.width, block1Image.height);
			//alert("Block #: "+i+", "+j+", Value: "+blocks[i][j].x);
		}
	} // end initialize all new blocks
	
	resetBlocks();
} // end loadBlocks

function resetBlocks()
{
	for (var i = 0; i < TOTAL_ROWS; i++)
	{
		//blocks[i][0].id = i % TOTAL_ROWS+1;
		//blocks[i][0].x = COL_BUFFER;
	//	blocks[i][0].y = START_ROW + (i*(block1Image.height+ROW_BUFFER));
		for (var j = 0; j < TOTAL_COLS; j++)
		{
			blocks[i][j].id = i % TOTAL_ROWS+1;
			blocks[i][j].x = COL_BUFFER + (j*(block1Image.width+COL_BUFFER));
			blocks[i][j].y = START_ROW + (i*(block1Image.height+ROW_BUFFER));
			blocks[i][j].alive = true;
			blocks[i][j].isDying = false;
			blocks[i][j].dyingWidth = block1Image.width;
			blocks[i][j].dyingHeight = block1Image.height;
		}
	}
} // end resetBlocks

exports.loadGame = function()
{
	canvas = document.getElementById('gameBoard');
	context2D = canvas.getContext('2d');
	
	canvas.setAttribute("style", "background:black;");
	
	paddleImage = new Image();
	paddleImage.src = SOURCE_PADDLE_IMAGE;
	
	ballImage = new Image();
	ballImage.src = SOURCE_BALL_IMAGE;
	
	button_BackDownStateImage = new Image();
	button_BackDownStateImage.src = SOURCE_BUTTON_BACK_DOWN;
	button_BackUpStateImage = new Image();
	button_BackUpStateImage.src = SOURCE_BUTTON_BACK_UP;
	button_EndDownStateImage = new Image();
	button_EndDownStateImage.src = SOURCE_BUTTON_END_DOWN;
	button_EndUpStateImage = new Image();
	button_EndUpStateImage.src = SOURCE_BUTTON_END_UP;
	button_InstructionsDownStateImage = new Image();
	button_InstructionsDownStateImage.src = SOURCE_BUTTON_INSTRUCTIONS_DOWN;
	button_InstructionsUpStateImage = new Image();
	button_InstructionsUpStateImage.src = SOURCE_BUTTON_INSTRUCTIONS_UP;
	button_PlayGameDownStateImage = new Image();
	button_PlayGameDownStateImage.src = SOURCE_BUTTON_PLAYGAME_DOWN;
	button_PlayGameUpStateImage = new Image();
	button_PlayGameUpStateImage.src = SOURCE_BUTTON_PLAYGAME_UP;
	
	button_Back = new Button(50, canvas.height-100, 200, 50, button_BackUpStateImage, button_BackDownStateImage, false, true, STATE_UP);
	button_End = new Button(50, canvas.height-100, 200, 50, button_EndUpStateImage, button_EndDownStateImage, false, true, STATE_UP);
	button_Instructions = new Button(100, 300, 200, 50, button_InstructionsUpStateImage, button_InstructionsDownStateImage, false, true, STATE_UP);
	button_PlayGame = new Button(100, 200, 200, 50, button_PlayGameUpStateImage, button_PlayGameDownStateImage, false, true, STATE_UP);
	
	loadBlocks();
	
	gameState = GAME_STATE_START;
	
	if (intervalId != -1) // This means an interval has been set
		clearInterval(intervalId);
		
	intervalId = setInterval(mainLoop, 1000 / FPS);
} // end loadGame

function mainLoop()
{
	context2D.clearRect(0, 0, canvas.width, canvas.height); // Erase
	getInput(); // Get input
	
	if (gameState == GAME_STATE_START)
	{
		// Update Objects
		button_PlayGame.update(mouseX, mouseY, mpressed, prev_mpressed);
		button_Instructions.update(mouseX, mouseY, mpressed, prev_mpressed);
		if (button_PlayGame.isPressed == true)
		{
			gameState = GAME_STATE_PLAYING;
			button_PlayGame.isPressed = false;
			loadGameValues();
		}
		if (button_Instructions.isPressed == true)
		{
			gameState = GAME_STATE_INSTRUCTIONS;
			button_Instructions.isPressed = false;
		}
		
		// Draw objects
		drawStart();
	} // end game state is start
	
	else if (gameState == GAME_STATE_INSTRUCTIONS)
	{
		button_Back.update(mouseX, mouseY, mpressed, prev_mpressed);
		if (button_Back.isPressed == true)
		{
			gameState = GAME_STATE_START;
			button_Back.isPressed = false;
		}
		// Draw objects
		drawInstructions();
	}
	
	else if (gameState == GAME_STATE_PLAYING)
	{
		// Update objects
		updatePaddle();
		updateBall();
		updateBlocks();
	
		// Draw objects
		drawBlocks();
		drawBall();
		drawPaddle();
		drawHeading();
	} // end if game state is playing
	
	else if (gameState == GAME_STATE_END)
	{
		button_End.update(mouseX, mouseY, mpressed, prev_mpressed);
		if (button_End.isPressed == true)
		{
			gameState = GAME_STATE_START;
			button_End.isPressed = false;
		}
		drawGameEnd();
	} // end game state is game over
} // end mainLoop

function getInput()
{
	if ((37 in keys && keys[37]) || (65 in keys && keys[65])){ //left
		paddleVelX -= 2;
	}
	if ((39 in keys && keys[39]) || (68 in keys && keys[68])){ //right
		paddleVelX += 2;
	}
} // end getInput

function updatePaddle()
{
	// motion can be set using velocity variables
	paddlePosX += paddleVelX;
	
	// stop paddle from building up too much speed
	// this means the paddle can realistically accelerate and continue at normal speed
	if (paddleVelX >= maxPaddleVelX) {
		paddleVelX = maxPaddleVelX;
	} else if (paddleVelX <= minPaddleVelX) {
		paddleVelX = minPaddleVelX;
	}
	
	if (paddlePosX <= 0)
	{
		paddlePosX = 0;
		paddleVelX = 0;
	}
	
	 if (paddlePosX >= canvas.width - paddleWidth)
     {
        paddlePosX = canvas.width - paddleWidth;
		paddleVelX = 0;
	}
} // end updatePaddle

function drawPaddle()
{
	context2D.drawImage(paddleImage, paddlePosX, paddlePosY, paddleWidth, paddleImage.height);
} // end drawPaddle

function collideBlock()
{
	// If the current direction is up, it can move down, down-right, down-left
    if (ballDirection == DIRECTION_UP || ballDirection == DIRECTION_UPLEFT || ballDirection == DIRECTION_UPRIGHT)
	{
		ballDirection = utilities.randomFromTo(DIRECTION_DOWN, DIRECTION_DOWNRIGHT);
	} 
	
	else if (ballDirection == DIRECTION_DOWN || ballDirection == DIRECTION_DOWNLEFT || ballDirection == DIRECTION_DOWNRIGHT)
	{
		ballDirection = utilities.randomFromTo(DIRECTION_UP, DIRECTION_UPRIGHT);
	}
} // end collideBlock


function collideBottom()
{
	ballDirection = utilities.randomFromTo(DIRECTION_UP, DIRECTION_UPRIGHT);
} // end collideBottom

function collideTop()
{
	ballDirection = utilities.randomFromTo(DIRECTION_DOWN, DIRECTION_DOWNRIGHT);
} // end collideTop

function collideLeft()
{
	if (ballDirection == DIRECTION_DOWNLEFT)
		ballDirection = DIRECTION_DOWNRIGHT;
	
	else if (ballDirection == DIRECTION_UPLEFT)
		ballDirection = DIRECTION_UPRIGHT;
	
	else // in case something weird happens
		ballDirection = DIRECTION_UPRIGHT;
} // end collideLeft

function collidePaddle()
{
	if (ballDirection == DIRECTION_DOWN)
	{
		if (paddleVelX > 0) // Paddle moving right
			ballDirection = DIRECTION_UPRIGHT;
		
		else if (paddleVelX < 0) // Paddle moving left
			ballDirection = DIRECTION_UPLEFT;
		
		else // Paddle is not moving
			ballDirection = utilities.randomFromTo(DIRECTION_UP, DIRECTION_UPRIGHT);
			//ballDirection = DIRECTION_UP;
	} // end if ball is moving straight down
	
	else if (ballDirection == DIRECTION_DOWNRIGHT) // Ball is moving diagonally
	{
		if (paddleVelX == 0) // Paddle is not moving
			ballDirection = utilities.randomFromTo(DIRECTION_UP, DIRECTION_UPRIGHT);
			//ballDirection = DIRECTION_UP;
		else
			ballDirection = DIRECTION_UPRIGHT;
	} // end else if ball is moving down and right
	
	else if (ballDirection == DIRECTION_DOWNLEFT) // Ball is moving down and left
	{
		if (paddleVelX == 0) // Paddle is not moving
			ballDirection = utilities.randomFromTo(DIRECTION_UP, DIRECTION_UPRIGHT);
			//ballDirection = DIRECTION_UP;
		else
			ballDirection = DIRECTION_UPLEFT;
	} // end else
	
	else // In case something weird happens
		ballDirection = DIRECTION_UP;
	
	if (blocksDestroyed > BLOCKS_RESET_THRESHOLD)
	{
		resetBlocks();
		paddleWidth = 54
		blocksDestroyed = 0;
		paddleWidthBlocksDestroyed = 10;
	}
} // end collidePaddle

function collideRight()
{
	if (ballDirection == DIRECTION_DOWNRIGHT)
		ballDirection = DIRECTION_DOWNLEFT;
	
	else if (ballDirection == DIRECTION_UPRIGHT)
		ballDirection = DIRECTION_UPLEFT;
	
	else // in case something weird happens
		ballDirection = DIRECTION_UPLEFT;
} // end collideRight

function updateBlocks()
{
	var ballLeft = ballPosX;
	var ballRight = ballPosX + ballImage.width;
	var ballMiddle = ballPosX + (ballImage.width/2);
	var ballTop = ballPosY;
	var ballBottom = ballPosY + ballImage.height;
	
	var wasThereCollision = false;
	
	// Loop through all blocks
	for (var i = 0; i < TOTAL_ROWS; i++)
	{
		for (var j = 0; j < TOTAL_COLS; j++)
		{
			// There can only be a collision if the block is alive
			if (blocks[i][j].alive == true)
			{
				if (blocks[i][j].isDying == false)
				{
					// Detect collision with paddle
					if ((utilities.inside(ballLeft, ballBottom, blocks[i][j].x, blocks[i][j].y, blocks[i][j].x+block1Image.width,blocks[i][j].y+block1Image.height)) || // Bottom Left part of ball
						(utilities.inside(ballMiddle, ballBottom, blocks[i][j].x, blocks[i][j].y, blocks[i][j].x+block1Image.width,blocks[i][j].y+block1Image.height)) || // Bottom middle part of ball
						(utilities.inside(ballRight, ballBottom, blocks[i][j].x, blocks[i][j].y, blocks[i][j].x+block1Image.width,blocks[i][j].y+block1Image.height)) || // Bottom right part of ball
						(utilities.inside(ballLeft, ballTop, blocks[i][j].x, blocks[i][j].y, blocks[i][j].x+block1Image.width,blocks[i][j].y+block1Image.height)) || // Top left part of ball
						(utilities.inside(ballMiddle, ballTop, blocks[i][j].x, blocks[i][j].y, blocks[i][j].x+block1Image.width,blocks[i][j].y+block1Image.height)) || // Top middle part of ball
						(utilities.inside(ballRight, ballTop, blocks[i][j].x, blocks[i][j].y, blocks[i][j].x+block1Image.width,blocks[i][j].y+block1Image.height))) // Top right part of ball
					{
						wasThereCollision = true;
						blocks[i][j].isDying = true;
						blocksDestroyed++;
						scoreBlocksDestroyed++;
						score += SCORE_MULTIPLIER * scoreBlocksDestroyed;
						break;
					}
				} // is block dying
			} // is block alive
		} // end col loop
	} // end row loop
	
	if (wasThereCollision == true)
		collideBlock();
} // end updateBlocks

// move the ball around the screen
function moveBall()
{
    if (ballDirection == DIRECTION_UP)
	{
		ballPosY -= ballVelY;
	}
	else if (ballDirection == DIRECTION_UPLEFT)
	{
		ballPosY -= ballVelY;
		ballPosX -= ballVelX;
	}
	else if (ballDirection == DIRECTION_UPRIGHT)
	{
		ballPosY -= ballVelY;
		ballPosX += ballVelX;
	}
	else if (ballDirection == DIRECTION_DOWN)
	{
		ballPosY += ballVelY;
	}
	else if (ballDirection == DIRECTION_DOWNLEFT)
	{
		ballPosY += ballVelY;
		ballPosX -= ballVelX;
	}
	else if (ballDirection == DIRECTION_DOWNRIGHT)
	{
		ballPosY += ballVelY;
		ballPosX += ballVelX;
	}
} // moveBall

function updateBall()
{
	moveBall();
	
	var ballLeft = ballPosX;
	var ballRight = ballPosX + ballImage.width;
	var ballMiddle = ballPosX + (ballImage.width/2);
	var ballTop = ballPosY;
	var ballBottom = ballPosY + ballImage.height;
	
	// Detect collision with paddle
	if ((utilities.inside(ballLeft, ballBottom, paddlePosX, paddlePosY, paddlePosX+paddleWidth,paddlePosY+paddleImage.height)) || // Bottom Left part of ball
		(utilities.inside(ballMiddle, ballBottom, paddlePosX, paddlePosY, paddlePosX+paddleWidth,paddlePosY+paddleImage.height)) || // Bottom middle part of ball
		(utilities.inside(ballRight, ballBottom, paddlePosX, paddlePosY, paddlePosX+paddleWidth,paddlePosY+paddleImage.height)) || // Bottom right part of ball
		(utilities.inside(ballLeft, ballTop, paddlePosX, paddlePosY, paddlePosX+paddleWidth, paddlePosY+paddleImage.height)) || // Top left part of ball
		(utilities.inside(ballMiddle, ballTop, paddlePosX, paddlePosY, paddlePosX+paddleWidth,paddlePosY+paddleImage.height)) || // Top middle part of ball
		(utilities.inside(ballRight, ballTop, paddlePosX, paddlePosY, paddlePosX+paddleWidth,paddlePosY+paddleImage.height))) // Top right part of ball
	{
	    collidePaddle();
	}
	
	// Detect collisions with boundries
	if (ballPosY <= 38)
	{
	    collideTop();
	}
	
	if (ballPosY >= canvas.height)
	{
		loadNextLife();
	}
	
	if (ballPosX <= 0)
	{
		collideLeft();
	}
	
	if (ballPosX >= canvas.width - ballImage.width)
	{
	    collideRight();
	}
	
	if (blocksDestroyed >= ballIncreaseVelocityInterval)
	{
		ballVelX++;
		ballVelY++;
		
		//if (ballVelX == 5) // shrink paddle once
		//	paddleWidth -= PADDLE_DECREASE_WIDTH;
		//else if (ballVelX == 7) // shrink paddle 2nd time
		//	paddleWidth -= PADDLE_DECREASE_WIDTH;
		
		if (ballVelX > MAX_BALL_VELOCITY)
		{
			ballVelX = MAX_BALL_VELOCITY;
			ballVelY = MAX_BALL_VELOCITY;
		}
		ballIncreaseVelocityInterval += BALL_VELOCITY_INCREASE_THRESHOLD;
	} // end increaseVelocity
	
	if (blocksDestroyed == paddleWidthBlocksDestroyed)
	{
		paddleWidthBlocksDestroyed += 10;
		paddleWidth -= PADDLE_DECREASE_WIDTH;
		
		if (paddleWidth < 34)
			paddleWidth = 34;
	}
	
	//else if (blocksDestroyed == paddleWidthBlocksDestroyed)
//	{
		//paddleWidthBlocksDestroyed += 10;
	//	paddleWidth -= PADDLE_DECREASE_WIDTH;
//	}
} // end updateBall

// Called when the ball falls below the screen, so a life is lost
function loadNextLife()
{
	livesLeft--;
	if (livesLeft <= 0)
		gameState = GAME_STATE_END;
	ballPosX = BALL_STARTING_X;
	ballPosY = BALL_STARTING_Y;
	ballDirection = DIRECTION_UP;
	paddlePosX = PADDLE_STARTING_X;
	paddlePosY = PADDLE_STARTING_Y;
	paddleVelX = 0;
	scoreBlocksDestroyed = 0;
} // end loadNextLife

function loadGameValues()
{
	// Paddle
	paddlePosX = PADDLE_STARTING_X;
	paddlePosY = PADDLE_STARTING_Y;
	paddleVelX = 0;
	paddleWidth = 54;
	paddleWidthBlocksDestroyed = 10;
	
	// Ball
	ballPosX = BALL_STARTING_X;
	ballPosY = BALL_STARTING_Y;
	ballDirection = DIRECTION_UP;
	ballVelX = BALL_STARTING_VELOCITY;
	ballVelY = BALL_STARTING_VELOCITY; // start at 3
	ballIncreaseVelocityInterval = BALL_VELOCITY_INCREASE_THRESHOLD;
	
	// Blocks
	resetBlocks();
	
	score = 0;
	scoreBlocksDestroyed = 0; // Keeps track of the number of blocks destroyed for each life, used for calculating scores.
	blocksDestroyed = 0; // Keeps track of the number of total blocks destroyed.
	livesLeft = 3;
} // end loadGameValues

function drawBall()
{
	context2D.drawImage(ballImage, ballPosX, ballPosY);
} // end drawBall

function drawHeading()
{
	utilities.drawCanvasText(context2D, "Brick Buster", 4, 20, "99ff00", "16px courier new");
	utilities.drawCanvasText(context2D, "Lives: "+livesLeft, 150, 20, "red", "16px courier new");
	utilities.drawCanvasText(context2D, "Score: "+score, 250, 20, "orange", "16px courier new");
	context2D.fillStyle="white";
	context2D.fillRect(4,30,canvas.width-8,4);
} // end drawHeading

function drawStart()
{
	utilities.drawCanvasText(context2D, "Brick Buster", 100, 100, "99ff00", "38px courier new");
	button_PlayGame.draw(context2D);
	button_Instructions.draw(context2D);
} // end drawStart

function drawInstructions()
{
	utilities.drawCanvasText(context2D, "Instructions:", 10, 30, "white", "16px courier new");
	utilities.drawCanvasText(context2D, "Use the left and right arrow keys to move", 12, 60, "99ff00", "16px courier new");
	utilities.drawCanvasText(context2D, "the paddle. Hit the ball with the paddle to", 12, 90, "99ff00", "16px courier new");
	utilities.drawCanvasText(context2D, "break the bricks and collect points. Don't", 12, 120, "99ff00", "16px courier new");
	utilities.drawCanvasText(context2D, "let the ball fall below the paddle. How", 12, 150, "99ff00", "16px courier new");
	utilities.drawCanvasText(context2D, "many points can you earn?", 12, 180, "99ff00", "16px courier new");
	button_Back.draw(context2D);
} // end drawInstructions

function drawGameEnd()
{
	utilities.drawCanvasText(context2D, "Brick Buster", 100, 100, "99ff00", "38px courier new");
	utilities.drawCanvasText(context2D, "Thanks for Playing!", 10, 200, "99ff00", "38px courier new");
	utilities.drawCanvasText(context2D, "Score: "+score, 50, 280, "orange", "28px arial");
	button_End.draw(context2D);
} // end drawGameEnd

function drawBlocks()
{
	for (var i = 0; i < TOTAL_ROWS; i++)
	{
		for (var j = 0; j < TOTAL_COLS; j++)
		{
			if (blocks[i][j].alive == true) // only draw the block if its alive
			{
				if (blocks[i][j].id == ID_BLOCK_RED)
				{
					if (blocks[i][j].isDying == true)
					{
						blocks[i][j].dyingWidth -= X_DYING_VALUE;
						blocks[i][j].dyingHeight -= Y_DYING_VALUE;
						if (blocks[i][j].dyingWidth <= 0)
							blocks[i][j].alive = false;
					}
					context2D.drawImage(block1Image, blocks[i][j].x, blocks[i][j].y, blocks[i][j].dyingWidth, blocks[i][j].dyingHeight);
				} // end is block red
				
				else if (blocks[i][j].id == ID_BLOCK_ORANGE)
				{
					if (blocks[i][j].isDying == true)
					{
						blocks[i][j].dyingWidth -= X_DYING_VALUE;
						blocks[i][j].dyingHeight -= Y_DYING_VALUE;
						if (blocks[i][j].dyingWidth <= 0)
							blocks[i][j].alive = false;
					}
					context2D.drawImage(block2Image, blocks[i][j].x, blocks[i][j].y, blocks[i][j].dyingWidth, blocks[i][j].dyingHeight);
				} // end block is orange
				
				else if (blocks[i][j].id == ID_BLOCK_YELLOW)
				{
					if (blocks[i][j].isDying == true)
					{
						blocks[i][j].dyingWidth -= X_DYING_VALUE;
						blocks[i][j].dyingHeight -= Y_DYING_VALUE;
						if (blocks[i][j].dyingWidth <= 0)
							blocks[i][j].alive = false;
					}
					context2D.drawImage(block3Image, blocks[i][j].x, blocks[i][j].y, blocks[i][j].dyingWidth, blocks[i][j].dyingHeight);
				} // end block is yellow
			
				else if (blocks[i][j].id == ID_BLOCK_GREEN)
				{
					if (blocks[i][j].isDying == true)
					{
						blocks[i][j].dyingWidth -= X_DYING_VALUE;
						blocks[i][j].dyingHeight -= Y_DYING_VALUE;
						if (blocks[i][j].dyingWidth <= 0)
							blocks[i][j].alive = false;
					}
					context2D.drawImage(block4Image, blocks[i][j].x, blocks[i][j].y, blocks[i][j].dyingWidth, blocks[i][j].dyingHeight);
				} // end block is green
				
				else if (blocks[i][j].id == ID_BLOCK_BLUE)
				{
					if (blocks[i][j].isDying == true)
					{
						blocks[i][j].dyingWidth -= X_DYING_VALUE;
						blocks[i][j].dyingHeight -= Y_DYING_VALUE;
						if (blocks[i][j].dyingWidth <= 0)
							blocks[i][j].alive = false;
					}
					context2D.drawImage(block5Image, blocks[i][j].x, blocks[i][j].y, blocks[i][j].dyingWidth, blocks[i][j].dyingHeight);
				} // end is block blue
			
				else if (blocks[i][j].id == ID_BLOCK_LIGHT_BLUE)
				{
					if (blocks[i][j].isDying == true)
					{
						blocks[i][j].dyingWidth -= X_DYING_VALUE;
						blocks[i][j].dyingHeight -= Y_DYING_VALUE;
						if (blocks[i][j].dyingWidth <= 0)
							blocks[i][j].alive = false;
					}
					context2D.drawImage(block6Image, blocks[i][j].x, blocks[i][j].y, blocks[i][j].dyingWidth, blocks[i][j].dyingHeight);
				}
			} // end block is alive check
		} // end col loop
	} // end rows loop
} // end drawBlocks
exports.getScore = function() { return score; }
exports.title = "Brick Buster";
return exports;
}