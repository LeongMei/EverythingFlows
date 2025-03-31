let particles, sliders, sound, FFT, m, n, v, N, monoSynth, img;
var index=0;



//var lastindex=0;
//var notes = ['A3','E3','B2','C2','G2','C3','D3','E4','Fb4','G4'];
var notes = [
['G3',1,5,0.05],
['C3',3,4,0.06],
['C3',10,1,0.06],
['G3',8,3,0.08],
['F3',7,3,0.06],
['Ab',10,6,0.06],
['G5',9,5,0.05],
['Fb',10,4,0.06],
['E4',7,6,0.06],
['C4',9,4,0.04],
['Bb4',3,4,0.06],
['F4',10,2,0.06],
['G4',7,10,0.06],
['F4',7,1,0.1],
['C4',8,10,0.03],
['G4',10,1,0.06],
['C4',9,5,0.05],
['C4',2,8,0.1],
['E4',10,4,0.06],
['C4',10,2,0.06],
['G4',2,5,0.1],
['C5',10,5,0.04],
['E4',7,9,0.06]];
var lastindex=0;
/*array values m,n,v*/

// chladni frequency params
let a=1, b=1;
// vibration strength params
let A = 04;
let minWalk = 0.002;
//x = 0 initialisation, boolean expression


//y loop



const settings = {
  nParticles : 10000,
  canvasPosition : [300, 300],//
  heatmap: false,
}
  
const pi = 3.1415926535;

// chladni 2D closed-form solution - returns between -1 and 1
const chladni = (x, y, a, b, m, n) => 
  a * sin(pi*n*x) * sin(pi*m*y) 
+ b * sin(pi*m*x) * sin(pi*n*y);



/* Initialization */

const DOMinit = () => 
  {
    
    let dim = Math.min(windowWidth*0.666,windowHeight*0.666);
    /*smallest value either window width or height 75 percent*/
    let canvas = createCanvas(dim,dim);
    var x = (windowWidth - width)/2+10;
    var y = (windowHeight - height)/2+120;
    canvas.position(x,y);
    //canvas.Center();
    /*/let canvas = createCanvas(...settings.canvasPosition);*/
    /* sliders*/
     /* sliders =
      {
       // m : select('#mSlider'), // freq param 1
       // n : select('#nSlider'), // freq param 2
       v : select('#vSlider'), // velocity
    
        num : select('#numSlider'), // number
        //sound : select('#soundSlider')//
      }*/
  }
 
  
  /* particle array*/
const setupParticles = () => 
  {
  particles = [];
      for (let i = 0; i < settings.nParticles; i++)
      {
        particles[i] = new Particle();
      }
  }


/* Particle dynamics */
class Particle 
{
  constructor() 
  {
    this.x = random(0,1);
    this.y = random(0,1);
    this.stochasticAmplitude;
    this.color = [random(0,200), random(0,250), random(0,200)];
    this.updateOffsets();
  }

  move() 
  {
    // what is our chladni value i.e. how much are we vibrating? (between -1 and 1, zeroes are nodes)
    // set the amplitude of the move -> proportional to the vibration
    let eq = chladni(this.x, this.y, a, b, m, n);
    this.stochasticAmplitude = v * abs(eq);
    if (this.stochasticAmplitude <= minWalk) this.stochasticAmplitude = minWalk;// perform one random walk
    this.x += random(-this.stochasticAmplitude, this.stochasticAmplitude);
    this.y += random(-this.stochasticAmplitude, this.stochasticAmplitude);
    this.updateOffsets();
  }
  
  updateOffsets() 
  {
    // handle edges
    if (this.x <= 0) this.x = 0;
    if (this.x >= 1) this.x = 1;
    if (this.y <= 0) this.y = 0;
    if (this.y >= 1) this.y = 1;
    // convert to screen space
    this.xOff = width * this.x; // (this.x + 1) / 2 * width;
    this.yOff = height * this.y; // (this.y + 1) / 2 * height;
  }
  
  show() 
  {
    stroke(...this.color);
    strokeWeight(3);
    point(this.xOff, this.yOff)
   }
}

const moveParticles = () => 
{
  let movingParticles = particles.slice(0, N);
  // particle movement
  for(let particle of movingParticles) 
  {
    particle.move();
    particle.show();
  }
}

const updateParams = () => 
{
  var offsetX = (windowWidth - width)/2;
     
  index = Math.max(0,int(map(mouseX,-offsetX,windowWidth,0,22)));
  console.log(index);
  textSize(30);
  text(140,100);
  // m = sliders.m.value();
  //n = sliders.n.value();m
  //v = 0.06;
  N = 8000;
  //S = sliders.sound.value();
    m = int(notes[index][1]);
    n = int(notes[index][2]);
    v = notes[index][3];
}

function windowResized() {
    let dim = Math.min(windowWidth*0.75,windowHeight*0.75);
    /*smallest value either window width or height 75 percent*/
    let canvas = createCanvas(dim,dim);
    var x = (windowWidth - width)/2;
    var y = (windowHeight - height)/2;
    canvas.position(x,y);
    resizeCanvas(dim, dim);
}

const wipeScreen = () => 
{
  background(10,10,10);
  stroke(255);
}



/* Timing */
// run at DOM load

function setup() 
{
DOMinit();
  setupParticles();
  
  fft =new p5.FFT(0,256);
  monoSynth = new p5.MonoSynth();
  userStartAudio();
}

// run each frame
function mouseDragged()
{
  //var i = int(map(mouseX,0,windowWidth,0,10));//

  
  monoSynth.play(notes[index][0]);
  

  //monoSynth.play(notes[S][0],1/4);//
}


function draw() 
{
  cursor('mouse3.png'); 
  fill(233,233,100);



  wipeScreen();
  updateParams();
  moveParticles();
  //strokeWeight(3);
  //stroke(255,129,0);
  //fill(10,10,10,10);
  //square(mouseX, mouseY,15);
  //  var i = int(map(mouseX,0,windowWidth,0,10));

  //text(i,200,300);//
  
 // monoSynth.play(notes[i][0],1/4);//
  
  //fill(255,0,0);
 // text(m,200,200);
 
  //fill(255,152,0);
  //text (n,200,240);
  
  //fill(200,152,0);
  //text (v,200,280);//
}
