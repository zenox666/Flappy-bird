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

})

function update(){
    requestAnimationFrame(update);
    context.clearRect(0,0,boardWidth,boardHeight);

    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    for(let i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
    }
}

function placePipes(){
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
