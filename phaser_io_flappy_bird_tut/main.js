// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');
var game_state = {};

// Creates a new 'main' state that wil contain the game
game_state.main = function() { };  
game_state.main.prototype = {

  preload: function() { 
    this.game.stage.backgroundColor = '#71c5cf';
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    this.game.load.image('pipe', 'assets/pipe.png');
  },

  create: function() { 

    // Display dude
    this.dude = this.game.add.sprite(110, 245, 'dude');
    this.dude.animations.add('right', [5,6,7,8], 10, true);

    // add gravity to dude
    this.dude.body.gravity.y = 1000;

    this.pipes = game.add.group();
    this.pipes.createMultiple(20, 'pipe');

    this.timer = this.game.time.events.loop(1500, this.add_pipes, this);

    // call 'jump' function when the spacekey is hit
    var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    space_key.onDown.add(this.jump, this);

    this.score = 0;
    var style = {
      font: '30px Arial',
      fill: '#eeeeee'
    };

    this.label_score = this.game.add.text(20,20, '0', style);
  },
  
  update: function() {
  // Function called 60 times per second
    if (this.dude.inWorld == false) {
      this.restart_game();
    }
    this.dude.animations.play('right');
    this.game.physics.overlap(this.dude, this.pipes, this.restart_game, null, this);
  },
  
  jump: function() {
    this.dude.body.velocity.y = -350;
  },

  add_pipe: function(x, y) {
    var pipe = this.pipes.getFirstDead();
    pipe.reset(x, y);
    pipe.body.velocity.x = -200;
    pipe.outOfBoundsKill = true;
  },

  add_pipes: function() {
    var hole = Math.floor(Math.random()*5)+1;
    for (var i = 0; i < 8; i++) {
      if (i != hole && i != hole + 1)
        this.add_pipe(400, i*60 + 10);
    }
    this.score += 1;
    this.label_score.content = this.score;
  },

  restart_game: function() {
    this.game.time.events.remove(this.timer);
    this.game.state.start('main');
  }
};

// Add and start the 'main' state to start the game
game.state.add('main', game_state.main);  
game.state.start('main'); 
