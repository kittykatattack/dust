export class Dust {
  constructor (renderingEngine = PIXI) {
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
  randomFloat(min, max) {
    return min + Math.random() * (max - min);
  }
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //Use the create function to create new particle effects
  create(
    x = 0,
    y = 0,
    spriteFunction = () => console.log("Sprite creation function"),
    container = () => new this.Container(),
    numberOfParticles = 20,
    gravity = 0,
    randomSpacing = true,
    minAngle = 0, maxAngle = 6.28,
    minSize = 4, maxSize = 16,
    minSpeed = 0.3, maxSpeed = 3,
    minScaleSpeed = 0.01, maxScaleSpeed = 0.05,
    minAlphaSpeed = 0.02, maxAlphaSpeed = 0.02,
    minRotationSpeed = 0.01, maxRotationSpeed = 0.03
  ){
   
    //An array to store the curent batch of particles
    let particles = [];

    //Add the current `particles` array to the `globalParticles` array
    this.globalParticles.push(particles);

    //An array to store the angles
    let angles = [];

    //A variable to store the current particle's angle
    let angle;

    //Figure out by how many radians each particle should be separated
    let spacing = (maxAngle - minAngle) / (numberOfParticles - 1);

    //Create an angle value for each particle and push that //value into the `angles` array
    for(let i = 0; i < numberOfParticles; i++) {

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
    let makeParticle = (angle) => {
    
      //Create the particle using the supplied sprite function
      let particle = spriteFunction();

      //Display a random frame if the particle has more than 1 frame
      if (particle.totalFrames > 0) {
        particle.gotoAndStop(this.randomInt(0, particle.totalFrames - 1));
      }

      //Set a random width and height
      let size = this.randomInt(minSize, maxSize);
      particle.width = size;
      particle.height = size;

      //Set the particle's `anchor` to its center
      particle.anchor.set(0.5, 0.5);

      //Set the x and y position
      particle.x = x;
      particle.y = y;

      //Set a random speed to change the scale, alpha and rotation
      particle.scaleSpeed = this.randomFloat(minScaleSpeed, maxScaleSpeed);
      particle.alphaSpeed = this.randomFloat(minAlphaSpeed, maxAlphaSpeed);
      particle.rotationSpeed = this.randomFloat(minRotationSpeed, maxRotationSpeed);

      //Set a random velocity at which the particle should move
      let speed = this.randomFloat(minSpeed, maxSpeed);
      particle.vx = speed * Math.cos(angle);
      particle.vy = speed * Math.sin(angle);
      
      //Push the particle into the `particles` array.
      //The `particles` array needs to be updated by the game loop each frame particles.push(particle);
      particles.push(particle);

      //Add the particle to its parent container
      container.addChild(particle);

      //The particle's `updateParticle` method is called on each frame of the 
      //game loop
      particle.updateParticle = () => {

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
    angles.forEach(angle => makeParticle(angle));

    //Return the `particles` array back to the main program
    return particles;
  }

  //A particle emitter
  emitter(interval, particleFunction) {
    let emitter = {},
        timerInterval = undefined;

    emitter.playing = false;
  
    function play() {
      if (!emitter.playing) {
         particleFunction();
         timerInterval = setInterval(emitParticle.bind(this), interval);
         emitter.playing = true;
       }   
    }  

    function stop() {
      if (emitter.playing) {
        clearInterval(timerInterval);
        emitter.playing = false;
      }
    }

    function emitParticle() {
      particleFunction();
    }
    
    emitter.play = play;
    emitter.stop = stop;
    return emitter;
  }

  //A function to update the particles in the game loop
  update() {

    //Check so see if the `globalParticles` array contains any
    //sub-arrays
    if (this.globalParticles.length > 0) {

      //If it does, Loop through the particle arrays in reverse
      for(let i = this.globalParticles.length - 1; i >= 0; i--) {
        
        //Get the current particle sub-array
        let particles = this.globalParticles[i];

        //Loop through the `particles` sub-array and update the
        //all the particle sprites that it contains
        if (particles.length > 0) {
          for (let j = particles.length - 1; j >= 0; j--)  {
            let particle = particles[j];
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
}

