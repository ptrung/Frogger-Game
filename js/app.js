//size of the fields (should only be changed in case of changing the images)
const FIELD_WIDTH = 101;
const FIELD_HEIGHT = 83;

//number of rows and columns (can be changed as prefered)
const NUM_ROWS = 10;
const NUM_COLS = 5;


/**
* @description Returns the x of the startposition of the player
* @return {number} start_x
*/
var player_start_x = function() {
    return Math.floor(NUM_COLS / 2) * FIELD_WIDTH;
};

/**
* @description Returns the y of the startposition of the player
* @return {number} start_y
*/
var player_start_y = function() {
    return (NUM_ROWS - 1) * FIELD_HEIGHT - FIELD_HEIGHT / 2;
};

/**
* @description Returns a list of the map items, 
        first row is water, last row is grass
        in between we have stone
* @return {list} mapItems
*/
var create_map = function() {
    var mapItems = []; 

    mapItems.push('images/water-block.png');

    for(var i = 1; i < (NUM_ROWS - 1); i++) {
        var random = Math.random() * 10;

        if(random > 8)
            mapItems.push('images/grass-block.png');
        else
            mapItems.push('images/stone-block.png');
    }

    mapItems.push('images/grass-block.png');

    return mapItems;
}

/**
* @description Returns a list of Enemy Objects
        One enemy for each stone row
* @return {list} mapItems
*/
var add_enemies = function(map) {
    var enemy;
    var enemyList = [];

    if(map.length != 0) {
        for(var i = 0; i < map.length; i++) {
            if(map[i] === 'images/stone-block.png') {
                enemy = new Enemy(0, i * FIELD_HEIGHT - FIELD_HEIGHT / 4, 200 + Math.floor(Math.random() * 200));
                enemyList.push(enemy);
            }
        }
    }

    return enemyList;
}

/**
* @description Super class for all characters with the position x and y
*       and the string of the image path
* @param {number} x
* @param {number} y
* @param {string} sprite
*/
var Character = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

/**
* @description Renders the image
*/
Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Sub class of Character: Enemy
        it has the additional param: speed
* @param {number} x
* @param {number} y
* @param {string} sprite
*/
var Enemy = function(x, y, speed) {
    Character.call(this, x, y, 'images/enemy-bug.png');
    this.speed = speed;
};
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

/**
* @description Checks if the enemy reached the end of the row
        or if a collision with a player happend
*/
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

    // Check if enemy reached end of row
    if (this.x > NUM_COLS * FIELD_WIDTH)
        this.x = - FIELD_WIDTH;

    // Check for player-enemy-collision
    if (player.x - FIELD_WIDTH / 1.5 < this.x 
            && player.x + FIELD_WIDTH / 1.5 > this.x 
            && player.y - FIELD_HEIGHT / 1.5 < this.y 
            && player.y + FIELD_HEIGHT / 1.5 > this.y)
        player.reset();

};

/**
* @description Sub class of Character: Player
        it has a defaultposition
* @param {number} x
* @param {number} y
*/
var Player = function(x = player_start_x(), y = player_start_y()) {
    Character.call(this, x, y, 'images/char-cat-girl.png');
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

/**
* @description Resets the player to the startposition
*/
Player.prototype.reset = function() {
    this.x = player_start_x();
    this.y = player_start_y();
};

/**
* @description Resets the player to the startposition and changes the map
*/
Player.prototype.win = function() {
    this.reset();
    map = create_map();
    allEnemies = add_enemies(map);
};

/**
* @description Checks if the player reached the goal or tries to move outside the map
*/
Player.prototype.update = function(dt) {
    var max_x = (NUM_COLS - 1) * FIELD_WIDTH;
    var max_y = (NUM_ROWS - 1) * FIELD_HEIGHT;

    if (this.y > max_y)
        this.y = max_y;

    if (this.x > max_x)
        this.x = max_x;

    if (this.x < 0)
        this.x = 0;

    //Player reached the goal
    if (this.y <= 0)
        this.win();
};

/**
* @description Handels the movement of a keypress
* @param {string} keyPress
*/
Player.prototype.handleInput = function(keyPress) {
    switch (keyPress) {
        case 'left':
            this.x -= FIELD_WIDTH;
            break;
        case 'up':
            this.y -= FIELD_HEIGHT;
            break;
        case 'right':
            this.x += FIELD_WIDTH;
            break;
        case 'down':
            this.y += FIELD_HEIGHT;
            break;
    }
};

/**
* @description EventListener for the arrow keys
*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

var map = create_map();
var allEnemies = add_enemies(map);
var player = new Player();

