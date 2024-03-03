const canvas = document.querySelector('canvas');
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
const offset = {x: -745, y: -630};

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
            actions.push(
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
playerDownImage.src = './img/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';

const foregroundImage = new Image(); // for the parts where the player goes behind
foregroundImage.src = './img/foregroundObjects.png';

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

const foreground = new Sprite(
    {x: offset.x, y: offset.y},
    foregroundImage
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
const movables = [background, ...boundaries, foreground, ...actions, ...actions2];

function rectangularCollision({rectangle1, rectangle2}){
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y)
}

function changePageCheck(actions){
    for (let i=0; i<actions.length ; i++){
        const action = actions[i]
        // const overlappingArea = 
        // (Math.min(
        //     player.position.x + player.width,
        //     action.position.x + action.width
        //   ) -
        //     Math.max(player.position.x, action.position.x)) *
        //   (Math.min(
        //     player.position.y + player.height,
        //     action.position.y + action.height
        //   ) -
        //     Math.max(player.position.y, action.position.y))

        if (rectangularCollision({
            rectangle1: player,
            rectangle2: action
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
    foreground.draw();

    let moving = true;
    player.moving = false;

    //activate whiteboard
    if (whiteboard.initiated) return;

    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
        if(changePageCheck(actions))
        {
            console.log('whiteboard initate');
            whiteboard.initiated = true;
            gsap.to('#overlappingDiv', {
                opacity: 1,
            })
        }
        else if(changePageCheck(actions2)){
            console.log('chat initiate');
            chat.initiated = true;
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
