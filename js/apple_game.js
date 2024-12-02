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