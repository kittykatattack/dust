"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dust = (function () {
  function Dust() {
    var renderingEngine = arguments.length <= 0 || arguments[0] === undefined ? PIXI : arguments[0];

    _classCallCheck(this, Dust);

    if (renderingEngine === undefined) throw new Error("Please assign a rendering engine in the constructor before using pixiDust.js");

    //Find out which rendering engine is being used (the default is Pixi)
    this.renderer = "";

    //If the `renderingEngine` is Pixi, set up Pixi object aliases
    if (renderingEngine.ParticleContainer) {
      this.Container = renderingEngine.Container;
      this.renderer = "pixi";
    }

    //The `particles` array stores all the particles you make
    this.globalParticles = [];
  }

  //Random number functions

  _createClass(Dust, [{
    key: "randomFloat",
    value: function randomFloat(min, max) {
      return min + Math.random() * (max - min);
    }
  }, {
    key: "randomInt",
    value: function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //Use the create function to create new particle effects

  }, {
    key: "create",
    value: function create() {
      var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
      var spriteFunction = arguments.length <= 2 || arguments[2] === undefined ? function () {
        return console.log("Sprite creation function");
      } : arguments[2];
      var container = arguments.length <= 3 || arguments[3] === undefined ? function () {
        return new _this.Container();
      } : arguments[3];
      var numberOfParticles = arguments.length <= 4 || arguments[4] === undefined ? 20 : arguments[4];
      var gravity = arguments.length <= 5 || arguments[5] === undefined ? 0 : arguments[5];
      var randomSpacing = arguments.length <= 6 || arguments[6] === undefined ? true : arguments[6];
      var minAngle = arguments.length <= 7 || arguments[7] === undefined ? 0 : arguments[7];
      var maxAngle = arguments.length <= 8 || arguments[8] === undefined ? 6.28 : arguments[8];
      var minSize = arguments.length <= 9 || arguments[9] === undefined ? 4 : arguments[9];
      var maxSize = arguments.length <= 10 || arguments[10] === undefined ? 16 : arguments[10];
      var minSpeed = arguments.length <= 11 || arguments[11] === undefined ? 0.3 : arguments[11];
      var maxSpeed = arguments.length <= 12 || arguments[12] === undefined ? 3 : arguments[12];
      var minScaleSpeed = arguments.length <= 13 || arguments[13] === undefined ? 0.01 : arguments[13];
      var maxScaleSpeed = arguments.length <= 14 || arguments[14] === undefined ? 0.05 : arguments[14];
      var minAlphaSpeed = arguments.length <= 15 || arguments[15] === undefined ? 0.02 : arguments[15];
      var maxAlphaSpeed = arguments.length <= 16 || arguments[16] === undefined ? 0.02 : arguments[16];

      var _this = this;

      var minRotationSpeed = arguments.length <= 17 || arguments[17] === undefined ? 0.01 : arguments[17];
      var maxRotationSpeed = arguments.length <= 18 || arguments[18] === undefined ? 0.03 : arguments[18];

      //An array to store the curent batch of particles
      var particles = [];

      //Add the current `particles` array to the `globalParticles` array
      this.globalParticles.push(particles);

      //An array to store the angles
      var angles = [];

      //A variable to store the current particle's angle
      var angle = undefined;

      //Figure out by how many radians each particle should be separated
      var spacing = (maxAngle - minAngle) / (numberOfParticles - 1);

      //Create an angle value for each particle and push that //value into the `angles` array
      for (var i = 0; i < numberOfParticles; i++) {

        //If `randomSpacing` is `true`, give the particle any angle
        //value between `minAngle` and `maxAngle`
        if (randomSpacing) {
          angle = this.randomFloat(minAngle, maxAngle);
          angles.push(angle);
        }

        //If `randomSpacing` is `false`, space each particle evenly,
        //starting with the `minAngle` and ending with the `maxAngle`
        else {
            if (angle === undefined) angle = minAngle;
            angles.push(angle);
            angle += spacing;
          }
      }

      //A function to make particles
      var makeParticle = function makeParticle(angle) {

        //Create the particle using the supplied sprite function
        var particle = spriteFunction();

        //Display a random frame if the particle has more than 1 frame
        if (particle.totalFrames > 0) {
          particle.gotoAndStop(_this.randomInt(0, particle.totalFrames - 1));
        }

        //Set a random width and height
        var size = _this.randomInt(minSize, maxSize);
        particle.width = size;
        particle.height = size;

        //Set the particle's `anchor` to its center
        particle.anchor.set(0.5, 0.5);

        //Set the x and y position
        particle.x = x;
        particle.y = y;

        //Set a random speed to change the scale, alpha and rotation
        particle.scaleSpeed = _this.randomFloat(minScaleSpeed, maxScaleSpeed);
        particle.alphaSpeed = _this.randomFloat(minAlphaSpeed, maxAlphaSpeed);
        particle.rotationSpeed = _this.randomFloat(minRotationSpeed, maxRotationSpeed);

        //Set a random velocity at which the particle should move
        var speed = _this.randomFloat(minSpeed, maxSpeed);
        particle.vx = speed * Math.cos(angle);
        particle.vy = speed * Math.sin(angle);

        //Push the particle into the `particles` array.
        //The `particles` array needs to be updated by the game loop each frame particles.push(particle);
        particles.push(particle);

        //Add the particle to its parent container
        container.addChild(particle);

        //The particle's `updateParticle` method is called on each frame of the
        //game loop
        particle.updateParticle = function () {

          //Add gravity
          particle.vy += gravity;

          //Move the particle
          particle.x += particle.vx;
          particle.y += particle.vy;

          //Change the particle's `scale`
          if (particle.scale.x - particle.scaleSpeed > 0) {
            particle.scale.x -= particle.scaleSpeed;
          }
          if (particle.scale.y - particle.scaleSpeed > 0) {
            particle.scale.y -= particle.scaleSpeed;
          }

          //Change the particle's rotation
          particle.rotation += particle.rotationSpeed;

          //Change the particle's `alpha`
          particle.alpha -= particle.alphaSpeed;

          //Remove the particle if its `alpha` reaches zero
          if (particle.alpha <= 0) {
            container.removeChild(particle);
            particles.splice(particles.indexOf(particle), 1);
          }
        };
      };

      //Make a particle for each angle
      angles.forEach(function (angle) {
        return makeParticle(angle);
      });

      //Return the `particles` array back to the main program
      return particles;
    }

    //A particle emitter

  }, {
    key: "emitter",
    value: function emitter(interval, particleFunction) {
      var emitterObject = {},
          timerInterval = undefined;

      emitterObject.playing = false;

      function play() {
        if (!emitterObject.playing) {
          particleFunction();
          timerInterval = setInterval(emitParticle.bind(this), interval);
          emitterObject.playing = true;
        }
      }

      function stop() {
        if (emitterObject.playing) {
          clearInterval(timerInterval);
          emitterObject.playing = false;
        }
      }

      function emitParticle() {
        particleFunction();
      }

      emitterObject.play = play;
      emitterObject.stop = stop;
      return emitterObject;
    }

    //A function to update the particles in the game loop

  }, {
    key: "update",
    value: function update() {

      //Check so see if the `globalParticles` array contains any
      //sub-arrays
      if (this.globalParticles.length > 0) {

        //If it does, Loop through the particle arrays in reverse
        for (var i = this.globalParticles.length - 1; i >= 0; i--) {

          //Get the current particle sub-array
          var particles = this.globalParticles[i];

          //Loop through the `particles` sub-array and update the
          //all the particle sprites that it contains
          if (particles.length > 0) {
            for (var j = particles.length - 1; j >= 0; j--) {
              var particle = particles[j];
              particle.updateParticle();
            }
          }

          //Remove the particle array from the `globalParticles` array if doesn't
          //contain any more sprites
          else {
              this.globalParticles.splice(this.globalParticles.indexOf(particles), 1);
            }
        }
      }
    }
  }]);

  return Dust;
})();
//# sourceMappingURL=dust.js.map