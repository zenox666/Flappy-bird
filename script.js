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
let birdImgs=[];
let birdImgsIndex=0;


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

let marioAudio;
marioAudio = new Audio("sounds/bgm_mario.mp3");
marioAudio.loop = true;

window.addEventListener("load",function(){
    board = document.querySelector("#canvas");
    board.width = boardWidth;
    board.height = boardHeight;

    context = board.getContext("2d");

    for(let i=0;i<4;i++){
        let birdImg = new Image();
        birdImg.src = "images/flappybird"+i+".png";
        birdImgs.push(birdImg);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./images/toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./images/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes,1500);
    setInterval(animateBird,100);

    document.addEventListener("click",moveBird);
    document.addEventListener("keydown",moveBird);
    document.addEventListener("touchstart",moveBird);
    
    marioAudio.play();
})

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,boardWidth,boardHeight);

    velocityY += gravity;
    bird.y = Math.max(bird.y+velocityY, 0);
    context.drawImage(birdImgs[birdImgsIndex],bird.x,bird.y,bird.width,bird.height);


    if(bird.y>board.height){
        playSound("die");
        gameOver = true;
    }

    for(let i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;

        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed){
            if(bird.x > pipe.x+pipe.width){
                score += 0.5;
                playSound("point");
                pipe.passed = true;
            }
        }

        if(detectCollision(bird,pipe)){
            playSound("hit");
            gameOver = true;
        }
    }

    while(pipeArray.length>0 && pipeArray[0].x< -pipeWidth){
        pipeArray.shift();
    }

    context.save();
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.textAlign="left";
    context.textBaseline="top";
    context.fillText(score,10,10);
    context.restore();
    if(gameOver){
        context.font = "30px 'Press Start 2P'";
        context.textAlign = "center";
        context.textBaseline ="middle";
        context.fillStyle = "white";
        context.fillText("Game Over",boardWidth/2,boardHeight/2);

        marioAudio.pause();
        marioAudio.currentTime=0;
    }   
    
}

function animateBird(){
    birdImgsIndex++;
    birdImgsIndex = birdImgsIndex % birdImgs.length;
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
        if(evt.code==="Space" || evt.code==="ArrowUp"){
            if(marioAudio.paused){
                marioAudio.play();
            }
            playSound("wing");
            velocityY = -7;
            if(gameOver){
                restart();
            }
        }
    }
    if(evt.type==="click"){
        if(marioAudio.paused){
            marioAudio.play();
        }
        playSound("wing");
        velocityY = -7;
        if(gameOver){
            restart();
        }
    }
}

function detectCollision(b,p){
    return b.x < p.x + p.width &&
           b.x + b.width > p.x &&
           b.y  < p.y + p.height &&
           b.y + b.height > p.y;
}

function playSound(name){
    var audio = new Audio("sounds/"+name+".mp3");
    audio.play();
}

function restart(){
    bird.y =birdY;
    pipeArray = [];
    score =0;
    gameOver = false;
}

