let board;
let boardWidth=360;
let boardHeight=640;
let context;

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let bird={
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}
let birdImg;

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

let velocityX = -2;
let velocityY = 0;
let gravity = 0.5;

let gameOver = false;
let score=0;

window.addEventListener("load",function(){
    board = document.querySelector("#canvas");
    board.width = boardWidth;
    board.height = boardHeight;

    context = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./images/flappybird.png";
    birdImg.addEventListener("load",function(){
        context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    })

    topPipeImg = new Image();
    topPipeImg.src = "./images/toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./images/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes,1500);
    document.addEventListener("click",moveBird);
    document.addEventListener("keydown",moveBird);
    document.addEventListener("touchstart",moveBird);
})

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,boardWidth,boardHeight);

    velocityY += gravity;
    bird.y = Math.max(bird.y+velocityY, 0);
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    if(bird.y>board.height){
        gameOver = true;
    }

    for(let i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;

        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed){
            if(bird.x > pipe.x+pipe.width){
                score += 0.5;
                pipe.passed = true;
            }
        }

        if(detectCollision(bird,pipe)){
            gameOver = true;
        }
    }

    while(pipeArray.length>0 && pipeArray[0].x< -pipeWidth){
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,50);
    if(gameOver){
        context.font = "30px 'Press Start 2P'";
        context.textAlign = "center";
        context.textBaseline ="middle";
        context.fillStyle = "#E61C17";
        context.fillText("Game Over",boardWidth/2,boardHeight/2);
    }
    
}

function placePipes(){
    if(gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*pipeHeight/2 ;
    let topPipe={
        img: topPipeImg,
        x:  pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }
    pipeArray.push(topPipe);

    let openingSpace = board.height/4;
    let bottomPipe={
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }
    pipeArray.push(bottomPipe);
} 

function moveBird(evt){
    if(evt.type==="keydown"){
        if(evt.code==="Space" || evt.code==="ArrowUp" || evt.code==="keyW"){
            jump();
        }
    }
    if(evt.type==="click"){
        jump();
    }
}
function jump(){
    velocityY = -7;
    
}
function detectCollision(b,p){
    return b.x < p.x + p.width &&
           b.x + b.width > p.x &&
           b.y  < p.y + p.height &&
           b.y + b.height > p.y;
}
