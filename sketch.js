var gameChar_x;
var gameChar_y;
var floorPos_y;
var cameraPosX;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isJumping;

var canyons;
var collectables;

var trees_x;
var treePos_y;
var clouds;
var mountains;

var score;
var flagpole;
var lives;

var jump;

function setup() {
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 3;
    startGame();
    jump = loadSound('assets/jump.wav');
}

function preload() {
    //soundFormats('mp3', 'wav');
    // load the collectable image
    img = loadImage('candy.png');
}

function draw() {
    // update the camera position so the character is always centered
    cameraPosX =  gameChar_x - width/2;
 
    drawBackground();
    
    if(lives < 1) {
        fill('rgba(0,0,0,0.7)');
        rect(0, 0, 1024, 576);
        fill(255, 0, 0);
        textSize(50);
        textAlign(CENTER, CENTER);
        text("Game over. Press space to continue.", width/2, height/2);
        return;
    } 
    
    if(flagpole.isReached) {
        fill('rgba(0,0,0,0.7)');
        rect(0, 0, 1024, 576);
        fill(0, 255, 0);
        textSize(50);
        textAlign(CENTER, CENTER);
        text("Level complete. Press space to continue.", width/2, height/2);
        return;
    }

    push(); 
    translate(-cameraPosX, 0);

    drawClouds();
    drawMountains();
    drawTrees();
    renderFlagpole();
    
    for(i=0; i<canyons.length; i++) {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    for(i=0; i<collectables.length; i++) {
        if(!collectables[i].isFound){
            drawCollectable(collectables[i]); 
            checkCollectable(collectables[i]);  
        }
    }

    if(!flagpole.isReached) {
        checkFlagpole();
    }
    
	// CHARACTER
	if(isLeft && isFalling) {
        // jumping left
        drawCharacterJumpingLeft();
	} else if(isRight && isFalling) {
        // jumping right
        drawCharacterJumpingRight();
	} else if(isLeft) {
        // walking left
        drawCharacterWalkingLeft();
	} else if(isRight) {
        // walking right
        drawCharacterWalkingRight();
	} else if(isFalling || isPlummeting) {
        // jumping facing forward
        drawCharacterJumpingForward();
	} else {
        // standing facing forward
        drawCharacterStandingForward();
	}

    pop();
    
    drawScore();
    drawLives();
    checkPlayerDie();

	// CHARACTER MOVEMENT
    if(isRight && gameChar_x+5 < 1024) {
        // character moves to the right if they didnt reach the end of the canvas
        gameChar_x += 5; 
    }
    if(isLeft && gameChar_x-5 > 0) {
        // character moves to the left if they didnt reach the end of the canvas
        gameChar_x -= 5; 
    }
    if(isFalling) {
        // handle character falling
        if(gameChar_y + 10 < floorPos_y) {
            gameChar_y = gameChar_y + 2 ;
        } else {
            gameChar_y = floorPos_y;
            isFalling = false;
        }
        isJumping = false;
    }
    if(isJumping && gameChar_y == floorPos_y) {
        gameChar_y = floorPos_y - 100;
        isFalling = true;
    } 

}

function keyPressed() {   
    //control the character when certain keys are pressed
    if((keyCode == 39 || keyCode == 68) && !isPlummeting) 
    {
        // character goes left
        isRight = true;
    }

    if((keyCode == 37 || keyCode == 65) && !isPlummeting) 
    {
        // character goes right
        isLeft = true;
    }

    if((keyCode == 38 || keyCode == 87 || keyCode == 32)  && !isPlummeting) 
    {
        // character is jumping
        if (!jump?.isPlaying()) {
            jump.play();
        }
        isJumping = true;
    } 
    
    if(keyCode == 32) 
    {
        if(lives < 1 || flagpole.isReached) {
            lives = 3;
            flagpole.isReached = false;
            startGame();
        }
    } 
}

function keyReleased() {
    // START - CODE IMPLEMENTED WITHOUT ASSISTANCE 
    //control the character when certain keys are released
    if(keyCode == 39 || keyCode == 68) 
    {
        // stop moving to the right
        isRight = false;
    }
    
    if(keyCode == 37 || keyCode == 65) 
    {
        // stop moving to the left
        isLeft = false;
    }  
    
    if((keyCode == 38 || keyCode == 87 || keyCode == 32)  && !isPlummeting) 
    {
        if (jump?.isPlaying()) {
            jump.stop();
        }
    }
}

function star(x, y, radius1, radius2, npoints) {
    //draws the magic wand star
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
    }
    endShape(CLOSE);
}

function drawBackground() {
    background(232, 230, 255); 
	noStroke();
	fill(181, 230, 158);
	rect(0, floorPos_y, width, height - floorPos_y); 
}

function drawClouds() {
    for(i = 0; i < clouds.length; i++) {
        // draw cloud groups and one of these groups will contain a sun as well
        // cloud 1
        fill((230, 230, 230));
        ellipse(clouds[i].x_pos + 65, clouds[i].y_pos + 50, clouds[i].width, clouds[i].width);
        ellipse(clouds[i].x_pos + 35, clouds[i].y_pos + 50, clouds[i].width + 20, clouds[i].width + 20);
        ellipse(clouds[i].x_pos + 5, clouds[i].y_pos + 60, clouds[i].width, clouds[i].width);
        fill(255);
        ellipse(clouds[i].x_pos + 60, clouds[i].y_pos + 55, clouds[i].width, clouds[i].width);
        ellipse(clouds[i].x_pos + 30, clouds[i].y_pos + 55, clouds[i].width + 20, clouds[i].width + 20);
        ellipse(clouds[i].x_pos + 5, clouds[i].y_pos + 65, clouds[i].width, clouds[i].width);
        // cloud 2
        fill((230, 230, 230));
        ellipse(clouds[i].x_pos + 165, clouds[i].y_pos, clouds[i].width, clouds[i].width);
        ellipse(clouds[i].x_pos + 135, clouds[i].y_pos, clouds[i].width + 20, clouds[i].width + 20);
        ellipse(clouds[i].x_pos + 105, clouds[i].y_pos + 10, clouds[i].width, clouds[i].width);
        fill(255);
        ellipse(clouds[i].x_pos + 160, clouds[i].y_pos + 5, clouds[i].width, clouds[i].width);
        ellipse(clouds[i].x_pos + 130, clouds[i].y_pos + 5, clouds[i].width + 20, clouds[i].width + 20);
        ellipse(clouds[i].x_pos + 100, clouds[i].y_pos + 15, clouds[i].width, clouds[i].width);
        // cloud 3
        fill(230, 230, 230);
        ellipse(clouds[i].x_pos + 265, clouds[i].y_pos + 50, clouds[i].width, clouds[i].width);
        ellipse(clouds[i].x_pos + 235, clouds[i].y_pos + 50, clouds[i].width + 20, clouds[i].width + 20);
        ellipse(clouds[i].x_pos + 195, clouds[i].y_pos + 60, clouds[i].width, clouds[i].width);
        fill(255);
        ellipse(clouds[i].x_pos + 260, clouds[i].y_pos + 55, clouds[i].width, clouds[i].width);
        ellipse(clouds[i].x_pos + 230, clouds[i].y_pos + 55, clouds[i].width + 20, clouds[i].width + 20);
        ellipse(clouds[i].x_pos + 200, clouds[i].y_pos + 65, clouds[i].width, clouds[i].width);
        if(i == 3){
            // don't render too many suns
            //sun
            fill(253, 222, 101);
            ellipse(clouds[i].x_pos + 135, clouds[i].y_pos + 100, 80, 80);
            fill(253, 255, 156);
            ellipse(clouds[i].x_pos + 130, clouds[i].y_pos + 105, 80, 80);
        }
    }
}

function drawMountains() {
    for(i = 0; i < mountains.length; i++) {
        fill(75, 188, 188);
        triangle(mountains[i].x_pos, mountains[i].y_pos + 132, mountains[i].x_pos + 200, mountains[i].y_pos + 132, mountains[i].x_pos + 100, mountains[i].y_pos - 50);
        fill(255);
        triangle(mountains[i].x_pos + 72, mountains[i].y_pos, mountains[i].x_pos + 128, mountains[i].y_pos, mountains[i].x_pos + 100, mountains[i].y_pos - 50);
        triangle(mountains[i].x_pos + 72, mountains[i].y_pos, mountains[i].x_pos + 128, mountains[i].y_pos, mountains[i].x_pos + 100, mountains[i].y_pos + 30);
        triangle(mountains[i].x_pos + 72, mountains[i].y_pos, mountains[i].x_pos + 98, mountains[i].y_pos, mountains[i].x_pos + 56, mountains[i].y_pos+ 30);
        fill(3, 212, 213);
        triangle(mountains[i].x_pos + 140, mountains[i].y_pos + 132, mountains[i].x_pos + 240, mountains[i].y_pos + 132, mountains[i].x_pos + 190, mountains[i].y_pos + 50);
        fill(255);
        triangle(mountains[i].x_pos + 209, mountains[i].y_pos + 80, mountains[i].x_pos + 165, mountains[i].y_pos + 90, mountains[i].x_pos + 190, mountains[i].y_pos + 50);
        triangle(mountains[i].x_pos + 215, mountains[i].y_pos + 90, mountains[i].x_pos + 172, mountains[i].y_pos + 80, mountains[i].x_pos + 190, mountains[i].y_pos + 50);

    }
}

function drawTrees() {
    for(i = 0; i < trees_x.length; i++) {
        // tree trunk
        fill(93, 59, 48);
        rect(trees_x[i], treePos_y, 50, 180);
        triangle(trees_x[i]-10, treePos_y+180, trees_x[i], treePos_y+180, trees_x[i], treePos_y+164);
        triangle(trees_x[i]+60, treePos_y+180, trees_x[i]+50, treePos_y+180, trees_x[i]+50, treePos_y+164);
        triangle(trees_x[i]+25, treePos_y+194, trees_x[i], treePos_y+164, trees_x[i]+50, treePos_y+164);
        // tree leaves
        fill(193, 102, 175);
        ellipse(trees_x[i]+25, treePos_y+10, 120, 120);
        ellipse(trees_x[i]+80, treePos_y-10, 120, 120);
        ellipse(trees_x[i]+80, treePos_y-60, 120, 120);
        ellipse(trees_x[i]+25, treePos_y-96, 120, 120);
        ellipse(trees_x[i]-40, treePos_y-10, 120, 120);
        ellipse(trees_x[i]-40, treePos_y-60, 120, 120);
    }
}

function drawCharacterStandingForward() {
    fill(255,204,204);
    ellipse(gameChar_x-5, gameChar_y-10, 5, 20);
    ellipse(gameChar_x+5, gameChar_y-10, 5, 20);
    //arms
    ellipse(gameChar_x-15, gameChar_y-25, 15, 5);
    ellipse(gameChar_x+15, gameChar_y-25, 15, 5);
    //magic wand
    fill(161,101,32);
    rect(gameChar_x-20, gameChar_y-45, 2, 30)
    fill(235, 235, 0);
    star(gameChar_x-20, gameChar_y-45, 3, 7, 5);
    //shoes
    fill(221,26,126);
    ellipse(gameChar_x-5, gameChar_y-2, 7, 7);
    ellipse(gameChar_x+5, gameChar_y-2, 7, 7);
    //clothes
    fill(221,26,126);
    triangle(gameChar_x, gameChar_y-45, gameChar_x-15, gameChar_y-10, gameChar_x+15, gameChar_y-10);
    //face
    fill(255,204,204);
    ellipse(gameChar_x, gameChar_y-40, 25, 25);
    //hat
    fill(221,26,126);
    triangle(gameChar_x, gameChar_y-60, gameChar_x-13, gameChar_y-45, gameChar_x+13, gameChar_y-45);
    //eyes
    fill(0);
    ellipse(gameChar_x-5, gameChar_y-40, 5, 5);
    ellipse(gameChar_x+5, gameChar_y-40, 5, 5);
    //mouth
    fill(255, 0, 0);
    ellipse(gameChar_x, gameChar_y-33, 10, 1);
}

function drawCharacterJumpingLeft() {
    //shoes
    fill(221,26,126);
    ellipse(gameChar_x, gameChar_y-7, 7, 7);
    //clothes
    fill(221,26,126);
    triangle(gameChar_x, gameChar_y-45, gameChar_x-15, gameChar_y-10, gameChar_x+15, gameChar_y-10);
    //arms
    fill(255,204,204);
    ellipse(gameChar_x-5, gameChar_y-20, 15, 5);
    //face
    fill(255,204,204);
    ellipse(gameChar_x, gameChar_y-40, 25, 25);
    //hat
    fill(221,26,126);
    triangle(gameChar_x, gameChar_y-60, gameChar_x-13, gameChar_y-45, gameChar_x+13, gameChar_y-45);
    //eyes
    fill(0);
    ellipse(gameChar_x-5, gameChar_y-40, 5, 5);
    //mouth
    fill(255, 0, 0);
    ellipse(gameChar_x-5, gameChar_y-33, 10, 1);
}

function drawCharacterJumpingRight() {
    //shoes
    fill(221,26,126);
    ellipse(gameChar_x, gameChar_y-7, 7, 7);
    //clothes
    fill(221,26,126);
    triangle(gameChar_x, gameChar_y-45, gameChar_x-15, gameChar_y-10, gameChar_x+15, gameChar_y-10);
    //arms
    fill(255,204,204);
    ellipse(gameChar_x+5, gameChar_y-20, 15, 5);
    //face
    fill(255,204,204);
    ellipse(gameChar_x, gameChar_y-40, 25, 25);
    //hat
    fill(221,26,126);
    triangle(gameChar_x, gameChar_y-60, gameChar_x-13, gameChar_y-45, gameChar_x+13, gameChar_y-45);
    //eyes
    fill(0);
    ellipse(gameChar_x+5, gameChar_y-40, 5, 5);
    //mouth
    fill(255, 0, 0);
    ellipse(gameChar_x+5, gameChar_y-33, 10, 1);
}

function drawCharacterWalkingLeft() {
    //legs
    fill(255,204,204);
    ellipse(gameChar_x, gameChar_y-10, 5, 20);
    //shoes
    fill(221,26,126);
    ellipse(gameChar_x, gameChar_y-2, 7, 7);
    //clothes
    fill(221,26,126);
    triangle(gameChar_x, gameChar_y-45, gameChar_x-15, gameChar_y-10, gameChar_x+15, gameChar_y-10);
    //arms
    fill(255,204,204);
    ellipse(gameChar_x, gameChar_y-20, 5, 15);
    //face
    fill(255,204,204);
    ellipse(gameChar_x, gameChar_y-40, 25, 25);
    //hat
    fill(221,26,126);
    triangle(gameChar_x, gameChar_y-60, gameChar_x-13, gameChar_y-45, gameChar_x+13, gameChar_y-45);
    //eyes
    fill(0);
    ellipse(gameChar_x-5, gameChar_y-40, 5, 5);
    //mouth
    fill(255, 0, 0);
    ellipse(gameChar_x-5, gameChar_y-33, 10, 1);
    //magic wand
    fill(161,101,32);
    rect(gameChar_x-20, gameChar_y-20, 30, 2)
    fill(235, 235, 0);
    star(gameChar_x-20, gameChar_y-20, 3, 7, 5);
}

function drawCharacterWalkingRight() {
    //legs
    fill(255,204,204);
    ellipse(gameChar_x, gameChar_y-10, 5, 20);
    //shoes
    fill(221,26,126);
    ellipse(gameChar_x, gameChar_y-2, 7, 7);
    //clothes
    fill(221,26,126);
    triangle(gameChar_x, gameChar_y-45, gameChar_x-15, gameChar_y-10, gameChar_x+15, gameChar_y-10);
    //arms
    fill(255,204,204);
    ellipse(gameChar_x, gameChar_y-20, 5, 15);
    //face
    fill(255,204,204);
    ellipse(gameChar_x, gameChar_y-40, 25, 25);
    //hat
    fill(221,26,126);
    triangle(gameChar_x, gameChar_y-60, gameChar_x-13, gameChar_y-45, gameChar_x+13, gameChar_y-45);
    //eyes
    fill(0);
    ellipse(gameChar_x+5, gameChar_y-40, 5, 5);
    //mouth
    fill(255, 0, 0);
    ellipse(gameChar_x+5, gameChar_y-33, 10, 1);
    //magic wand
    fill(161,101,32);
    rect(gameChar_x-10, gameChar_y-20, 30, 2)
    fill(235, 235, 0);
    star(gameChar_x+20, gameChar_y-20, 3, 7, 5);
}

function drawCharacterJumpingForward() {
    //legs
    fill(255,204,204);
    //ellipse(gameChar_x-5, gameChar_y-10, 5, 20);
    //ellipse(gameChar_x+5, gameChar_y-10, 5, 20);
    //arms
    ellipse(gameChar_x-15, gameChar_y-25, 15, 5);
    ellipse(gameChar_x+15, gameChar_y-25, 15, 5);
    //magic wand
    fill(161,101,32);
    rect(gameChar_x-20, gameChar_y-45, 2, 30)
    fill(235, 235, 0);
    star(gameChar_x-20, gameChar_y-45, 3, 7, 5);
    //shoes
    fill(221,26,126);
    ellipse(gameChar_x-5, gameChar_y-7, 7, 7);
    ellipse(gameChar_x+5, gameChar_y-7, 7, 7);
    //clothes
    fill(221,26,126);
    triangle(gameChar_x, gameChar_y-45, gameChar_x-15, gameChar_y-10, gameChar_x+15, gameChar_y-10);
    //face
    fill(255,204,204);
    ellipse(gameChar_x, gameChar_y-40, 25, 25);
    //hat
    fill(221,26,126);
    triangle(gameChar_x, gameChar_y-60, gameChar_x-13, gameChar_y-45, gameChar_x+13, gameChar_y-45);
    //eyes
    fill(0);
    ellipse(gameChar_x-5, gameChar_y-40, 5, 5);
    ellipse(gameChar_x+5, gameChar_y-40, 5, 5);
    //mouth
    fill(255, 0, 0);
    ellipse(gameChar_x, gameChar_y-33, 10, 1);
}

function drawCollectable(t_collectable){
    if(t_collectable.isFound == false){
        image(img, t_collectable.x_pos, t_collectable.y_pos, t_collectable.size, t_collectable.size);
    }
}

function drawCanyon(t_canyon) {
    fill(0);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, height - floorPos_y, 40);
    fill(209, 99, 76);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, 90, 40);
    fill(184, 99, 76);
    rect(t_canyon.x_pos + 10, floorPos_y + 10, t_canyon.width - 20, 70, 40);
    fill(141, 67, 40);
    rect(t_canyon.x_pos + 20, floorPos_y + 20, t_canyon.width - 40, 50, 40);
}

function checkCollectable(t_collectable) {
    if(dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos+30) < 20) {
        // handle character finding collectable
        t_collectable.isFound = true;
        score += 1;
    }
}

function checkCanyon(t_canyon) {
    if(!isFalling && (gameChar_x > t_canyon.x_pos + 10 && gameChar_x < t_canyon.x_pos + t_canyon.width - 10)){
    // handle character falling down the canyon
    isPlummeting = true;
    if(gameChar_y < 680)
        gameChar_y = gameChar_y + 10 ;
    }  
}

function drawScore(){
    fill(0);
    textSize(20);
    textAlign(LEFT, BOTTOM)
    text("Score: " + score, 10, 30)
}

function renderFlagpole() {
    if(flagpole.isReached) {
        fill(0);
        rect(flagpole.x_pos, floorPos_y - 200, 10, 200);
        fill(255, 0, 0);
        triangle(flagpole.x_pos, floorPos_y - 200, flagpole.x_pos, floorPos_y - 150, flagpole.x_pos + 50, floorPos_y - 170);
    } else {
        fill(0);
        rect(flagpole.x_pos, floorPos_y - 200, 10, 200)
            fill(255, 0, 0);
        triangle(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 50, flagpole.x_pos + 50, floorPos_y - 30);
    }
}

function checkFlagpole(){
    var d = dist(gameChar_x, gameChar_y, flagpole.x_pos, floorPos_y);

    if(abs(d) <=15) {
        flagpole.isReached = true;
    }
}

function checkPlayerDie() {
    if(gameChar_y > 576) {
        lives -= 1;
        if(lives > 0) {
            startGame();
        }
    }
}

function startGame() {
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    cameraPosX = 0;
    
    // initialise the character's states
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    isJumping = false;
    
    // initialise the interactables
    canyons = [
        {
            x_pos: 200, 
            width: 150,
        },
        {
            x_pos: 600, 
            width: 150,
        },
        
    ]
    collectables = [
        {
            x_pos: 50, 
            y_pos: floorPos_y - 30, 
            size: 40,
            isFound: false,
        },
        {
            x_pos: 170, 
            y_pos: floorPos_y - 30, 
            size: 40,
            isFound: false,
        },
            {
            x_pos: 400, 
            y_pos: floorPos_y - 30, 
            size: 40,
            isFound: false,
        },
    ]
    score = 0;
    flagpole = {
        x_pos: 900, 
        isReached: false,
    };

    
    // initialise the scenery
    trees_x = [-500, -200, 100, 400, 700, 1000, 1300, 1600];
    treePos_y = height/2 - 20;
    clouds = [
        {
            x_pos: -680, 
            y_pos: 50,
            width: 40,
        },
        {
            x_pos: -320, 
            y_pos: 60,
            width: 40,
        },
        {
            x_pos: 40, 
            y_pos: 50,
            width: 40,
        },
        {
            x_pos: 400, 
            y_pos: 60,
            width: 40,
        },
        {
            x_pos: 760, 
            y_pos: 60,
            width: 40,
        },
        {
            x_pos: 1120, 
            y_pos: 60,
            width: 40,
        },
        {
            x_pos: 1480, 
            y_pos: 60,
            width: 40,
        },
    ];
    mountains = [
        {
            x_pos: -450, 
            y_pos: 300,
            width: 200,
        },
        {
            x_pos: -150, 
            y_pos: 300,
            width: 200,
        },
        {
            x_pos: 150, 
            y_pos: 300,
            width: 200,
        },
        
        {
            x_pos: 450, 
            y_pos: 300,
            width: 200,
        },
        
        {
            x_pos: 750, 
            y_pos: 300,
            width: 200,
        },
        {
            x_pos: 1050, 
            y_pos: 300,
            width: 200,
        },
        {
            x_pos: 1350, 
            y_pos: 300,
            width: 200,
        },
    ];
}

function drawLives() {
    for(i=0; i<3; i++) {
        if(i < lives) {
            fill(255, 0, 0);
        } else {
            fill(180);
        }
        
        heart(22 + i * 30, 50, 20);
    }
}

function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}
