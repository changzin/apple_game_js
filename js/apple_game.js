let drag = false;
let startX, startY, endX, endY;
let canvasDrag, ctxDrag, canvasApple, ctxApple;
let apples = [];

const CONFIG = {
    canvasWidth: 600,
    canvasHeight: 400,
    appleWidth: 28,
    appleHeight: 28,
    appleGap: 34        
}

window.onload = ()=>{    
    canvasApple = document.getElementById("apple-game-background");
    ctxApple = canvasApple.getContext("2d");    
    canvasDrag = document.getElementById("apple-game");
    ctxDrag = canvasDrag.getContext("2d");    

    const map = makeMap(10, 17);    
    const images = initNumberImg()
    
    // 디스플레이 크기 설정 (css 픽셀)
    canvasApple.style.width = `${CONFIG.canvasWidth}px`;
    canvasApple.style.height = `${CONFIG.canvasHeight}px`;
    canvasDrag.style.width = `${CONFIG.canvasWidth}px`;
    canvasDrag.style.height = `${CONFIG.canvasHeight}px`;
    
    // 메모리에 실제 크기 설정 (픽셀 밀도를 고려하여 크기 조정)
    const dpr = window.devicePixelRatio;    
    canvasApple.width =  CONFIG.canvasWidth * dpr;
    canvasApple.height = CONFIG.canvasHeight * dpr;

    canvasDrag.width =  CONFIG.canvasWidth * dpr;
    canvasDrag.height = CONFIG.canvasHeight * dpr;
    
    // CSS에서 설정한 크기와 맞춰주기 위한 scale 조정
    ctxApple.scale(dpr, dpr);
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 17; j++){
            const number = map[i][j] + "";            
            drawImage(images[number], CONFIG.appleGap * j, CONFIG.appleGap * i, CONFIG.appleWidth, CONFIG.appleHeight);
            // 좌표 저장
            apples.push({
                x: (CONFIG.appleGap) * j + CONFIG.appleWidth / 2, 
                y: (CONFIG.appleGap) * i + CONFIG.appleHeight / 2 + 3
            });
        }
    }
    canvasDrag.onmousedown = onmousedown;
    canvasDrag.onmouseup = onmouseup;
    canvasDrag.onmousemove = onmousemove;
    canvasDrag.onmouseout = onmouseout;
}

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

function makeMap(height, width){
    let map = [];
    for(let i = 0; i < height; i++){
        map.push([]);
        for(let j = 0; j < width; j++){
            map[i].push(getRandomInt(1, 9));
        }
    }
    return map;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 마우스 드래스 시작 - 종료시 그려질 사각형 지우면서 사과쳌
function onmousedown(e) {
    e.preventDefault();
    e.stopPropagation();
    drag = true;

    const scaleX = canvasDrag.width / canvasDrag.getBoundingClientRect().width; // X 축 스케일 보정
    const scaleY = canvasDrag.height / canvasDrag.getBoundingClientRect().height; // Y 축 스케일 보정

    const mouseX = (e.clientX - canvasDrag.getBoundingClientRect().left) * scaleX; // 보정된 X 좌표
    const mouseY = (e.clientY - canvasDrag.getBoundingClientRect().top) * scaleY; // 보정된 Y 좌표

    startX = mouseX;
    startY = mouseY;    
}

function onmouseup(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!drag){
        return;
    }
    endX = e.pageX;
    endY = e.pageY;
    drag = false;
    ctxDrag.clearRect(0,0,ctxDrag.canvas.width,ctxDrag.canvas.height);
    //collapse check function
    checkApples(startX, startY, endX, endY);
}

function onmousemove(e) {
    //drag가 false 일때는 return(return 아래는 실행 안함)
    if (!drag) {
        return;
    }
    //마우스를 움직일 때마다 X좌표를 nowX에 담음
    //마우스를 움직일 때마다 Y좌표를 nowY에 담음

    const scaleX = canvasDrag.width / canvasDrag.getBoundingClientRect().width; // X 축 스케일 보정
    const scaleY = canvasDrag.height / canvasDrag.getBoundingClientRect().height; // Y 축 스케일 보정

    const mouseX = (e.clientX - canvasDrag.getBoundingClientRect().left) * scaleX; // 보정된 X 좌표
    const mouseY = (e.clientY - canvasDrag.getBoundingClientRect().top) * scaleY; // 보정된 Y 좌표

    canvasDraw (mouseX, mouseY);
}

function onmouseout(e){
    drag = false;
    ctxDrag.clearRect(0,0,ctxDrag.canvas.width,ctxDrag.canvas.height);
}

function canvasDraw(currentX,currentY) {
    ctxDrag.clearRect(0,0,ctxDrag.canvas.width,ctxDrag.canvas.height); //설정된 영역만큼 캔버스에서 지움
    ctxDrag.strokeRect(startX,startY,currentX-startX,currentY-startY); //시작점과 끝점의 좌표 정보로 사각형을 그려준다.
}

function checkApples(){
    for(let i = 0; i < apples.length; i++){
        const apple = apples[i];        
        if (Math.min(startX, endX) <= apple.x && Math.max(startX, endX) >= apple.x
        && Math.min(startY, endY) <= apple.y && Math.max(startY, endY) >= apple.y){
            // 충돌처리해야함
            console.log(apple);
        }

        /* 내일 없애야함, 점찍는코드 */
        ctxApple.beginPath();
        ctxApple.arc(apple.x, apple.y, 1, 0, 2*Math.PI);
        ctxApple.fillStyle = "black";
        ctxApple.fill();
    }
}