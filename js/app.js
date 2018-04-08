const FIELD_WIDTH = 101;
const FIELD_HEIGHT = 83;
const NUM_ROWS = 6;
const NUM_COLS = 5;

var player_start_x = function() {
    return Math.floor(NUM_COLS / 2) * FIELD_WIDTH;
};

var player_start_y = function() {
    return (NUM_ROWS - 1) * FIELD_HEIGHT - FIELD_HEIGHT / 2;
};

var create_map = function() {
    var mapItems = []; 

    mapItems.push('images/water-block.png');

    for(var i = 1; i < (NUM_ROWS - 1); i++) {
        mapItems.push('images/stone-block.png');
    }

    mapItems.push('images/grass-block.png');

    return mapItems;
}

var add_enemies = function() {
    var enemy;
    var enemyList = [];

    for(var i = 1; i < (NUM_ROWS - 1); i++) {
        enemy = new Enemy(0, i * FIELD_HEIGHT - FIELD_HEIGHT / 4, 100 + Math.floor(Math.random() * 400));
        enemyList.push(enemy);
    }

    return enemyList;
}

var Character = function(x, y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

Character.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Enemy = function(x, y, speed) {
    Character.call(this, x, y, 'images/enemy-bug.png');
    this.speed = speed;
};
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;

    if (this.x > NUM_COLS * FIELD_WIDTH)
        this.x = - FIELD_WIDTH;

    // Check for player-enemy-collision
    if (player.x - FIELD_WIDTH / 1.5 < this.x && player.x + FIELD_WIDTH / 1.5 > this.x && player.y - FIELD_HEIGHT / 1.5 < this.y && player.y + FIELD_HEIGHT / 1.5 > this.y)
        player.reset();

};

var Player = function(x = player_start_x(), y = player_start_y()) {
    Character.call(this, x, y, 'images/char-cat-girl.png');
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.reset = function() {
    this.x = player_start_x();
    this.y = player_start_y();
};

Player.prototype.update = function(dt) {
    var max_x = (NUM_COLS - 1) * FIELD_WIDTH;
    var max_y = (NUM_ROWS - 1) * FIELD_HEIGHT;

    if (this.y > max_y)
        this.y = max_y;

    if (this.x > max_x)
        this.x = max_x;

    if (this.x < 0)
        this.x = 0;

    if (this.y <= 0)
        this.reset();
};

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
var allEnemies = add_enemies();
var player = new Player();

