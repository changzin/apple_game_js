let drag = false;
let startX, startY, endX, endY;
let canvasDrag, ctxDrag, canvasApple, ctxApple, canvasBackground, ctxBackground;
let apples, score, prevScore, remainTime, totalTime, timer;

const CONFIG = {
    appleXCnt : 17,
    appleYCnt : 10,
    canvasWidth: 700,
    canvasHeight: 400,
    appleWidth: 28,
    appleHeight: 28,
    appleGap: 34,
    remainTime: 60000,
    totalTime: 60000    
}

window.onload = ()=>{    
    start();
}

// 페이지 로드 시 실행
function start() {    
    setCanvasAndApple();   // 캔버스 초기세팅

    // 첫 실행
    ctxDrag.fillStyle = "bisque";
    ctxDrag.fillRect(0,0,ctxDrag.canvas.width,ctxDrag.canvas.height);
    ctxDrag.fillStyle = "rgba(255, 69, 0, 1)";
    const startStr = "Click everywhere to start!";
    ctxDrag.font = "bold 40px malgun gothic";
    ctxDrag.fillText(startStr, CONFIG.canvasWidth / 7, CONFIG.canvasHeight / 2);

    // 클릭 시 게임 실행
    canvasDrag.onmousedown = gameStart;
}

// 게임 재시작
function gameStart(){
    // 사과 배열, 점수, 이전 점수, 시간 초기화
    apples = [];
    score = 0;
    prevScore = 0;
    remainTime = CONFIG.remainTime;
    totalTime = CONFIG.totalTime;    

    // 현재 캔버스 다 지우고
    ctxDrag.clearRect(0,0,ctxDrag.canvas.width,ctxDrag.canvas.height);
    ctxApple.clearRect(0,0,ctxDrag.canvas.width,ctxDrag.canvas.height);
    // 테두리
    ctxApple.strokeStyle = "rgba(255, 69, 0, 1)";
    ctxApple.strokeRect(CONFIG.canvasWidth - 80, CONFIG.canvasHeight - 50, 50, 30);
    ctxApple.fillStyle = "rgba(255, 69, 0, 1)";
    // 재도전 버튼
    ctxApple.font = "small-caps bold 12px malgun gothic";
    ctxApple.fillText("RETRY!", CONFIG.canvasWidth - 74, CONFIG.canvasHeight - 30);

    // 사과 배열 생성
    makeApples(CONFIG.appleYCnt, CONFIG.appleXCnt);    
    // 점수 그려주기
    drawScore();
    // 마우스 이벤트 연결
    setEventFunction();

    // 게임 타이머 : 진행 0.1초마다 실행
    timer = setInterval(updateProgress, 100);
}
function setCanvasAndApple(){
    canvasApple = document.getElementById("apple-game-apple");
    ctxApple = canvasApple.getContext("2d");    
    canvasDrag = document.getElementById("apple-game-drag");
    ctxDrag = canvasDrag.getContext("2d");    
    canvasBackground = document.getElementById("apple-game-background");
    ctxBackground = canvasBackground.getContext("2d");    

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
}
// 사과 그리기
function drawApple(num, x, y) {
    const img = new Image();
    img.src = `./img/${num}.svg`;
    img.onload = function(){
        ctxApple.drawImage(img, x, y, CONFIG.appleWidth, CONFIG.appleHeight);
    }
}
// 점수 그려주기
function drawScore(){
    ctxApple.font = "bold 20px malgun gothic";
    ctxApple.fillStyle = "rgba(255, 69, 0, 1)";
    ctxApple.fillText(score, CONFIG.canvasWidth-72, 60);
}
// 사과 배열 생성
function makeApples(height, width){
    apples = [];
    for(let i = 0; i < height; i++){
        apples.push([])
        for(let j = 0; j < width; j++){
            const num = Math.floor(Math.random() * 9 + 1);
            const x = CONFIG.appleGap * j + 28;
            const y = CONFIG.appleGap * i + 31;
            // 좌표 저장
            apples[i].push({
                num: num,
                x: x,
                y: y,
                centerX: (CONFIG.appleGap * j) + CONFIG.appleWidth + CONFIG.appleWidth / 2,
                centerY: (CONFIG.appleGap * i) + CONFIG.appleHeight + 3 + CONFIG.appleHeight / 2,
                appleChecked: false
            });
            drawApple(num, x, y);
        }
    }
}

// 마우스 드래스 시작 - 종료시 그려질 사각형 지우면서 사과쳌
function onmousedown(e) {
    e.preventDefault();
    e.stopPropagation();
    drag = true;    
    startX = e.offsetX;    
    startY = e.offsetY;

    // 재시작 버튼
    if (CONFIG.canvasWidth - 80 <= startX && CONFIG.canvasWidth - 80 + 50 >= startX
            && CONFIG.canvasHeight - 50 <= startY && CONFIG.canvasHeight - 50 + 30 >= startY
            ){
                gameStart();
    }
}

// 마우스를 뗏을 때
function onmouseup(e) {
    e.preventDefault();
    e.stopPropagation();

    // 드래그 상태가 아니라면 리턴
    if (drag == false){
        return;
    }
    
    // 드래그 상태 종료, 드래그 박스 지우기
    drag = false;
    ctxDrag.clearRect(0,0,ctxDrag.canvas.width,ctxDrag.canvas.height);

    // 마우스 위치 저장하고 드래그 한 사과들과 점수 체크
    endX = e.offsetX;    
    endY = e.offsetY;
    if(checkSum() == true){
        clearApplesUpdateScore();
    }
}

//마우스가 움직일 때
function onmousemove(e) {
    //드래그 상태가 아닐때는 리턴
    if (drag == false) {
        return;
    }

    // 드래그 상태라면 드래그 박스를 그려줌
    const nowX = e.offsetX;
    const nowY = e.offsetY;
    canvasDraw(nowX, nowY);
}

// 마우스가 캔버스 바깥으로 나갔을 때
function onmouseout(e){
    drag = false;
    ctxDrag.clearRect(0, 0, ctxDrag.canvas.width, ctxDrag.canvas.height);
}

// 드래그 박스 그려주기
function canvasDraw(currentX,currentY) {
    ctxDrag.clearRect(0, 0, ctxDrag.canvas.width, ctxDrag.canvas.height); //설정된 영역만큼 캔버스에서 지움
    ctxDrag.strokeStyle = "red";
    ctxDrag.strokeRect(startX, startY, currentX-startX, currentY-startY); //시작점과 끝점의 좌표 정보로 사각형을 그려준다.
}

// 드래그 된 사과 합 계산
function checkSum(){
    let sum = 0;
    for(let i = 0; i < CONFIG.appleYCnt; i++){
        for(let j = 0; j < CONFIG.appleXCnt; j++){            
            const apple = apples[i][j];   
            if (Math.min(startX, endX) <= apple.centerX && Math.max(startX, endX) >= apple.centerX
            && Math.min(startY, endY) <= apple.centerY && Math.max(startY, endY) >= apple.centerY
            && !apple.appleChecked){
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

// 드래그 된 사과를 지우고, 지운 사과만큼 점수 올려주기
function clearApplesUpdateScore(){
    for(let i = 0; i < CONFIG.appleYCnt; i++){
        for(let j = 0; j < CONFIG.appleXCnt; j++){
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

// 시간 제한이  끝났을 때
function endTime() {    
    clearInterval(timer); // 타이머 클리어

    //화면구성
    ctxDrag.clearRect(0,0,ctxDrag.canvas.width,ctxDrag.canvas.height);
    ctxApple.clearRect(0,0,ctxDrag.canvas.width,ctxDrag.canvas.height);
    const scoreStr = `Your got ${score} score..`
    const retryStr = 'click screen to Retry'
    ctxDrag.font = "bold 50px malgun gothic";
    ctxDrag.fillText(scoreStr, CONFIG.canvasWidth / 5, CONFIG.canvasHeight / 2);
    ctxDrag.font = "bold 30px malgun gothic";
    ctxDrag.fillText(retryStr, CONFIG.canvasWidth / 3.5, CONFIG.canvasHeight / 2 + 50);

    //클릭하면 재시작하도록 마우스 이벤트 세팅
    canvasDrag.onmousedown = gameStart;
    canvasDrag.onmouseup = null;
    canvasDrag.onmousemove = null;
    canvasDrag.onmouseout = null;
}



//  시간 진행바 계산
function updateProgress() {
    remainTime -= 100;
    const ratio =  remainTime / totalTime;
    ctxApple.clearRect(CONFIG.canvasWidth-78, CONFIG.canvasHeight - 60, 50, -260);
    ctxApple.fillStyle = "rgba(255, 69, 0, 1)";
    ctxApple.fillRect(CONFIG.canvasWidth-72, CONFIG.canvasHeight - 60, 34, -ratio*260);

    
    if (score != prevScore){        
        // 점수
        ctxApple.font = "bold 20px malgun gothic";
        ctxApple.fillStyle = "rgba(255, 69, 0, 1)";
        ctxApple.clearRect(CONFIG.canvasWidth-80, 40, 50, 30);
        ctxApple.fillText(score, CONFIG.canvasWidth-72, 60);
        prevScore = score;
    }

    // 시간 완료시 호출 콜백
    if(remainTime <= 0) {
        endTime();        
    }
}


// 이벤트 함수 연결
function setEventFunction() {
    canvasDrag.onmousedown = onmousedown;
    canvasDrag.onmouseup = onmouseup;
    canvasDrag.onmousemove = onmousemove;
    canvasDrag.onmouseout = onmouseout;
}