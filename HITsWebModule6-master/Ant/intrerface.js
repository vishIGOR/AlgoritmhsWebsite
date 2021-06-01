var counter = 0;
var listOfNodes = [];

const canvas = document.querySelector('canvas');
const window_ = window.getComputedStyle(document.getElementById('window'));
const context = canvas.getContext('2d');

canvas.height = parseInt(window_.height);
canvas.width = parseInt(window_.width);

// кнопка добавления вершины в графе
document.getElementById('add').onclick = function() {
    document.getElementById('window').onclick = function(event) {
        clearCanvas();
        let coordinates = {
            x: event.clientX - 62,
            y: event.clientY - 62
        };
        let element = document.createElement('div');
        document.getElementById('window').appendChild(element);
        
        element.className = "node";
        element.id = `${counter}`;
        element.style.left = `${coordinates.x}px`;
        element.style.top = `${coordinates.y}px`; 
        let newElementToList = new structOfNodes(counter, coordinates.x, coordinates.y);
        addToList(newElementToList);
        counter++;
    }
}

// кнопка удаления вершин определённых в графе
document.getElementById('del').onclick = function() {
    document.getElementById('window').onclick = function(event) {
        clearCanvas();
        let numberOfPoint = event.target.id;
        let toDelete = document.getElementById(`${numberOfPoint}`);
        toDelete.parentNode.removeChild(toDelete);
        let class_ = document.getElementsByClassName('node');
        let flag = false;
        counter--;
        if (toDelete.id == listOfNodes.length-1) {
            listOfNodes.pop();
        } else {
            for (let i = 0; i < counter; i++) {
                class_[i].id = `${i}`;
                if (listOfNodes[i].id == toDelete.id && !flag) {
                    console.log(i);
                    listOfNodes.splice(i,1);
                    console.log(listOfNodes);
                    flag = true;
                } 
                if (flag && i != counter) {
                    listOfNodes[i].id--;
                }
            }
        }
    }
}

// кнопка удаления всех вершин в графе
document.getElementById('delAll').onclick = function() {
    clearCanvas();
    document.querySelectorAll('.node').forEach(element=>element.remove());
    while (listOfNodes.length != 0) {
        listOfNodes.pop();
    }
    counter = 0;
}

// кнопка запуска алгоритма
document.getElementById('algorithm').onclick = function() {
    clearCanvas();
    let matrix = [];
    fromListToMatrix(matrix);
    travellingSalesmanProblem(matrix);
}

// очистка поля от рёбер
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
// добавление точки в список вершин
function addToList(element) {
    listOfNodes.push(element);
}
