window.onload = ()=>{
    const canvas = document.getElementById("apple-game");
    setCanvasAttr(canvas);
    
    const map = makeMap(10, 17);

    const images = initNumberImg()

    console.log(images);

    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 17; j++){
            const number = map[i][j] + "";
            
            canvas.innerHTML += images[number];
        }
    }

    
    // window.document.body.append(oneSvg);
}


function setCanvasAttr(canvas){

}

function paintMap(map){
    
}

function paintApple(num){
    
}

function initNumberImg(){
    const imagesInfo = [
        ["/img/1.svg", "1"],
        ["/img/2.svg", "2"],
        ["/img/3.svg", "3"],
        ["/img/4.svg", "4"],
        ["/img/5.svg", "5"],
        ["/img/6.svg", "6"],
        ["/img/7.svg", "7"],
        ["/img/8.svg", "8"],
        ["/img/9.svg", "9"]
    ];
    
    const images = {};
    for(let i = 0; i < imagesInfo.length; i++){
        const tag = `<img src="${imagesInfo[i][0]}"/>`
        const name = imagesInfo[i][1];

        images[name] = tag;
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