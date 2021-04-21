/*************************************************************************
 ART385 Project 2
          by Maj Jenkins
    April 20, 2021

    Overview:
    Streetlamp is a game which satirizes Orientalist tendencies in physical and fictional environments. By exploring anti-Asian racism within visual and storytelling mediums that bleeds into the real world, it calls attention to the fetishization and sexualization Asian women suffer, in addition to criticizing tired racist tropes and stereotypes which are commonplace in Western media. 
    
    ---------------------------------------------------------------------
    Notes: 
     (1) Don't sprint while exiting rooms, or you might end up a few states outside. If you go too fast, it might lag in loading the collisions and glitch out. Also, at times the collision CSVs don't load -- in this case, clear your browser cache and refresh the page!
     (2) There currently aren't special splash screens for the ending states, but they could easily be done with more time (just swap out instructions.PNG for the new artwork in the adventureStates CSV.)
     (3) Try and visit all NPCs :) There is a "place of interest" (i.e., a building with an NPC to visit) in each "zone".
**************************************************************************/


/*************************************************************************
// Global variables
**************************************************************************/
// Adventure manager global  
var adventureManager;

// Scene_W and Scene_H
var SCENE_W = 1366;
var SCENE_H = 786;

// Playersprite
var playerSprite;
var playerAnimation;
var playerSpriteW = 25;
var playerSpriteH = 40;

// PlayerSprite Controls
var speedleft = 0;
var speedright = 0;
var speedup = 0;
var speeddown = 0;
var facing = 1;
var facingupdown = 1;
var isidle = 0;
var stamina = 200;

// NPCS
var npcW = 25;
var npcH = 40;

// NPC Dialogue
var spokeToUpstart = false;

// Dialogue Clickables
const SalaryJoinButton = 10;
const SalaryAttackButton = 11;
const SalaryPowerButton = 12;
const AuntiesButton = 13;
const UpstartButton = 14;
const BoatButton = 15;

// Enemies and Combat
var enemies = [];
var enemyDialogue = [];

var enemyDialogueTimer;
var enemyDialogueDuration;
var enemyDialogueVisible = false;
var enemyDialogueChoice;
var enemySpeakingChoice = 0;
var enemyDialogueLastNumber = 9;

var enemyDamageTimer;
var playerLives = 3;
var potsticker = false;
var upstartFavor = false;

// Dialogue
var talkBubble;
var dialogueVisible = false;
var dialogueX = 1366/2 - 900/2;
var dialogueY = 768 - 300 - 50;
var currentDialogue = 'dialogue';
var currentDialogueName = 'name';

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// Indexes into the clickable array (constants)
const playGameIndex = 0;

// Colors
var hexRed = [];
hexRed[0] = '#98201B';
hexRed[1] = '#AD4D49';
hexRed[2] = '#721814';

var hexGreen = [];
hexGreen[0] = '#458C6F';
hexGreen[1] = '#6AA38C';
hexGreen[2] = '#346953';

var hexGold = [];
hexGold[0] = '#F4A93D';
hexGold[1] = '#F6BA64';
hexGold[2] = '#B77F2E';

var hexTurquoise = [];
hexTurquoise[0] = '#53E0BF';
hexTurquoise[1] = '#75E6CC';
hexTurquoise[2] = '#3EA88F';

var hexDark = [];
hexDark[0] = '#222222';
hexDark[1] = '#4E4E4E';
hexDark[2] = '#1A1A1A';
hexDark[3] = '#FDF1E0';

// Fonts
var fontChanga;
var fontChangaBold;
var fontCairo;

// Sounds
var clickL;
var clickH;
var vib;

// Lives
var life_img;
var potsticker_img;
var power_img;


/*************************************************************************
// Function preload
**************************************************************************/
// Allocate Adventure Manager with states table and interaction tables
function preload() {
	// Clickables and Adventure
	clickablesManager = new ClickableManager('data/clickableLayout.csv');
	adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');

	// Fonts
	fontChanga = loadFont('font/Changa.otf');
	fontCairo = loadFont('font/Cairo.otf');
  fontChangaBold = loadFont('font/Changa_ExtraBold.otf');

	// Music and Sounds
	clickL = loadSound('sfx/click_low.mp3');
	clickH = loadSound('sfx/click_high.mp3');
  vib = loadSound('sfx/vib.mp3');

  // Images
  talkBubble = loadImage('assets/dialogue/box.png');
  talkBubbleDynamic = loadImage('assets/dialogue/dialoguebox.png');
  life_img = loadImage('assets/objects/life.png');
  potsticker_img = loadImage('assets/objects/potsticker.png');
  power_img = loadImage('assets/objects/power.png');

  // Dialogue
  enemyDialogue[0] = 'Hey, pretty lady.';
  enemyDialogue[1] = 'Wanna be my China doll?';
  enemyDialogue[2] = 'Ni hao...';
  enemyDialogue[3] = 'Me so horny...';
  enemyDialogue[4] = 'Me love you long time.';
  enemyDialogue[5] = 'Come over here...';
  enemyDialogue[6] = 'Let me touch you.';
  enemyDialogue[7] = 'What’s your Chinese name?';
  enemyDialogue[8] = 'You look exotic.';
  enemyDialogue[9] = 'I love Asian women.';

  // Pause between enemy dialogue
  enemyDialogueTimer = new Timer(7000);
  enemyDialogueTimer.start();

  // Dialogue stays up for 4.5 seconds
  enemyDialogueDuration = new Timer(4500);

  // How often can the player take damage from enemy sprites
  enemyDamageTimer = new Timer(5000);
}

/*************************************************************************
// Function setup
**************************************************************************/
function setup() {
    createCanvas(1366, 768);

    // Style  ----------------------------------
    textSize(25);
    textFont(fontCairo);
    fill(hexDark[0]);

    // Clickables  ----------------------------------
    // setup the clickables = this will allocate the array
    clickables = clickablesManager.setup();

    // Sprites  ----------------------------------
    // Player Sprite
    playerSprite = createSprite(970, 300, playerSpriteW, playerSpriteH);
    var playerSpriteMove = playerSprite.addAnimation('idle_f',
    'assets/avatars/idle_f_1.png', 'assets/avatars/idle_f_2.png', 'assets/avatars/idle_f_3.png', 'assets/avatars/idle_f_2.png', 'assets/avatars/idle_f_1.png');
    playerSprite.addAnimation('moving', 'assets/avatars/walk_1.png', 'assets/avatars/walk_2.png', 'assets/avatars/walk_3.png', 'assets/avatars/walk_4.png', 'assets/avatars/walk_5.png', 'assets/avatars/walk_6.png','assets/avatars/walk_7.png', 'assets/avatars/walk_8.png',);
    playerSprite.addAnimation('idle_b',
    'assets/avatars/idle_b_1.png', 'assets/avatars/idle_b_2.png', 'assets/avatars/idle_b_3.png', 'assets/avatars/idle_b_2.png', 'assets/avatars/idle_b_1.png');
    playerSprite.addAnimation('idle_f_large',
    'assets/avatars/large/idle_f_1.png', 'assets/avatars/large/idle_f_2.png', 'assets/avatars/large/idle_f_3.png', 'assets/avatars/large/idle_f_2.png', 'assets/avatars/large/idle_f_1.png');
    playerSprite.addAnimation('moving_large', 'assets/avatars/large/walk_1.png', 'assets/avatars/large/walk_2.png', 'assets/avatars/large/walk_3.png', 'assets/avatars/large/walk_4.png', 'assets/avatars/large/walk_5.png', 'assets/avatars/large/walk_6.png','assets/avatars/large/walk_7.png', 'assets/avatars/large/walk_8.png',);
    playerSprite.addAnimation('idle_b_large',
    'assets/avatars/large/idle_b_1.png', 'assets/avatars/large/idle_b_2.png', 'assets/avatars/large/idle_b_3.png', 'assets/avatars/large/idle_b_2.png', 'assets/avatars/large/idle_b_1.png');

    // Enemy Sprite
    creepSprite1 = createSprite(playerSprite.position.x + 200, 545, playerSpriteW, playerSpriteH);
    creepSprite1.addAnimation('brunet',  loadAnimation('assets/NPCs/creep_b_1.png', 'assets/NPCs/creep_b_2.png', 'assets/NPCs/creep_b_3.png', 'assets/NPCs/creep_b_4.png', 'assets/NPCs/creep_b_5.png'));

    creepSprite2 = createSprite(playerSprite.position.x + 250, 545, playerSpriteW, playerSpriteH);
    creepSprite2.addAnimation('blond',  loadAnimation('assets/NPCs/creep_y_1.png', 'assets/NPCs/creep_y_2.png', 'assets/NPCs/creep_y_3.png', 'assets/NPCs/creep_y_4.png', 'assets/NPCs/creep_y_5.png'));

    enemies[0] = creepSprite1;
    enemies[1] = creepSprite2;

    // Building Overlays
    // Zone 1
    buildingZ1a1Sprite = createSprite(776, 890 - 518/2, 281, 518);
    buildingZ1a1Sprite.addAnimation('regular',  loadAnimation('assets/buildings/house_z1a.png'));
    buildingZ1b1Sprite = createSprite(495.3005, 890 - 518/2, 281, 518);
    buildingZ1b1Sprite.addAnimation('regular',  loadAnimation('assets/buildings/house_z1b.png'));
    buildingZ1b2Sprite = createSprite(1040.5561, 890 - 518/2, 281, 518);
    buildingZ1b2Sprite.addAnimation('regular',  loadAnimation('assets/buildings/house_z1b.png'));
    // Zone 2
    buildingZ2a1Sprite = createSprite(348.8876, 768 - 379/2, 281, 379);
    buildingZ2a1Sprite.addAnimation('regular',  loadAnimation('assets/buildings/house_zone3a.png'));
    buildingZ2b1Sprite = createSprite(602.0319, 768 - 379/2, 281, 379);
    buildingZ2b1Sprite.addAnimation('regular',  loadAnimation('assets/buildings/house_zone3b.png'));
    buildingZ2a2Sprite = createSprite(847.1555, 768 - 379/2, 281, 379);
    buildingZ2a2Sprite.addAnimation('regular',  loadAnimation('assets/buildings/house_zone3a.png'));

    // Adventure Manager  ----------------------------------
    // Use this to track movement from room to room in adventureManager.draw()
    adventureManager.setPlayerSprite(playerSprite);

    // This is optional, but will manage turning visibility of buttons on/off based on the state name in the clickableLayout
    adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
    adventureManager.setup();

    // changedState is the name of a callback function
    adventureManager.setChangedStateCallback(changedState);

    // Call our function to setup additional information about the p5.clickables that are not in the array 
    setupClickables(); 
}

/*************************************************************************
// Function draw
**************************************************************************/
function draw() {
    // Draws background rooms and handles movement from one to another
    adventureManager.draw();

    // Draw the p5.clickables, in front of the mazes but behind the sprites 
    clickablesManager.draw();

    // Sets Scene_W and Scene_H (asked for in adventure manager in constrainSpriteBounds();)
    setScene();

    // No avatar shows up on Splash screen or Instructions screen
    if( adventureManager.getStateName() !== "Splash" && 
        adventureManager.getStateName() !== "Instructions" &&
        adventureManager.getStateName() !== "About" &&
        adventureManager.getStateName() !== "CreepDeath" &&
        adventureManager.getStateName() !== "BrothelJoin" &&
        adventureManager.getStateName() !== "UpstartJoin" &&
        adventureManager.getStateName() !== "SalaryJoin" &&
        adventureManager.getStateName() !== "SalaryVictory" &&
        adventureManager.getStateName() !== "SalaryDeath"  ) {
        
      // Sprites
      // Player sprite responds to key commands
      moveSprite();

      // Draw how many lives the player has left
      drawPlayerLives();

      // Debug to see player position
      // showPlayerPos();

      // Draw player sprite
      drawSprite(playerSprite);

      // Draw enemy NPCs
      if( adventureManager.getStateName() !== "Splash" && 
              adventureManager.getStateName() !== "Instructions" &&
              adventureManager.getStateName() !== "About" &&
              adventureManager.getStateName() !== "House" && 
              adventureManager.getStateName() !== "Restaurant" &&
              adventureManager.getStateName() !== "Upstart" &&
              adventureManager.getStateName() !== "Brothel" &&
              adventureManager.getStateName() !== "Skyscraper" &&
              adventureManager.getStateName() !== "CreepDeath" &&
              adventureManager.getStateName() !== "BrothelJoin"  &&
              adventureManager.getStateName() !== "UpstartJoin"  &&
              adventureManager.getStateName() !== "SalaryJoin"  &&
              adventureManager.getStateName() !== "SalaryVictory"  &&
              adventureManager.getStateName() !== "SalaryDeath"  ) {
        
        for (i=0; i <= 1; i++) {
          setEnemySprite(enemies[i]);
        }

      // draw enemy dialogue based upon which enemy is chosen to speak by the timer
        if (enemySpeakingChoice === 0) {
          if (enemyDialogueVisible === true) {
            drawEnemyTextBubble(creepSprite1);
          }
        }
        else if (enemySpeakingChoice === 1) {
          if (enemyDialogueVisible === true) {
            drawEnemyTextBubble(creepSprite2);
          }
        }
      }

      drawHouseOverlay();

      // Draw dialogue over everything else
      drawDialogueBox();
  }

  frameRate(47);

  updateEnemyDialogueTimer();
}

function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }
  // Debug teleport
  // if( key === 'y') {
  //   adventureManager.changeState("Brothel");
  // }

  // Dispatch key events for adventure manager to move from state to state or do special actions
  // This can be disabled for NPC conversations or text entry   
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

// Called every time a state is changed
function changedState(currentStateStr, newStateStr) {
  // Moves the playerSprite based on room exit & entry
  if (currentStateStr === 'House' && newStateStr === 'Map12') {
    movePlayerSprite(800, 545);
  }
  else if (currentStateStr === 'Map12' && newStateStr === 'House') {
    movePlayerSprite(327.6839, 719.1834);
    playerFaceUp();
  }
  else if (currentStateStr === 'Restaurant' && newStateStr === 'Map11') {
    movePlayerSprite(730, 545);
  }
  else if (currentStateStr === 'Map11' && newStateStr === 'Restaurant') {
    movePlayerSprite(683, 689.428);
    playerFaceUp();
  }
  else if (currentStateStr === 'Map7' && newStateStr === 'Upstart') {
    movePlayerSprite(998.2419, 710.0504);
  }
  else if (currentStateStr === 'Upstart' && newStateStr === 'Map7') {
    movePlayerSprite(595, 545);
    playerFaceUp();
  }
  else if (currentStateStr === 'Map3' && newStateStr === 'Brothel') {
    movePlayerSprite(SCENE_W/2, SCENE_H*2 - 200);
    playerFaceUp();
  }
  else if (currentStateStr === 'Brothel' && newStateStr === 'Map3') {
    movePlayerSprite(560, 740);
  }
  else if (currentStateStr === 'Skyscraper' && newStateStr === 'Map1') {
    movePlayerSprite(706.9506, 739.6697);
  }
  else if (currentStateStr === 'Map1' && newStateStr === 'Skyscraper') {
    movePlayerSprite(683, 689.428);
    playerFaceUp();
  }
}

function playerFaceUp() {
    playerSprite.changeAnimation('idle_b_large');
    isidle = 0;
    facingupdown = 0;
}

/*************************************************************************
// Sprites
**************************************************************************/
function showPlayerPos() {
  push();
  fill(255);
  text(playerSprite.position.x, 20, 40);
  text(playerSprite.position.y, 20, 70);
  pop();
}

function playerAnimationSizeTest(x, y) {
    if( adventureManager.getStateName() === "House" || 
        adventureManager.getStateName() === "Restaurant" ||
        adventureManager.getStateName() === "Upstart" ||
        adventureManager.getStateName() === "Brothel" ||
        adventureManager.getStateName() === "Skyscraper") {
      playerSprite.changeAnimation(x);
    }
    else {
      playerSprite.changeAnimation(y);
    }
}

function moveSprite() {
  playerSprite.maxSpeed = 10;
  //control playerSprite with WASD
  //left with A
  if (keyIsDown(65)) {
    playerAnimationSizeTest('moving_large', 'moving');
    playerSprite.mirrorX(-1);
    playerSprite.velocity.x = -4 + speedleft;
    facing = -1;
    isidle = 1;
  }
  //right with D
  else if (keyIsDown(68)) {
    playerAnimationSizeTest('moving_large', 'moving');
    playerSprite.mirrorX(1);
    playerSprite.velocity.x = 4 + speedright;
    facing = 1;
    isidle = 1;
  }
  //down with S
  else if (keyIsDown(83)) {
    playerAnimationSizeTest('moving_large', 'moving');
    playerSprite.velocity.y = 4 + speeddown;
    isidle = 1;
    facingupdown = 1;
  }
  //up with W
  else if (keyIsDown(87)) {
    playerAnimationSizeTest('moving_large', 'moving');
    playerSprite.velocity.y = -4 + speedup;
    isidle = 1;
    facingupdown = 0;
  } 
  else if (facingupdown === 0) {
    playerAnimationSizeTest('idle_b_large', 'idle_b');
    playerSprite.velocity.x = 0;
    playerSprite.velocity.y = 0;
    isidle = 0;
  }
  else if (facingupdown === 1) {
    playerAnimationSizeTest('idle_f_large', 'idle_f');
    playerSprite.velocity.x = 0;
    playerSprite.velocity.y = 0;
    isidle = 0;
  }

  // spacebar to use power
  if ((keyIsDown(32)) && (stamina >= 0))  {
    fill(hexGold[0]);
    ellipse(playerSprite.position.x, playerSprite.position.y, 20, 20);
    stamina -= 10;
    playerSprite.velocity.x = 0;
    playerSprite.velocity.y = 0;
    speedleft = 0;
    speedright = 0;
    speedup = 0;
    speeddown = 0;
  }

  //accelerate with shift
  if ((keyIsDown(16)) && (keyIsDown(65)) && (stamina >= 0)) {
    speedleft -= 0.1;
    stamina -= 2.5;
  } 
  else if ((keyIsDown(16)) && (keyIsDown(68)) && (stamina >= 0)) {
    speedright += 0.1;
    stamina -= 2.5;
  } 
  else if ((keyIsDown(16)) && (keyIsDown(83)) && (stamina >= 0)) {
    speeddown += 0.1;
    stamina -= 2.5;
  }
  else if ((keyIsDown(16)) && (keyIsDown(87)) && (stamina >= 0)) {
    speedup -= 0.1;
    stamina -= 2.5;
  }
  else {
    speedleft = 0;
    speedright = 0;
    speedup = 0;
    speeddown = 0;
    stamina += 2;
  }

  //keep stamina within 0 to 200 points
  if (stamina >= 200) {
    stamina = 200;
  }
  if (stamina <= 0) {
    stamina = 0;
  }

  //if stamina runs out, cannot run anymore
  if (stamina == 0) {
    playerSprite.velocity.x = 0;
    playerSprite.velocity.y = 0;
    speedleft = 0;
    speedright = 0;
    speedup = 0;
    speeddown = 0;
  }

  //trapping the main sprite inside the screen width/height
  // if (playerSprite.position.x < 0 + playerSpriteW - playerSpriteW/2)
  //   playerSprite.position.x = 0 + playerSpriteW - playerSpriteW/2;
  // if (playerSprite.position.y < 0 + playerSpriteH/2)
  //   playerSprite.position.y = 0 + playerSpriteH/2;
  // if (playerSprite.position.x > width - playerSpriteW + playerSpriteW/2)
  //   playerSprite.position.x = width - playerSpriteW + playerSpriteW/2;
  // if (playerSprite.position.y > height - playerSpriteH/2)
  //   playerSprite.position.y = height - playerSpriteH/2;


  if( adventureManager.getStateName() !== "House" && 
          adventureManager.getStateName() !== "Restaurant" &&
          adventureManager.getStateName() !== "Upstart" &&
          adventureManager.getStateName() !== "Brothel" &&
          adventureManager.getStateName() !== "Skyscraper") {
    drawPlayerShadow();
  }

  // if the shift key is down AND stamina is less than 180 pts; then draw the stamina bar above head of playerSprite
  if ((keyIsDown(16)) && (stamina <= 190)) {
    // draw the stamina bar
    drawStamina();
  } else if (stamina <= 180) {
    drawStamina();
  }
}

function drawPlayerShadow() {
  //shadow underneath the main sprite
  push();
  noStroke();
  fill(25, 25, 25, 70);
  ellipse(playerSprite.position.x, playerSprite.position.y + playerSpriteH*1.5, playerSpriteW+playerSpriteW/3, playerSpriteH/6);
  pop();
  // little ellipse to see better
  push();
  fill('#ffffff10');
  noStroke();
  ellipse(playerSprite.position.x, playerSprite.position.y, 200, 200);
  pop();
}

function drawStamina() {
  if( adventureManager.getStateName() !== "House" && 
      adventureManager.getStateName() !== "Restaurant" &&
      adventureManager.getStateName() !== "Upstart" &&
      adventureManager.getStateName() !== "Brothel" &&
      adventureManager.getStateName() !== "Skyscraper" ) {
    push();
    rectMode(CORNER);
    noStroke();
    fill(hexDark[1]);
    rect(playerSprite.position.x - playerSpriteW, 
      playerSprite.position.y - playerSpriteH - 50, 210/3, 15);
    fill(hexTurquoise[0]);
    rect(playerSprite.position.x + 15/4 - playerSpriteW, playerSprite.position.y + 15/4 - playerSpriteH - 50, stamina/3, 7.5);
    pop();
  }
}

function movePlayerSprite(x, y) {
  playerSprite.position.x = x;
  playerSprite.position.y = y;
}

function setScene() {
  if( adventureManager.getStateName() === "Brothel") {
    SCENE_W = width;
    SCENE_H = height*2;
  }
  else {
    SCENE_W = width;
    SCENE_H = height;
  }

}
/*************************************************************************
// Enemy NPCs
**************************************************************************/
function setEnemySprite(spritename) {
  // Set attraction point
  spritename.attractionPoint(0.2, playerSprite.position.x, playerSprite.position.y);
  spritename.maxSpeed = 2;

  // Same y-value as player
  // spritename.position.y = playerSprite.position.y;

  // Set animation flipping
  if(playerSprite.position.x < spritename.position.x - 10) {
    spritename.mirrorX(1);
  } 
  else if(playerSprite.position.x > spritename.position.x - 10) {
    spritename.mirrorX(-1);
  }

  // Set collisions with one another (so do not overlap)
  spritename.bounce(creepSprite1);
  spritename.bounce(creepSprite2);

  // When the enemy sprite catches up with the player
  if (playerSprite.overlap(this.creepSprite1)) {
    drawEnemyTouched();
  }
  if (playerSprite.overlap(this.creepSprite2)) {
    drawEnemyTouched();
  }

  // Draw Sprite
  drawSprite(spritename);
}

function drawEnemyTextBubble(spritename) {
  let x = spritename.position.x - spritename.width;
  let y = spritename.position.y - spritename.height - 5;

  image(talkBubbleDynamic, x, y);
  push();
  fill(0);
  textAlign(CENTER);
  textSize(16);
  text(enemyDialogue[enemyDialogueChoice], x + talkBubbleDynamic.width/2, y + talkBubbleDynamic.height/2);
  pop();
}

function updateEnemyDialogueTimer() {
  // bigger timer
  if(enemyDialogueTimer.expired() ) {
    // choose dialogue from array
    enemyDialogueChoice = round(random(0, enemyDialogueLastNumber));

    // choose which enemy will speak
    enemySpeakingChoice = round(random(0, 1));
    // print(enemySpeakingChoice);

    // start the smaller timer
    enemyDialogueDuration.start();
  }

  // smaller timer
  if(enemyDialogueDuration.expired() === false) {
    enemyDialogueVisible = true;

    // reset the bigger timer
    enemyDialogueTimer.start();
  } 
  else {
    enemyDialogueVisible = false;
  }
}

function drawEnemyTouched() {
  if(enemyDamageTimer.expired() ) {

    if (playerLives >= 1) {
      playerLives = playerLives - 1;
      // print('yeouch');
      vib.play();
      playerSprite.changeAnimation('idle_f');
      playerSprite.velocity.x = 0;
      playerSprite.velocity.y = 0;
      isidle = 0;
      facingupdown = 1;
      playerSprite.position.x = playerSprite.position.x + round(random(10, 40));
    } 
    else if (playerLives === 0) {
      // print('you died');
      vib.play();
      adventureManager.changeState("CreepDeath");
      movePlayerSprite(970, 300);
    }

    enemyDamageTimer.start();
  }
}

/*************************************************************************
// Dialogue and Overlay
**************************************************************************/
function drawHouseOverlay() {
  if( adventureManager.getStateName() === "Map12") {
    drawSprite(buildingZ1a1Sprite);
    drawSprite(buildingZ1b1Sprite);
    drawSprite(buildingZ1b2Sprite);
  }
  if( adventureManager.getStateName() === "Map11") {
    drawSprite(buildingZ1a1Sprite);
    drawSprite(buildingZ1b1Sprite);
  }
  if( adventureManager.getStateName() === "Map10" || 
    adventureManager.getStateName() === "Map7" ) {
    drawSprite(buildingZ2a1Sprite);
    drawSprite(buildingZ2b1Sprite);
    drawSprite(buildingZ2a2Sprite);
  }
}

function drawDialogueBox() {
  // Account for camera
  if( adventureManager.getStateName() === "Brothel") {
    dialogueX = camera.position.x - 900/2;
    dialogueY = camera.position.y;
  }
  else {
    dialogueX = 1366/2 - 900/2;
    dialogueY = 768 - 300 - 50;
  }

  if (dialogueVisible === true) {
    image(talkBubble, dialogueX, dialogueY);
    drawDialogueText();
  }
}

function drawDialogueText() {
  // Dialogue Name
  push();
  textSize(30);
  textFont(fontChangaBold);
  fill(hexGold[1]);
  text(currentDialogueName, dialogueX + 100, dialogueY + 70);
  pop();
  // Dialogue
  push();
  textSize(20);
  textFont(fontCairo);
  fill(hexDark[3]);
  text(currentDialogue, dialogueX + 100, dialogueY + 80, 650, 180);
  pop();
 }

 function drawDialogueButtons(index, state) {
  // for( let i = x; i <= y; i++ ) {
  //   clickables[i].visible = state;
  // }
  clickables[index].visible = state;
}

// Draws "Press E to enter" text when close to a building
 function drawEnterText() {
    push();
    textAlign(CENTER);
    textFont(fontChangaBold);
    fill(hexDark[3]);
    stroke(hexDark[0]);
    strokeWeight(3);
    textSize(22);
    if( adventureManager.getStateName() === "Brothel") {
        text('Press [E] to exit', playerSprite.position.x, playerSprite.position.y - playerSpriteH - 100);
    }
    else {
        text('Press [E] to enter', playerSprite.position.x, playerSprite.position.y - playerSpriteH - 50);
    }
    pop();
}

function drawPlayerLives() {
  // Defining variables
  let wh = 45;
  let offset = 60;

  // Account for camera
  if( adventureManager.getStateName() === "Brothel") {
      var LivesX = camera.position.x - width/2 + 40;
      var LivesY = camera.position.y - height/2 + 40;
  }
  else {
      LivesX = 40;
      LivesY = 40;
  }

  // Draw how many lives depending on amount of lives
  if (playerLives === 3) {
    image(life_img, LivesX + offset*2, LivesY, wh, wh);
    image(life_img, LivesX + offset, LivesY, wh, wh);
    image(life_img, LivesX, LivesY, wh, wh);
  }
  else if (playerLives === 2) {
    image(life_img, LivesX + offset, LivesY, wh, wh);
    image(life_img, LivesX, LivesY, wh, wh);
  }
  else if (playerLives === 1) {
    image(life_img, LivesX, LivesY, wh, wh);
  }

  // check for potsticker
  if (potsticker === true) {
    image(potsticker_img, LivesX, LivesY + offset);
  }

  // check for power
  if (upstartFavor === true) {
    image(power_img, LivesX + offset*3, LivesY);
  }
}

/*************************************************************************
// Clickables
**************************************************************************/
function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onPress = clickableButtonPressed;
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
  }
}

clickableButtonHover = function () {
  this.color = hexTurquoise[1];
  this.noTint = false;
  this.tint = null;
  this.textSize = 28;
}

clickableButtonOnOutside = function () {
  this.color = hexTurquoise[2];
  this.stroke = hexDark[3];
  this.strokeWeight = 1;
  this.textColor = hexDark[3];
  this.textSize = 24;
  this.textFont = fontChanga;
  this.cornerRadius = 15;
  this.textY = -5;
}

clickableButtonPressed = function() {
  // Sound (before anything is called)
  clickH.play();

  // These clickables are ones that change the state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name);
}

/*************************************************************************
// Subclasses
**************************************************************************/
class InstructionsScreen extends PNGRoom {
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4; 

    // Hard-coded, but this could be loaded from a file if we wanted to be more elegant
    this.instructionsTitle = "••• CONTENT WARNING •••"
    this.instructionsText = "This game experience involves the following:\n\n\n• Violence, blood, and gore\n• Death of family members\n• Sexual harassment and racial fetishization\n• References to sex work and prostitution\n• Body image and mentions of weight\n• Bright colors which may cause eyestrain";
    this.offsetY = 40;
  }

  draw() {
    // tint down background image so text is more readable
    tint(128);
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text
    fill(hexDark[3]);
    textAlign(LEFT);
    textSize(26);
    text(this.instructionsText, width/4, height/6 + this.offsetY, this.textBoxWidth, this.textBoxHeight);

    // title
    textAlign(CENTER);
    textSize(34);
    text(this.instructionsTitle, width/6, height/6 - this.offsetY, this.textBoxWidth, this.textBoxHeight);
  }
}

class AboutScreen extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*5.5; 

    this.aboutText = "Streetlamp is a game which satirizes Orientalist tendencies in physical and fictional environments. By exploring anti-Asian racism within visual and storytelling mediums that bleeds into the real world, it calls attention to the fetishization and sexualization Asian women suffer, in addition to criticizing tired racist tropes and stereotypes which are commonplace in Western media.\n\n\nThe game derives its name from two components: firstly, the 'sexy lamp' trope in which female characters are reduced to being sex objects as functional as lamps, and secondly, the design of the Dragon Street Lamp by W. D’Arcy Ryan (1925) in San Francisco's Chinatown, representative of Chinatown's larger Orientalist design direction developed in the 20th century, which still to this day draws tourists to gawk at and admire foreign lands which only exist in their imagination."
  }

  draw() {
    tint(128);
    super.draw();
    
    fill(hexDark[3]);
    textAlign(LEFT);
    textSize(24);

    text(this.aboutText, width/6, height/6, this.textBoxWidth, this.textBoxHeight);
  }
}

// Map Rooms
class Map1Room extends PNGRoom {
  preload() {
      // skyscraper
      this.drawskyscraperX = 598.4133;
      this.drawskyscraperY = 715.7191 - 1106/2;
      this.skyscraperSprite = createSprite( this.drawskyscraperX, this.drawskyscraperY, 984, 1106);
      this.skyscraperSprite.addAnimation('regular',  loadAnimation('assets/buildings/skyscraper.png'));
      this.skyscraperSpriteCollide = createSprite(this.drawskyscraperX, 718, 100, 20);
  }

  draw() {
    super.draw();
    drawSprite(this.skyscraperSprite);

    if (playerSprite.overlap(this.skyscraperSpriteCollide)) {
      drawEnterText();
    }

    if (playerSprite.overlap(this.skyscraperSpriteCollide) && keyIsDown(69)) {
      this.enter();
    }
  }

  enter() {
    adventureManager.changeState("Skyscraper");
  }
}

class Map2Room extends PNGRoom {
  preload() {
      // Building
      this.buildingSprite1 = createSprite(549.7986, 766.307 - 518/2, 281, 518);
      this.buildingSprite1.addAnimation('regular',  loadAnimation('assets/buildings/house_z3a.png'));

      // Building
      this.buildingSprite2 = createSprite(823.5, 766.307 - 518/2, 281, 518);
      this.buildingSprite2.addAnimation('regular',  loadAnimation('assets/buildings/house_z3b.png'));

      // Building
      this.buildingSprite3 = createSprite(1236.6555, 715.7191 - 518/2, 281, 518);
      this.buildingSprite3.addAnimation('regular',  loadAnimation('assets/buildings/house_z3a.png'));

      // Building
      this.buildingSprite4 = createSprite(533.6186, 263.1022  - 518/2, 281, 518);
      this.buildingSprite4.addAnimation('regular',  loadAnimation('assets/buildings/house_z3b.png'));

      // Building
      this.buildingSprite5 = createSprite(846.9781, 263.1022  - 518/2, 281, 518);
      this.buildingSprite5.addAnimation('regular',  loadAnimation('assets/buildings/house_z3a.png'));

      // Building
      this.buildingSprite6 = createSprite(1199.6404, 263.1022  - 518/2, 281, 518);
      this.buildingSprite6.addAnimation('regular',  loadAnimation('assets/buildings/house_z3b.png'));

      // Building
      this.buildingSprite7 = createSprite(151, 264.1022  - 518/2, 281, 518);
      this.buildingSprite7.addAnimation('regular',  loadAnimation('assets/buildings/house_z4.png'));

      // Building
      this.buildingSprite8 = createSprite(151, 715.7191 - 518/2, 281, 518);
      this.buildingSprite8.addAnimation('regular',  loadAnimation('assets/buildings/house_z4.png'));


      // Lamp
      this.lampSprite = createSprite(1066.8971, 715.7191 - 478/2, 113, 478);
      this.lampSprite.addAnimation('regular',  loadAnimation('assets/objects/lamp_1.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_4.png','assets/objects/lamp_5.png', 'assets/objects/lamp_4.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_1.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.buildingSprite7);
    drawSprite(this.buildingSprite8);
    drawSprite(this.buildingSprite4);
    drawSprite(this.buildingSprite5);
    drawSprite(this.buildingSprite6);
    drawSprite(this.buildingSprite1);
    drawSprite(this.buildingSprite2);
    drawSprite(this.buildingSprite3);
    drawSprite(this.lampSprite);
  }
}

class Map3Room extends PNGRoom {
  preload() {
      // Brothel
      this.drawBrothelX = 769.6831;
      this.drawBrothelY = 715.7191 - 711.6169/2;
      this.brothelSprite = createSprite( this.drawBrothelX, this.drawBrothelY, 715.7066, 711.6169);
      this.brothelSprite.addAnimation('regular',  loadAnimation('assets/buildings/brothel.png'));
      this.brothelSpriteCollide = createSprite(this.drawBrothelX, 718, 100, 20);

      // Building
      this.buildingSprite1 = createSprite(159.9326, 715.7191 - 518/2, 281, 518);
      this.buildingSprite1.addAnimation('regular',  loadAnimation('assets/buildings/house_z3b.png'));

      // Building
      this.buildingSprite2 = createSprite(191.4927, 263.1022  - 518/2, 281, 518);
      this.buildingSprite2.addAnimation('regular',  loadAnimation('assets/buildings/house_z3a.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.buildingSprite2);
    drawSprite(this.brothelSprite);
    drawSprite(this.buildingSprite1);

    if (playerSprite.overlap(this.brothelSpriteCollide)) {
      drawEnterText();
    }

    if (playerSprite.overlap(this.brothelSpriteCollide) && keyIsDown(69)) {
      this.enter();
    }
  }

  enter() {
    adventureManager.changeState("Brothel");
  }
}

class Map4Room extends PNGRoom {
  preload() {
      // Building
      this.buildingSprite1 = createSprite(422.6685, 518.307 - 520/2, 281, 520);
      this.buildingSprite1.addAnimation('regular',  loadAnimation('assets/buildings/house_z4.png'));

      // Building
      this.buildingSprite2 = createSprite(787.0674, 518.307 - 520/2, 281, 520);
      this.buildingSprite2.addAnimation('regular',  loadAnimation('assets/buildings/house_z4.png'));

      // Lamp
      this.lampSprite = createSprite(609.3596, 518.3077 - 478/2, 113, 478);
      this.lampSprite.addAnimation('regular',  loadAnimation('assets/objects/lamp_1.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_4.png','assets/objects/lamp_5.png', 'assets/objects/lamp_4.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_1.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.buildingSprite1);
    drawSprite(this.buildingSprite2);
    drawSprite(this.lampSprite);
  }
}

class Map5Room extends PNGRoom {
  preload() {
      // Building
      this.buildingSprite1 = createSprite(1199.6404, 517.307 - 518/2, 281, 518);
      this.buildingSprite1.addAnimation('regular',  loadAnimation('assets/buildings/house_z3b.png'));

      // Advertisement
      this.adSprite = createSprite(785.4409, 518 - 331/2, 253, 331);
      this.adSprite.addAnimation('regular',  loadAnimation('assets/buildings/ad_small.png'));

      // Lamp
      this.lampSprite = createSprite(488.9944, 518.3077 - 478/2, 113, 478);
      this.lampSprite.addAnimation('regular',  loadAnimation('assets/objects/lamp_1.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_4.png','assets/objects/lamp_5.png', 'assets/objects/lamp_4.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_1.png'));

      // Building
      this.buildingSprite2 = createSprite(518.4409, 176.4973 - 518/2, 281, 518);
      this.buildingSprite2.addAnimation('regular',  loadAnimation('assets/buildings/house_z3a.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.buildingSprite2);
    drawSprite(this.adSprite);
    drawSprite(this.buildingSprite1);
    drawSprite(this.lampSprite);
  }
}

class Map6Room extends PNGRoom {
  preload() {
      // Building
      this.buildingSprite1 = createSprite(593.4045, 518.307 - 518/2, 281, 518);
      this.buildingSprite1.addAnimation('regular',  loadAnimation('assets/buildings/house_z3a.png'));

            // Building
      this.buildingSprite2 = createSprite(919.1573, 518.307 - 518/2, 281, 518);
      this.buildingSprite2.addAnimation('regular',  loadAnimation('assets/buildings/house_z3b.png'));

      // Lamp
      this.lampSprite = createSprite(187.4409 , 518.3077 - 478/2, 113, 478);
      this.lampSprite.addAnimation('regular',  loadAnimation('assets/objects/lamp_1.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_4.png','assets/objects/lamp_5.png', 'assets/objects/lamp_4.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_1.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.buildingSprite1);
    drawSprite(this.buildingSprite2);
    drawSprite(this.lampSprite);
  }
}

class Map7Room extends PNGRoom {
  preload() {
      this.drawUpstartHouseX = 598.4133;
      this.drawUpstartHouseY = 518.3071 - 379/2;
      this.upstartHouse = createSprite( this.drawUpstartHouseX, this.drawUpstartHouseY, 281, 379);
      this.upstartHouse.addAnimation('regular',  loadAnimation('assets/buildings/upstart.png'));
      this.upstartHouseSpriteCollide = createSprite(this.drawUpstartHouseX, 520, 100, 20);
  }

  draw() {
    super.draw();
    drawSprite(this.upstartHouse);
    if (playerSprite.overlap(this.upstartHouseSpriteCollide)) {
      drawEnterText();
    }
    if (playerSprite.overlap(this.upstartHouseSpriteCollide) && keyIsDown(69)) {
      this.enter();
    }
  }

  enter() {
    adventureManager.changeState("Upstart");
  }
}

class Map8Room extends PNGRoom {
  preload() {
      // Building
      this.buildingSprite1 = createSprite(1199.6404, 517.307 - 518/2, 281, 518);
      this.buildingSprite1.addAnimation('regular',  loadAnimation('assets/buildings/house_z3a.png'));

      // Advertisement
      this.adSprite = createSprite(769.9944, 515.807 - 515/2, 372, 515);
      this.adSprite.addAnimation('regular',  loadAnimation('assets/buildings/ad_1.png', 'assets/buildings/ad_2.png', 'assets/buildings/ad_3.png'));

      // Lamp
      this.lampSprite = createSprite(488.9944, 518.3077 - 478/2, 113, 478);
      this.lampSprite.addAnimation('regular',  loadAnimation('assets/objects/lamp_1.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_4.png','assets/objects/lamp_5.png', 'assets/objects/lamp_4.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_1.png'));

      // Building
      this.buildingSprite2 = createSprite(518.4409, 176.4973 - 518/2, 281, 518);
      this.buildingSprite2.addAnimation('regular',  loadAnimation('assets/buildings/house_z3b.png'));

  }

  draw() {
    super.draw();
    drawSprite(this.buildingSprite2);
    drawSprite(this.adSprite);
    drawSprite(this.buildingSprite1);
    drawSprite(this.lampSprite);
  }
}

class Map9Room extends PNGRoom {
  preload() {
      // Building
      this.buildingSprite1 = createSprite(174.8876, 517.307 - 518/2, 281, 518);
      this.buildingSprite1.addAnimation('regular',  loadAnimation('assets/buildings/house_z3a.png'));

      // Advertisement
      this.adSprite = createSprite(769.9944, 515.807 - 515/2, 372, 515);
      this.adSprite.addAnimation('regular',  loadAnimation('assets/buildings/ad_medium.png'));

      // Lamp
      this.lampSprite = createSprite(488.9944, 518.3077 - 478/2, 113, 478);
      this.lampSprite.addAnimation('regular',  loadAnimation('assets/objects/lamp_1.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_4.png','assets/objects/lamp_5.png', 'assets/objects/lamp_4.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_1.png'));

      // Building
      this.buildingSprite2 = createSprite(518.4409, 176.4973 - 518/2, 281, 518);
      this.buildingSprite2.addAnimation('regular',  loadAnimation('assets/buildings/house_z3b.png'));

  }

  draw() {
    super.draw();
    drawSprite(this.buildingSprite2);
    drawSprite(this.adSprite);
    drawSprite(this.buildingSprite1);
    drawSprite(this.lampSprite);
  }
}

class Map10Room extends PNGRoom {
  preload() {
      this.drawUpstartHouseX = 598.4133;
      this.drawUpstartHouseY = 518.3071 - 379/2;

      this.house1 = createSprite( this.drawUpstartHouseX - 200, this.drawUpstartHouseY, 281, 379);
      this.house1.addAnimation('regular',  loadAnimation('assets/buildings/house_zone3a.png'));
      this.house2 = createSprite( this.drawUpstartHouseX + 200, this.drawUpstartHouseY, 281, 379);
      this.house2.addAnimation('regular',  loadAnimation('assets/buildings/house_zone3b.png'));

      this.house3 = createSprite(793.2472, 177.9021 - 379/2, 281, 379);
      this.house3.addAnimation('regular',  loadAnimation('assets/buildings/house_zone3b.png'));
      this.house4 = createSprite(457.9133, 177.9021 - 379/2, 281, 379);
      this.house4.addAnimation('regular',  loadAnimation('assets/buildings/house_zone3a.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.house1);
    drawSprite(this.house2);
    drawSprite(this.house3);
    drawSprite(this.house4);
  }

}

class Map11Room extends PNGRoom {
  preload() {
      // Restaurant
      this.drawRestaurantX = 683;
      this.drawRestaurantY = 518.3071 - 379/2;
      this.restaurantSprite = createSprite( this.drawRestaurantX, this.drawRestaurantY, 555, 379);
      this.restaurantSprite.addAnimation('regular',  loadAnimation('assets/buildings/restaurant.png'));
      this.restaurantSpriteCollide = createSprite(this.drawRestaurantX, 520, 100, 20);

      // Lamps
      this.lampSprite1 = createSprite(300, 520 - 478/2, 113, 478);
      this.lampSprite1.addAnimation('regular',  loadAnimation('assets/objects/lamp_1.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_4.png','assets/objects/lamp_5.png', 'assets/objects/lamp_4.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_1.png'));

      this.lampSprite2 = createSprite(1060, 520 - 478/2, 113, 478);
      this.lampSprite2.addAnimation('regular',  loadAnimation('assets/objects/lamp_1.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_4.png','assets/objects/lamp_5.png', 'assets/objects/lamp_4.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_1.png'));

      // Other houses
      this.houseSpriteA = createSprite(1229.6404, 518.3071 - 479/2, 228, 479);
      this.houseSpriteA.addAnimation('regular',  loadAnimation('assets/buildings/house_z1a.png'));
      this.houseSpriteB = createSprite(149.4053,  518.3071 - 479/2, 228, 479);
      this.houseSpriteB.addAnimation('regular',  loadAnimation('assets/buildings/house_z1b.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.restaurantSprite);
    drawSprite(this.houseSpriteA);
    drawSprite(this.houseSpriteB);
    drawSprite(this.lampSprite1);
    drawSprite(this.lampSprite2);

    if (playerSprite.overlap(this.restaurantSpriteCollide)) {
      drawEnterText();
    }

    if (playerSprite.overlap(this.restaurantSpriteCollide) && keyIsDown(69)) {
      this.enter();
    }
  }

  enter() {
    adventureManager.changeState("Restaurant");
  }
}

class Map12Room extends PNGRoom {
  preload() {
      // Houses
      this.drawHouseX = 770;
      this.drawHouseY = 372.4025 - 478/5;
      this.houseSprite = createSprite( this.drawHouseX, this.drawHouseY, 227, 478);
      this.houseSprite.addAnimation('regular',  loadAnimation('assets/buildings/house.png'));
      this.houseSpriteCollide = createSprite(this.drawHouseX, 519, 100, 20);

      this.houseSpriteA = createSprite( this.drawHouseX - 250, this.drawHouseY, 228, 479);
      this.houseSpriteA.addAnimation('regular',  loadAnimation('assets/buildings/house_z1a.png'));

      this.houseSpriteB = createSprite( this.drawHouseX + 250, this.drawHouseY, 228, 479);
      this.houseSpriteB.addAnimation('regular',  loadAnimation('assets/buildings/house_z1b.png'));

      // Lamp
      this.lampSprite = createSprite(300, 520 - 478/2, 113, 478);
      this.lampSprite.addAnimation('regular',  loadAnimation('assets/objects/lamp_1.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_4.png','assets/objects/lamp_5.png', 'assets/objects/lamp_4.png', 'assets/objects/lamp_3.png', 'assets/objects/lamp_2.png', 'assets/objects/lamp_1.png'));

      // Other houses
      this.houseSprite1 = createSprite(160, this.drawHouseY, 228, 479);
      this.houseSprite1.addAnimation('regular',  loadAnimation('assets/buildings/house_z1b.png'));

      // Music
      // this.bgsfx = loadSound('sfx/street.mp3');
  }

  draw() {
    // draw background
    super.draw();

    // draw sprites
    drawSprite(this.houseSprite);
    drawSprite(this.houseSpriteA);
    drawSprite(this.houseSpriteB);
    drawSprite(this.houseSprite1);

    drawSprite(this.lampSprite);

    // Music
    // if (this.bgsfx.isPlaying() == false) {
    //   this.bgsfx.play();
    // } 

    // Draw press E to enter text
    if (playerSprite.overlap(this.houseSpriteCollide)) {
      drawEnterText();
    }

    // Enter the building
    if (playerSprite.overlap(this.houseSpriteCollide) && keyIsDown(69)) {
      this.enter();
    }
  }

  unload() {
    this.bgsfx;
  }

  enter() {
    adventureManager.changeState("House");
  }
}

class Map13Room extends PNGRoom {
  preload() {
      // Sand and Ocean
      this.sand = createSprite(683, 698 - 276/2, 1366, 276);
      this.sand.addAnimation('regular',  loadAnimation('assets/objects/sand.png'));

      this.waves = createSprite(683, 768 - 276/2, 1366, 276);
      this.waves.addAnimation('regular',  loadAnimation('assets/objects/1_ocean.png', 'assets/objects/2_ocean.png', 'assets/objects/3_ocean.png', 'assets/objects/4_ocean.png', 'assets/objects/5_ocean.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.sand);
    drawSprite(this.waves);
  }
}

class Map14Room extends PNGRoom {
  preload() {
      // Sand and Ocean
      this.sand = createSprite(683, 698 - 276/2, 1366, 276);
      this.sand.addAnimation('regular',  loadAnimation('assets/objects/sand.png'));

      this.waves = createSprite(683, 768 - 276/2, 1366, 276);
      this.waves.addAnimation('regular',  loadAnimation('assets/objects/1_ocean.png', 'assets/objects/2_ocean.png', 'assets/objects/3_ocean.png', 'assets/objects/4_ocean.png', 'assets/objects/5_ocean.png', 'assets/objects/4_ocean.png','assets/objects/3_ocean.png','assets/objects/2_ocean.png', 'assets/objects/1_ocean.png'));

      // Houses
      this.houseSprite1 = createSprite(199.0014, 384 - 479/2, 228, 479);
      this.houseSprite1.addAnimation('regular',  loadAnimation('assets/buildings/house_z1a.png'));
      this.houseSprite2 = createSprite(532.4003, 384 - 479/2, 228, 479);
      this.houseSprite2.addAnimation('regular',  loadAnimation('assets/buildings/house_z1a.png'));
      this.houseSprite3 = createSprite(834.0126, 384 - 479/2, 228, 479);
      this.houseSprite3.addAnimation('regular',  loadAnimation('assets/buildings/house_z1b.png'));
      this.houseSprite4 = createSprite(1166.9986, 384 - 479/2, 228, 479);
      this.houseSprite4.addAnimation('regular',  loadAnimation('assets/buildings/house_z1a.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.sand);
    drawSprite(this.waves);

    drawSprite(this.houseSprite1);
    drawSprite(this.houseSprite2);
    drawSprite(this.houseSprite3);
    drawSprite(this.houseSprite4);
  }
}

class Map15Room extends PNGRoom {
  preload() {
      // Sand and Ocean
      this.sand = createSprite(683, 698 - 276/2, 1366, 276);
      this.sand.addAnimation('regular',  loadAnimation('assets/objects/sand.png'));

      this.waves = createSprite(683, 768 - 276/2, 1366, 276);
      this.waves.addAnimation('regular',  loadAnimation('assets/objects/1_ocean.png', 'assets/objects/2_ocean.png', 'assets/objects/3_ocean.png', 'assets/objects/4_ocean.png', 'assets/objects/5_ocean.png'));

      // Houses
      this.houseSprite1 = createSprite(199.0014, 384 - 479/2, 228, 479);
      this.houseSprite1.addAnimation('regular',  loadAnimation('assets/buildings/house_z1a.png'));
      this.houseSprite2 = createSprite(532.4003, 384 - 479/2, 228, 479);
      this.houseSprite2.addAnimation('regular',  loadAnimation('assets/buildings/house_z1a.png'));
      this.houseSprite3 = createSprite(834.0126, 384 - 479/2, 228, 479);
      this.houseSprite3.addAnimation('regular',  loadAnimation('assets/buildings/house_z1b.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.sand);
    drawSprite(this.waves);

    drawSprite(this.houseSprite1);
    drawSprite(this.houseSprite2);
    drawSprite(this.houseSprite3);
  }
}


// Individual Rooms
class HouseRoom extends PNGRoom {
  preload() {
      this.npcX = width/4;
      this.npcY = height/2;

      this.liNPCSprite = createSprite(this.npcX, this.npcY, npcW, npcH);
      this.liNPCSprite.addAnimation('idle',  loadAnimation('assets/NPCs/npc_li_1.png', 'assets/NPCs/npc_li_2.png', 'assets/NPCs/npc_li_3.png', 'assets/NPCs/npc_li_2.png', 'assets/NPCs/npc_li_1.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.liNPCSprite);
    this.liNPCSprite.setCollider('rectangle', 0, -20, 25, 40);
    playerSprite.collide(this.liNPCSprite);

    if (playerSprite.overlap(this.liNPCSprite)) {
      dialogueVisible = true;
      currentDialogueName = 'Li';
      currentDialogue = 'Ren... our parents are dead, murdered in the night by SALARY’s loan sharks while we slept. It’s up to you to reclaim our FAMILY HONOR.\n\n\nI would do it, since I’m the older of us two sisters, but I have to stay inside to finish my math homework. Hey, watch out for CREEPS outside, I saw some lurking around out there. Try not to get kidnapped, or worse!';
    } 
    else {
      dialogueVisible = false;
    }
  }
}

class RestaurantRoom extends PNGRoom {
  preload() {
      this.npcX = 707.2549;
      this.npcY = 308.0991 ;

      this.ppNPCSprite = createSprite(this.npcX, this.npcY, npcW, npcH);
      this.ppNPCSprite.addAnimation('idle',  loadAnimation('assets/NPCs/npc_pp_1.png', 'assets/NPCs/npc_pp_2.png', 'assets/NPCs/npc_pp_1.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.ppNPCSprite);
    this.ppNPCSprite.setCollider('rectangle', 0, -20, 25, 40);
    playerSprite.collide(this.ppNPCSprite);

    if (playerSprite.overlap(this.ppNPCSprite)) {
      dialogueVisible = true;
      currentDialogueName = 'Paw Paw Potsticker';
      currentDialogue = 'Oh Ren, it’s so good to see you! I knew you would visit soon enough again. Here, have a potsticker -- you could use one, you know, you’re looking so skinny! ... \n\n\nI don’t know about your HONOR, but maybe your AUNTIES in the north of town know. You should pay them a visit when you have the chance.';

      // heals the player to maximum (it's the power of dim sum)
      playerLives = 3;

      // gives player a potsticker
      potsticker = true;
    } 
    else {
      dialogueVisible = false;
    }
  }
}

class UpstartRoom extends PNGRoom {
  preload() {
      this.npcX = 476.1189;
      this.npcY = 321.1925;

      this.usNPCSprite = createSprite(this.npcX, this.npcY, npcW, npcH);
      this.usNPCSprite.addAnimation('idle',  loadAnimation('assets/NPCs/npc_upstart_1.png', 'assets/NPCs/npc_upstart_2.png', 'assets/NPCs/npc_upstart_3.png', 'assets/NPCs/npc_upstart_2.png', 'assets/NPCs/npc_upstart_1.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.usNPCSprite);
    this.usNPCSprite.setCollider('rectangle', 0, -20, 25, 40);
    playerSprite.collide(this.usNPCSprite);

    if (playerSprite.overlap(this.usNPCSprite)) {
      dialogueVisible = true;
      currentDialogueName = 'The Upstart';
      // if have not spoken to upstart before
        if (spokeToUpstart === false) {
          currentDialogue = 'Tch... hey kid. Guess you heard about me trying to shake things up around here, wanted to know what the fuss was about. Well, I’ll let you in on a little secret... for a price. Living outside of society’s boundaries works up an appetite. Could you bring me some DIM SUM or something?';
           spokeToUpstart = true;
        } 
        // if have spoken to upstart before and have a potsticker for her
        else if (spokeToUpstart === true && potsticker === true) {
          currentDialogue = 'Hey, thanks for the potsticker. Alright, I’ll show you what’s up. This’ll help you unlock the SECRET POWERS that lurk within you. ... Good luck on your quest to avenge your parents.\n\n\nUnless... you’d ever want to forget about all that and join force instead. Y’know, no pressure. But you’re pretty cool, Ren. A BADASS, like me.';
          // takes potsticker
          potsticker = false;
          // heals player
          playerLives = 3;
          // gives favor
          upstartFavor = true;
          // shows join button
          drawDialogueButtons(UpstartButton, true);
        } 
        else if (spokeToUpstart === true && upstartFavor === true) {
          currentDialogue = 'Hey, thanks for the potsticker. Alright, I’ll show you what’s up. This’ll help you unlock the SECRET POWERS that lurk within you. ... Good luck on your quest to avenge your parents.\n\n\nUnless... you’d ever want to forget about all that and join force instead. Y’know, no pressure. But you’re pretty cool, Ren. A BADASS, like me.';
          // heals player
          playerLives = 3;
          // shows join button
          drawDialogueButtons(UpstartButton, true);
        } 
    } 
    else {
      dialogueVisible = false;
      drawDialogueButtons(UpstartButton, false);
    }
  }
}

class BrothelRoom extends PNGRoom {
  preload() {
      // Aunties Sprite
      this.npcX = 476.1189;
      this.npcY = 321.1925;

      this.aNPCSprite = createSprite(this.npcX, this.npcY, npcW, npcH);
      this.aNPCSprite.addAnimation('idle',  loadAnimation('assets/NPCs/npc_aunties_1.png', 'assets/NPCs/npc_aunties_2.png', 'assets/NPCs/npc_aunties_1.png'));

      // Background for camera context
     this.tileBg = new Group();
      for(var i=0; i<40; i++)
      {
        var tile = createSprite(round(random(0, SCENE_W)), round(random(height/2, SCENE_H+height)));
        tile.addAnimation('normal', 'assets/objects/tile.png');
        this.tileBg.add(tile);
      }

    // Tables
     this.tables = new Group();

      var table1 = createSprite(round(random((SCENE_W/4)*3, (SCENE_W/4)*4)), round(random((height/1.5), SCENE_H+height)), 200, 100);
      var table2 = createSprite(round(random(0, (SCENE_W/4)*1)), round(random((height/1.5), SCENE_H+height)), 200, 100);
      var table3 = createSprite(round(random((SCENE_W/4)*3, (SCENE_W/4)*4)), round(random((height*1.5), SCENE_H+height)), 200, 100);
      var table4 = createSprite(round(random(0, (SCENE_W/4)*1)), round(random((height*1.5), SCENE_H+height)), 200, 100);
      var table5 = createSprite(round(random((SCENE_W/4)*3, (SCENE_W/4)*4)), round(random((height/2), height*1.5)), 200, 100);
      var table6 = createSprite(round(random(0, (SCENE_W/4)*1)), round(random((height/2), height*1.5)), 200, 100);

      table1.addAnimation('normal', 'assets/objects/table_brothel.png');
      table2.addAnimation('normal', 'assets/objects/table_brothel.png');
      table3.addAnimation('normal', 'assets/objects/table_brothel.png');
      table4.addAnimation('normal', 'assets/objects/table_brothel.png');
      table5.addAnimation('normal', 'assets/objects/table_brothel.png');
      table6.addAnimation('normal', 'assets/objects/table_brothel.png');

      this.tables.add(table1);
      this.tables.add(table2);
      this.tables.add(table3);
      this.tables.add(table4);
      this.tables.add(table5);
      this.tables.add(table6);

    // Collide for exit
      this.exitCollide = createSprite(width/2, SCENE_H+height, 1000, 20);

    // Collide for join
      this.joinCollide = createSprite(300, 0, 300, 20);

      this.stairs = createSprite(300, -533/2, 288, 533);
      this.stairs.addAnimation('idle',  loadAnimation('assets/objects/stairs_brothel.png'));

    // Women
     this.workers = new Group();
      for(var i=0; i<12; i++)
      {
        var worker = createSprite(round(random(0, SCENE_W)), round(random(height/2, SCENE_H+height)));
        worker.addAnimation('idle', 'assets/NPCs/brothel_1.png', 'assets/NPCs/brothel_2.png', 'assets/NPCs/brothel_3.png', 'assets/NPCs/brothel_2.png', 'assets/NPCs/brothel_1.png');
        this.workers.add(worker);
      }

    // Men
     this.creeps = new Group();
      for(var i=0; i<3; i++)
      {
        var man = createSprite(round(random(0, SCENE_W)), round(random(height/2, SCENE_H+height)));
        man.addAnimation('idle', 'assets/NPCs/creep_y_idle.png');
        this.creeps.add(man);
      }
      for(var i=0; i<5; i++)
      {
        var man = createSprite(round(random(0, SCENE_W)), round(random(height/2, SCENE_H+height)));
        man.addAnimation('idle', 'assets/NPCs/creep_b_idle.png');
        this.creeps.add(man);
      }
  }

  draw() {
    // Draw some background
    background('#1099BF');
    noStroke();
    fill('#0B527F');
    rect(0 - 400, 0, SCENE_W + 400, SCENE_H + 50);

    // Set camera
    camera.position.x = playerSprite.position.x;
    camera.position.y = playerSprite.position.y;

    // Draw bg
    super.draw();

    // Draw stairs
    drawSprite(this.stairs);

    // Draw tile background
    drawSprites(this.tileBg);

    // Draw playershadow
      fill('#ffffff10');
      noStroke();
      ellipse(playerSprite.position.x, playerSprite.position.y, 400, 400);

    // Draw Aunties sprite
    drawSprite(this.aNPCSprite);
    this.aNPCSprite.setCollider('rectangle', 0, -20, 50, 40);
    playerSprite.collide(this.aNPCSprite);

    // Draw tables and define collision behavior
    drawSprites(this.tables);
    this.tables.collide(this.tables);
    playerSprite.collide(this.tables);

    // Draw workers and creeps and define collision behavior
    drawSprites(this.workers);
    drawSprites(this.creeps);

    this.workers.collide(this.workers);
    this.workers.collide(this.creeps);
    this.creeps.collide(this.creeps);
    this.workers.collide(this.aNPCSprite);
    this.creeps.collide(this.aNPCSprite);
    this.workers.collide(this.tables);
    this.creeps.collide(this.tables);

    playerSprite.displace(this.workers);
    playerSprite.displace(this.creeps);


    // Dialogue with Aunties sprite
    if (playerSprite.overlap(this.aNPCSprite)) {
      dialogueVisible = true;
      currentDialogueName = 'Aunties';
      currentDialogue = 'Oh, hello Ren! What brings you all the way to the entertainment district? ...\n\n\nHmm... your quest sounds quite difficult. You could come WORK FOR US here instead, if you’d like - go up the stairs right behind us if you’re interested. Otherwise, you might want to talk to that UPSTART in the slums of town. She’s a feisty one, though.';
      // drawDialogueButtons(AuntiesButton, true);
    } 
    else {
      dialogueVisible = false;
      // drawDialogueButtons(AuntiesButton, false);
    }

    // Draw press E to enter text
    if (playerSprite.overlap(this.exitCollide)) {
      drawEnterText();
    }
    // Exit
    if (playerSprite.overlap(this.exitCollide) && keyIsDown(69)) {
      this.exit();
    }
    
    // Draw press E to join text
    if (playerSprite.overlap(this.joinCollide)) {
      drawEnterText();
    }
    // Join
    if (playerSprite.overlap(this.joinCollide) && keyIsDown(69)) {
      this.join();
    }
  }

  exit() {
    adventureManager.changeState("Map3");
    SCENE_W = 1366;
    SCENE_H = 786;
    camera.position.x = width/2;
    camera.position.y = height/2;
  }

  join() {
    adventureManager.changeState("BrothelJoin");
    SCENE_W = 1366;
    SCENE_H = 786;
    camera.position.x = width/2;
    camera.position.y = height/2;
    print('changed it');
  }
}

class SkyRoom extends PNGRoom {
  preload() {
      this.npcX = width/2;
      this.npcY = height/3;

      this.salarySprite = createSprite(this.npcX, this.npcY, npcW, npcH);
      this.salarySprite.addAnimation('idle',  loadAnimation('assets/NPCs/npc_salary_1.png', 'assets/NPCs/npc_salary_2.png', 'assets/NPCs/npc_salary_3.png', 'assets/NPCs/npc_salary_2.png', 'assets/NPCs/npc_salary_1.png'));
  }

  draw() {
    super.draw();
    drawSprite(this.salarySprite);
    this.salarySprite.setCollider('rectangle', 0, -20, 25, 40);
    playerSprite.collide(this.salarySprite);

    if (playerSprite.overlap(this.salarySprite)) {
      dialogueVisible = true;
      currentDialogueName = 'Sir Salary';
      currentDialogue = 'Welcome to Salary Enterprises! Hey, how’s my smile? Do you think that, with these sunglasses on, I look White? Anyways... Most likely, you’re here for revenge, right? For the death of your parents? Listen... I have an opportunity for you instead. Come work for me as my secretary and we’ll forget you were ever a poor girl from nowhere.';

      if (upstartFavor === false) {
          drawDialogueButtons(SalaryJoinButton, true);
          drawDialogueButtons(SalaryAttackButton, true);
      } else if (upstartFavor === true) {
          drawDialogueButtons(SalaryJoinButton, true);
          drawDialogueButtons(SalaryPowerButton, true);
      }

    } 
    else {
      dialogueVisible = false;
      drawDialogueButtons(SalaryJoinButton, false);
      drawDialogueButtons(SalaryAttackButton, false);
      drawDialogueButtons(SalaryPowerButton, false);
    }
  }
}

// Ending states
class CreepDeath extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*5.5; 
    this.aboutText = "Ren was found unconscious on the street. Her assailants were never caught."
  }

  draw() {
    tint(128);
    super.draw();
    
    fill(hexDark[3]);
    textAlign(CENTER);
    textSize(34);

    text(this.aboutText, width/6, height/6, this.textBoxWidth, this.textBoxHeight);
  }
}

class BrothelJoin extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*5.5; 
    this.aboutText = "Ren agreed to enter a contract with her Aunties, and spent the rest of her short days at the Lotus of Desire receiving solicitations from clientele."
  }

  draw() {
    tint(128);
    super.draw();
    
    fill(hexDark[3]);
    textAlign(CENTER);
    textSize(34);

    text(this.aboutText, width/6, height/6, this.textBoxWidth, this.textBoxHeight);
  }
}

class SalaryJoin extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*5.5; 
    this.aboutText = "Ren agreed to enter a contract with Sir Salary, with a variable degree of worker exploitation and violations of appropriate conduct on Salary's part."
  }

  draw() {
    tint(128);
    super.draw();
    
    fill(hexDark[3]);
    textAlign(CENTER);
    textSize(34);

    text(this.aboutText, width/6, height/6, this.textBoxWidth, this.textBoxHeight);
  }
}

class SalaryDeath extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*5.5; 
    this.aboutText = "Ren engaged Sir Salary in combat, but could not unlock her mystical powers and so was slain."
  }

  draw() {
    tint(128);
    super.draw();
    
    fill(hexDark[3]);
    textAlign(CENTER);
    textSize(34);

    text(this.aboutText, width/6, height/6, this.textBoxWidth, this.textBoxHeight);
  }
}

class SalaryVictory extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*5.5; 
    this.aboutText = "Ren engaged Sir Salary in combat, killing him instantly with her secret unlocked powers. Her parents, avenged, rested in peace."
  }

  draw() {
    tint(128);
    super.draw();
    
    fill(hexDark[3]);
    textAlign(CENTER);
    textSize(34);

    text(this.aboutText, width/6, height/6, this.textBoxWidth, this.textBoxHeight);
  }
}

class UpstartJoin extends PNGRoom {
  preload() {
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*5.5; 
    this.aboutText = "Ren and The Upstart eloped, running away from the demented Orientalist fantasy hand-in-hand. They now jointly own 2 cats and a pickup truck."
  }

  draw() {
    tint(128);
    super.draw();
    
    fill(hexDark[3]);
    textAlign(CENTER);
    textSize(34);

    text(this.aboutText, width/6, height/6, this.textBoxWidth, this.textBoxHeight);
  }
}

//Reloads the page after an ending
class Reset extends PNGRoom {
  draw() {
    tint(128);
    super.draw();
    window.location.href = "."
  }
}