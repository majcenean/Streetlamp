/*************************************************************************
 Setup
          by Maj Jenkins
    Date XX, 20XX

    Overview:
    
    ---------------------------------------------------------------------
    Notes: 
     (1) 
**************************************************************************/


/*************************************************************************
// Global variables
**************************************************************************/

// Style (Fonts, colors)


// Images


// Sounds


// Buttons and timers



/*************************************************************************
// Window resize
**************************************************************************/

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/*************************************************************************
// Function preload
**************************************************************************/
function preload() {
  // Fonts

  // Images

  // Music and Sounds

}

/*************************************************************************
// Function setup
**************************************************************************/

function setup() {
  createCanvas(windowWidth, windowHeight);
 }

/*************************************************************************
// Function draw
**************************************************************************/

function draw() {



  // fsMessage();
}


/*************************************************************************
// Fullscreen function
**************************************************************************/

// Fullscreen message
function fsMessage() {
  // if (fs === true) {
      push();
      fill(255);
      noStroke();
      textSize(width/60);
      textAlign(LEFT);
      text("Press [F] for fullscreen", 0 + width/100 , height - height/100)
      pop();
    // }
}

// keyTyped for debugMode and fullscreen
function keyTyped() {
  if (key === 'f') {
    let fs = fullscreen();
    fullscreen(!fs);
  }
 }