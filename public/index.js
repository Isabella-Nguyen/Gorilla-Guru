const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext('2d');
//console.log(gsap);

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionsMap = [];
for (let i=0; i<collisions.length; i+=160){ // 160 tiles wide
    collisionsMap.push(collisions.slice(i, 160 + i));
}

const actionsMap = [];
for (let i=0; i<actionsData.length; i+=160){ // 70 tiles wide
    actionsMap.push(actionsData.slice(i, 160 + i));
}

const actionsMap2 = [];
for (let i=0; i<actionsData2.length; i+=160){ // 70 tiles wide
    actionsMap2.push(actionsData2.slice(i, 160 + i));
}

//console.log(actionsMap);


const boundaries = [];
const offset = {x: -300, y: -700};

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 14401){
            boundaries.push(
                new Boundary({
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                })
            )
        }
    })
})

const actions = []
actionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 14401){
            actions.push(
                new Boundary({
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                })
            )
        }
    })
})

const actions2 = []
actionsMap2.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol === 14401){
            actions2.push(
                new Boundary({
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                })
            )
        }
    })
})

//console.log(actionsMap);

//console.log(collisionsMap);

const floorImage = new Image();
floorImage.src = './img/gorilla-guru-map.png';

const playerDownImage = new Image();
playerDownImage.src = './img/GorillaGuru_frontWalk.png';

const playerUpImage = new Image();
playerUpImage.src = './img/GorillaGuru_backWalk.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/GorillaGuru_leftWalk.png';

const playerRightImage = new Image();
playerRightImage.src = './img/GorillaGuru_rightWalk.png';

const player = new Sprite({
        x: canvas.width / 2 - 192 / 4 / 2, // player is 192 x 68
        y: canvas.height / 2 - 68 / 2
    },
    playerDownImage,
    {max : 4},
    {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
)

const background = new Sprite(
    {x: offset.x, y: offset.y},
    floorImage
);

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    s: {
        pressed: false
    }
}

// for stuff that move with the background
const movables = [background, ...boundaries, ...actions, ...actions2];

function rectangularCollision({rectangle1, rectangle2}){
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

function changePageCheck(areas){
    for (let i=0; i<areas.length ; i++){
        const area = areas[i]

        if (rectangularCollision({
            rectangle1: player,
            rectangle2: area
        }))
            return true;
        }
        
        return false;
        
}


const whiteboard = {
    initiated: false
}

const chat = {
    initiated: false
}
function animate() {
    const animationId = window.requestAnimationFrame(animate);
    //console.log(animationId);
    background.draw();

    boundaries.forEach(boundary => {
        boundary.draw();
    })

    actions.forEach(action =>{
        action.draw();
    })

    actions2.forEach(action2 =>{
        action2.draw();
    })

    player.draw();

    let moving = true;
    player.moving = false;

    //activate whiteboard
    if (whiteboard.initiated) return;

    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        if(changePageCheck(actions))
        {
            window.cancelAnimationFrame(animationId);
            console.log('whiteboard initate');
            whiteboard.initiated = true;
            gsap.to('#overlappingDiv', {
                opacity: 1,
                onComplete() {
                    gsap.to('#whiteboard', {
                        visibility: 'visible'
                    })
                    gsap.to('#overlappingDiv', {
                        opacity: 0,
                    })
                }
            })
            
        }
        else if(changePageCheck(actions2)){
            console.log('chat initiate');
            chat.initiated = true;
            gsap.to('#hidden-container', {
                visibility: "visible",
            })
        }
    }

    if (keys.w.pressed && lastKey === 'w') {
        player.moving = true;
        player.image = player.sprites.up;

        for (let i=0; i<boundaries.length ; i++){
            const boundary = boundaries[i]

            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }}
            })
            ){
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
                movable.position.y += 3;
            })
        }
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.moving = true;
        player.image = player.sprites.left;

        for (let i=0; i<boundaries.length ; i++){
            const boundary = boundaries[i]

            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x + 3,
                    y: boundary.position.y
                }}
            })
            ){
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
                movable.position.x += 3;
           })
        }
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.moving = true;
        player.image = player.sprites.right;

        for (let i=0; i<boundaries.length ; i++){
            const boundary = boundaries[i]

            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x - 3,
                    y: boundary.position.y
                }}
            })
            ){
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
                movable.position.x -= 3;
            })
        }
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.moving = true;
        player.image = player.sprites.down;

        for (let i=0; i<boundaries.length ; i++){
            const boundary = boundaries[i]

            if (rectangularCollision({
                rectangle1: player,
                rectangle2: {...boundary, position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3
                }}
            })
            ){
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
                movable.position.y -= 3;
            })
        }
    }
}
animate()

function exitWhiteboard(){
    let exit = document.getElementById("whiteboard");
    exit.style.visibility = "hidden";
    whiteboard.initiated = false;
    movables.forEach((movable) => {
        movable.position.y -= 10;
    })
    animate();
}

let lastKey = ''
window.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        
    }
})

window.addEventListener('keyup', (e) => {
    switch(e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        
    }
})

var whiteboardCanvas = new fabric.Canvas('whiteboard_canvas');

whiteboardCanvas.isDrawingMode = true; //For free hand drawing

var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

var img = document.createElement('img');
img.src = deleteIcon;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';

function rectangle() {
    console.log("here");
    whiteboardCanvas.isDrawingMode = false;

    var rect = new fabric.Rect({
        left: 100,
        top: 50,
        fill: 'lightpink',
        width: 200,
        height: 100,
        objectCaching: false,
        stroke: 'lightblue',
        strokeWidth: 4,
    });

    whiteboardCanvas.add(rect);
    whiteboardCanvas.setActiveObject(rect);
}

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon,
    cornerSize: 24
});

function deleteObject() {
    whiteboardCanvas.remove(whiteboardCanvas.getActiveObject());
    whiteboardCanvas.requestRenderAll();
  }

function renderIcon(ctx, left, top, styleOverride, fabricObject) {
  var size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img, -size/2, -size/2, size, size);
  ctx.restore();
}

function draw() {
    whiteboardCanvas.isDrawingMode = true;
}

function select() {
    whiteboardCanvas.isDrawingMode = false;
}

function text() {
    select();
    var text = new fabric.Textbox( 
        'text here', {
        width: 100,
        fontSize: 20, 
        editable: true
    });

    whiteboardCanvas.add(text);
    whiteboardCanvas.centerObject(text);
}
