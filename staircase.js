////////////////////////////////////////////////////////////////////////////////
// Staircase exercise                                                         //
// Your task is to complete the model for simple stairs                       //
// Using the provided sizes and colors, complete the staircase                //
// and reach the Gold Cup!                                                    //
////////////////////////////////////////////////////////////////////////////////
/*global, THREE, Coordinates, $, document, window, dat*/

var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = false;
var ground = true;

function createStairs() {

	// MATERIALS
	stepWidth = 500;
	stepSize = 200;
	stepThickness = 50;
	// height from top of one step to bottom of next step up
	verticalStepHeight = stepSize;
	horizontalStepDepth = stepSize*2;

	stepHalfThickness = stepThickness/2;
	
	// +Y direction is up
	// Define the two pieces of the step, vertical and horizontal
	// THREE.CubeGeometry takes (width, height, depth)
	stepVertical = new THREE.CubeGeometry(stepWidth, verticalStepHeight, stepThickness);
	stepHorizontal = new THREE.CubeGeometry(stepWidth, stepThickness, horizontalStepDepth);
	var stepMesh;
    var newY = 0;
    var newX = 0;
    var newZ = 0;
    var newZVertical=0;
     counter = 0;
    
    while ( newY < 1225){      

    	makeVertical(newX, newY, newZ);
    	makeHorozontal(newX,newY, newZ);
        newX += stepSize;
        newY += verticalStepHeight;
        counter +=1;
        
    }
	
}
var makeVertical = function (newX, newY, newZ){
		var stepMaterialVertical = new THREE.MeshLambertMaterial( { 
		color: 0xA85F35 
		} );
        // Make and position the vertical part of the step
        stepMesh = new THREE.Mesh( stepVertical, stepMaterialVertical );
        // The position is where the center of the block will be put.
        // You can define position as THREE.Vector3(x, y, z) or in the following way:
        stepMesh.position.x = 0;			// centered at origin
        stepMesh.position.y = verticalStepHeight/2 + newY + stepThickness ;// half of height: put it above ground plane
        stepMesh.position.z = newZ + counter * stepSize*2;			
        scene.add( stepMesh );
    }
var makeHorozontal = function (newX, newY, newZ){
	var stepMaterialHorizontal = new THREE.MeshLambertMaterial( { 
		color: 0xBC7349 
	});
	 // Make and position the horizontal part
    stepMesh = new THREE.Mesh( stepHorizontal, stepMaterialHorizontal );
    stepMesh.position.x = 0;
    // Push up by half of horizontal step's height, plus vertical step's height
    stepMesh.position.y = newY + stepThickness + verticalStepHeight  + 25;
    // Push step forward by half the depth, minus half the vertical step's thickness
    stepMesh.position.z = newZ + (counter * stepSize*2) + (stepWidth/2) - stepThickness - 25;
    scene.add( stepMesh );
}

function createCup() {
	var cupMaterial = new THREE.MeshLambertMaterial( { color: 0xFDD017});
	// THREE.CylinderGeometry takes (radiusTop, radiusBottom, height, segmentsRadius)
	var cupGeo = new THREE.CylinderGeometry( 200, 50, 400, 32 );
	var cup = new THREE.Mesh( cupGeo, cupMaterial );
	cup.position.x = 0;
	cup.position.y = 1725;
	cup.position.z = 2900;
	scene.add( cup );
	cupGeo = new THREE.CylinderGeometry( 100, 100, 50, 32 );
	cup = new THREE.Mesh( cupGeo, cupMaterial );
	cup.position.x = 0;
	cup.position.y = 1525;
	cup.position.z = 2900;
	scene.add( cup );
}

function init() {
	var canvasWidth = 846;
	var canvasHeight = 494;
	var canvasRatio = canvasWidth / canvasHeight;

	// RENDERER
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	renderer.setSize(canvasWidth, canvasHeight);
	renderer.setClearColorHex( 0xAAAAAA, 1.0 );

	// CAMERA
	camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 40000 );
	camera.position.set( -700, 500, -1600 );
	// CONTROLS
	cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
	cameraControls.target.set(0,600,0);

	// Camera(2) for testing has following values:
	// camera.position.set( 1225, 2113, 1814 );
	// cameraControls.target.set(-1800,180,630);
  
	fillScene();
}
function addToDOM() {
    var container = document.getElementById('container');
    var canvas = container.getElementsByTagName('canvas');
    if (canvas.length>0) {
        container.removeChild(canvas[0]);
    }
    container.appendChild( renderer.domElement );
}
function fillScene() {
	// SCENE
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x808080, 3000, 6000 );
	// LIGHTS
	var ambientLight = new THREE.AmbientLight( 0x222222 );
	var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
	light.position.set( 200, 400, 500 );
	
	var light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
	light2.position.set( -400, 200, -300 );

	scene.add(ambientLight);
	scene.add(light);
	scene.add(light2);

	scene.add(camera);

	if (ground) {
		Coordinates.drawGround({size:1000});		
	}
	if (gridX) {
		Coordinates.drawGrid({size:1000,scale:0.01});
	}
	if (gridY) {
		Coordinates.drawGrid({size:1000,scale:0.01, orientation:"y"});
	}
	if (gridZ) {
		Coordinates.drawGrid({size:1000,scale:0.01, orientation:"z"});	
	}
	if (axes) {
		Coordinates.drawAllAxes({axisLength:300,axisRadius:2,axisTess:50});
	}
	createCup();
	var stairs = createStairs();
	scene.add(stairs);
}
//

function animate() {
	window.requestAnimationFrame(animate);
	render();
}

function render() {
	var delta = clock.getDelta();
	cameraControls.update(delta);
	if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes)
	{
		gridX = effectController.newGridX;
		gridY = effectController.newGridY;
		gridZ = effectController.newGridZ;
		ground = effectController.newGround;
		axes = effectController.newAxes;

		fillScene();
	}
	renderer.render(scene, camera);
}

function setupGui() {

	effectController = {
	
		newGridX: gridX,
		newGridY: gridY,
		newGridZ: gridZ,
		newGround: ground,
		newAxes: axes,

		dummy: function() {
		}
	};

	var gui = new dat.GUI();
	gui.add(effectController, "newGridX").name("Show XZ grid");
	gui.add( effectController, "newGridY" ).name("Show YZ grid");
	gui.add( effectController, "newGridZ" ).name("Show XY grid");
	gui.add( effectController, "newGround" ).name("Show ground");
	gui.add( effectController, "newAxes" ).name("Show axes");
}
$(document).ready(function(){
	init();
	addToDOM();
	setupGui();
	animate();
});