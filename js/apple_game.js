let drag = false;
let startX, startY, endX, endY;

window.onload = ()=>{
    const canvas = document.getElementById("apple-game");
    setCanvasAttr(canvas);

    var c = document.getElementById("apple-game-canvas");
    
    const map = makeMap(10, 17);
    
    const images2 = initNumberImg()
    
    const width = 1700;
    const height = 1000;
    // 디스플레이 크기 설정 (css 픽셀)
    c.style.width = `${width}px`;
    c.style.height = `${height}px`;
    
    // 메모리에 실제 크기 설정 (픽셀 밀도를 고려하여 크기 조정)
    const dpr = window.devicePixelRatio;
    
    c.width =  width * dpr;
    c.height = height * dpr;
    
    
    
    var ctx = c.getContext("2d");    
    // CSS에서 설정한 크기와 맞춰주기 위한 scale 조정
    ctx.scale(dpr, dpr);


    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 17; j++){
            const number = map[i][j] + "";            
            // canvas.innerHTML += images2[number];
            drawImage(ctx, images2[number], 34 * j, 34 * i, 28, 28);
        }
    }

    c.onmousedown = onmousedown;
    c.onmouseup = onmouseup;
    c.onmousemove = onmousemove;
    c.onmouseout = onmouseout;
}

function drawImage(ctx, imgPath, x, y, width, height) {
    const img = new Image();
    img.src = imgPath;
    img.onload = () =>{
        ctx.drawImage(img, x, y, width, height);
    }    
}



function setCanvasAttr(canvas){

}

function paintMap(map){
    
}

function paintApple(num){
    
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
    const images2 = {};
    for(let i = 0; i < imagesInfo.length; i++){
        const tag = `<img class="apple" src="${imagesInfo[i][0]}"/>`
        const name = imagesInfo[i][1];

        images[name] = tag;

        img = imagesInfo[i][0];        
        images2[name] = img;
    }
    return images2;    
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

function collisionDetection(rectA, ractB){
    let xValue = ractB.x - ( rectA.x + rectA.width );
    let yValue = ractB.y - ( rectA.y + rectA.height );
    if( xValue < 0 && yValue < 0 ){ // 충돌!
        // 충돌 시 실행되는 코드
    }
}


// 마우스 드래스 시작 - 종료시 그려질 사각형 지우면서 사과쳌
function onmousedown(e) {
    e.preventDefault();
    e.stopPropagation();
    drag = true;
    startX = e.clientX;
    startY = e.clientY;
}
function onmouseup(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!drag){
        return;
    }
    endX = e.clientX;
    endY = e.clientY;
    drag = false;
    //collapse check function
    //checkApplesCollapse(startX, startY, endX, endY);
}

function onmousemove(me) {
    //drag가 false 일때는 return(return 아래는 실행 안함)
    if (!drag) {
        return;
    }
    //마우스를 움직일 때마다 X좌표를 nowX에 담음
    var nowX = me.offsetX ;
    //마우스를 움직일 때마다 Y좌표를 nowY에 담음
    var nowY = me.offsetY ;
    //실질적으로 캔버스에 그림을 그리는 부분
    canvasDraw (nowX,nowY);
    //마우스가 움직일때마다 X좌표를 stX에 담음
    stX = nowX;
    //마우스가 움직일때마다 Y좌표를 stY에 담음
    stY = nowY;
}

function onmouseout(e){
    console.log("asdf");
    drag = false;
}

function canvasDraw(currentX,currentY) {
    var canvas = document.getElementById("apple-game-canvas");
    var ctx = canvas.getContext("2d");   
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height); //설정된 영역만큼 캔버스에서 지움
    ctx.strokeRect(startX,startY,currentX-startX,currentY-startY); //시작점과 끝점의 좌표 정보로 사각형을 그려준다.
}