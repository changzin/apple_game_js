let drag = false;
let startX, startY, endX, endY;
let canvasDrag, ctxDrag, canvasApple, ctxApple, canvasBackground, ctxBackground;
let apples = [];
let score = 0;
let remainTime = 60000;
let totalTime = 60000;
let timer;

const CONFIG = {
    appleXnum : 17,
    appleYnum : 10,
    canvasWidth: 700,
    canvasHeight: 400,
    appleWidth: 28,
    appleHeight: 28,
    appleGap: 34,
    mouseOffsetX: 0,
    mouseOffsetY: 0,    
}

function endTime() {
    console.log("시간 완료");
}

//  시간 진행바 계산
function updateProgress() {
    remainTime -= 100;
    const ratio =  remainTime / totalTime;
    
    ctxApple.clearRect(CONFIG.canvasWidth-70, CONFIG.canvasHeight - 60, 34, -250);
    ctxApple.strokeRect(CONFIG.canvasWidth-68, CONFIG.canvasHeight - 60, 30, -ratio*250);

    // 시간 완료시 호출 콜백
    if(remainTime <= 0) {
        clearInterval(timer);
        endTime();
    }
}

window.onload = ()=>{    
    initSetting(); 
   
    // 진행 0.1초마다 실행
    timer = setInterval(updateProgress, 100);
    
    // 점수
    ctxApple.font = "bold 20px malgun gothic";
    ctxApple.fillStyle = "rgba(255, 69, 0, 1)";
    ctxApple.fillText("60", CONFIG.canvasWidth-68, 60);
}

// 이벤트 함수 연결
function setEventFunction() {
    canvasDrag.onmousedown = onmousedown;
    canvasDrag.onmouseup = onmouseup;
    canvasDrag.onmousemove = onmousemove;
    canvasDrag.onmouseout = onmouseout;
}

function initSetting(){
    canvasApple = document.getElementById("apple-game-apple");
    ctxApple = canvasApple.getContext("2d");    
    canvasDrag = document.getElementById("apple-game-drag");
    ctxDrag = canvasDrag.getContext("2d");    
    canvasBackground = document.getElementById("apple-game-background");
    ctxBackground = canvasBackground.getContext("2d");    

    makeApples(CONFIG.appleYnum, CONFIG.appleXnum);    
    // 디스플레이 크기 설정 (css 픽셀)
    canvasApple.style.width = `${CONFIG.canvasWidth}px`;
    canvasApple.style.height = `${CONFIG.canvasHeight}px`;
    canvasDrag.style.width = `${CONFIG.canvasWidth}px`;
    canvasDrag.style.height = `${CONFIG.canvasHeight}px`;
    canvasBackground.style.width = `${CONFIG.canvasWidth}px`;
    canvasBackground.style.height = `${CONFIG.canvasHeight}px`;
    
    // 메모리에 실제 크기 설정 (픽셀 밀도를 고려하여 크기 조정)
    const dpr = window.devicePixelRatio;    
    canvasApple.width =  CONFIG.canvasWidth * dpr;
    canvasApple.height = CONFIG.canvasHeight * dpr;
    canvasDrag.width =  CONFIG.canvasWidth * dpr;
    canvasDrag.height = CONFIG.canvasHeight * dpr;
    canvasBackground.width =  CONFIG.canvasWidth * dpr;
    canvasBackground.height = CONFIG.canvasHeight * dpr;
    
    // CSS에서 설정한 크기와 맞춰주기 위한 scale 조정
    ctxApple.scale(dpr, dpr);
    ctxDrag.scale(dpr, dpr);
    ctxBackground.scale(dpr, dpr);

    // mouse Offset 조절
    /**
     * canvas 내에선 상대좌표로 그림
     * 마우스 좌표는 항상 절대좌표
     * >> 거거를 개선하기 위한 OFFSET임
     */    
    CONFIG.mouseOffsetY = window.scrollY + canvasApple.getBoundingClientRect().top - CONFIG.appleHeight;
    CONFIG.mouseOffsetX = window.scrollX + canvasApple.getBoundingClientRect().left;

    const images = initNumberImg();  
    drawApples(images);

    setEventFunction();
}

// 게임 초기 모든 사과를 그림
function drawApples(images) {
    for(let i = 0; i < CONFIG.appleYnum; i++){
        for(let j = 0; j < CONFIG.appleXnum; j++){
            const number = apples[i][j].num + "";            
            drawImage(images[number], CONFIG.appleGap * j + CONFIG.appleWidth, CONFIG.appleGap * i + CONFIG.appleHeight, CONFIG.appleWidth, CONFIG.appleHeight);            
        }
    }
}

// 이미지 그림
function drawImage(imgPath, x, y, width, height) {
    const img = new Image();
    img.src = imgPath;
    img.onload = () =>{
        ctxApple.drawImage(img, x, y, width, height);
    }    
}

function initNumberImg(){
    const imagesInfo = [
        ["./img/1.svg", "1"],
        ["./img/2.svg", "2"],
        ["./img/3.svg", "3"],
        ["./img/4.svg", "4"],
        ["./img/5.svg", "5"],
        ["./img/6.svg", "6"],
        ["./img/7.svg", "7"],
        ["./img/8.svg", "8"],
        ["./img/9.svg", "9"]
    ];
    const images = {};
    for(let i = 0; i < imagesInfo.length; i++){
        const name = imagesInfo[i][1];
        img = imagesInfo[i][0];        
        images[name] = img;
    }
    return images;    
}

function makeApples(height, width){
    apples = [];
    for(let i = 0; i < height; i++){
        apples.push([])
        for(let j = 0; j < width; j++){
            const num = getRandomInt(1, 9);
            // 좌표 저장
            apples[i].push({
                num: num,
                x: (CONFIG.appleGap) * j + CONFIG.appleWidth, 
                y: (CONFIG.appleGap) * i + CONFIG.appleHeight,
                centerX: (CONFIG.appleGap) * j + CONFIG.appleWidth / 2 + CONFIG.appleWidth,
                centerY: (CONFIG.appleGap) * i + CONFIG.appleHeight / 2 + 3 + CONFIG.appleHeight,
                appleChecked: false
            });
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 마우스 드래스 시작 - 종료시 그려질 사각형 지우면서 사과쳌
function onmousedown(e) {
    e.preventDefault();
    e.stopPropagation();
    drag = true;
    startX = e.clientX - CONFIG.mouseOffsetX;    
    startY = e.clientY - CONFIG.mouseOffsetY;
}

function onmouseup(e) {
    e.preventDefault();
    e.stopPropagation();
    if (drag == false){
        return;
    }
    
    endX = e.clientX - CONFIG.mouseOffsetX;
    endY = e.clientY - CONFIG.mouseOffsetY;

    drag = false;
    ctxDrag.clearRect(0,0,ctxDrag.canvas.width,ctxDrag.canvas.height);
    //collapse check function
    if(checkSum() == true){
        clearApples();
    }
}

function onmousemove(e) {
    //drag가 false 일때는 return(return 아래는 실행 안함)
    if (drag == false) {
        return;
    }
    const nowX = e.clientX - CONFIG.mouseOffsetX
    const nowY = e.clientY - CONFIG.mouseOffsetY    
    canvasDraw(nowX, nowY);
}

function onmouseout(e){
    drag = false;
    ctxDrag.clearRect(0, 0, ctxDrag.canvas.width, ctxDrag.canvas.height);
}

function canvasDraw(currentX,currentY) {
    ctxDrag.clearRect(0, 0, ctxDrag.canvas.width, ctxDrag.canvas.height); //설정된 영역만큼 캔버스에서 지움
    ctxDrag.strokeRect(startX, startY, currentX-startX, currentY-startY); //시작점과 끝점의 좌표 정보로 사각형을 그려준다.
}

function checkSum(){
    let sum = 0;
    for(let i = 0; i < CONFIG.appleYnum; i++){
        for(let j = 0; j < CONFIG.appleXnum; j++){
            const apple = apples[i][j];   
            if (Math.min(startX, endX) <= apple.centerX && Math.max(startX, endX) >= apple.centerX
            && Math.min(startY, endY) <= apple.centerY && Math.max(startY, endY) >= apple.centerY
            && !apple.appleChecked){
                console.log(apple);
                sum += apple.num;
            }
        }
    }
    if (sum == 10){
        return true;
    }
    else{
        return false;
    }
}

function clearApples(){
    for(let i = 0; i < CONFIG.appleYnum; i++){
        for(let j = 0; j < CONFIG.appleXnum; j++){
            const apple = apples[i][j];   
            if (Math.min(startX, endX) <= apple.centerX && Math.max(startX, endX) >= apple.centerX
            && Math.min(startY, endY) <= apple.centerY && Math.max(startY, endY) >= apple.centerY
            && !apple.appleChecked){
                ctxApple.clearRect(apple.x , apple.y, CONFIG.appleWidth, CONFIG.appleHeight);
                apple.appleChecked = true;
                score++;
            }
        }
    }
}


