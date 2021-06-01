const generateButton = document.getElementById("generateBtn");
const clearCan = document.getElementById("clearCan");

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 700;

const mouse = createMouse(canvas);


generateButton.addEventListener("click", function() {
    let clustersCount = document.getElementById("numOfClast").value;
    clustersCount > 0 ? clustWithK(clustersCount): clustWithoutK();

    clearCanvas();
    drawPoints(points);
});

clearCan.addEventListener("click", function() {
    clearCanvas();
    points = []
});

canvas.addEventListener("contextmenu", ev => {
    ev.preventDefault();
});

let ifdraw = false;
canvas.addEventListener('mousedown',function(e){
    ifdraw = true;
    addPoint(e);
});

canvas.addEventListener('mousemove',function(e){
    if(ifdraw == true){
    addPoint(e);
    }
});
document.addEventListener('mouseup', function(e){
    ifdraw = false;
});


let actualDist;

document.addEventListener('click', function(){
    actualDist = document.getElementById("select").value;
});
function totalDist(p1,p2){
    if(actualDist == "1"){
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
    if(actualDist == "2"){
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    if(actualDist == "3"){
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }
    if(actualDist == "4"){
        return Math.max(Math.abs(p1.x - p2.x),Math.abs(p1.y - p2.y));
    }
}