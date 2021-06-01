"use strict"
var n;
var map;
var beginPoint;
var endPoint;
var changesArePossible = false;
var movementSpeed;
document.getElementById("launch_A_star").setAttribute("disabled", "disabled");
//Генератор случайных чисел от min ДО(не ПО) max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function coordinates(x, y) {
    this.x = x;
    this.y = y;
}
//структура точки
function point(x, y, isWall) {
    this.x = x;
    this.y = y;
    if (isWall !== undefined) {
        this.isWall = isWall;
    }
    else {
        this.isWall = true;
    }
    this.isVisited = false;
    this.h;//эвр. расстояние до конца 
    this.g = Infinity;//расстояние от начальной вершины до этой 
    this.f;//h+g
    this.parent;//из какой точки попали в эту
    this.isInOpenList = false;//проверка на наличие этой точки в открытом списке
    this.isConcidered = false;//проверка на наличие этой точки в списке рассматриваемых вершин
    this.htmlObject;//связанный с этой клеткой html объект на странице
}
//Функция для изменения клетки при нажатии
function ifClicked(mapObject) {
    if (document.getElementById("control_panel").hasAttribute("disabled"))
        return;
    let formOfAction = document.getElementById("control_panel").value;
    if (formOfAction == 0) {
    }
    if (formOfAction == 1) {
        if (mapObject.isWall == true) {
            alert("Cтену нельзя сделать началом");
        }
        else {
            if (mapObject == endPoint) {
                alert("Нельзя точку конца сделать точкой начала");
            }
            else {
                beginPoint.htmlObject.classList.remove("begin");
                beginPoint.htmlObject.classList.add("notWall");
                mapObject.htmlObject.classList.remove("notWall");
                mapObject.htmlObject.classList.add("begin");
                beginPoint = mapObject;
            }

        }
    }
    if (formOfAction == 2) {
        if (mapObject.isWall == mapObject) {
            alert("Cтену нельзя сделать концом");
        }
        else {
            if (mapObject == beginPoint) {
                alert("Нельзя точку начала сделать точкой конца");
            }
            else {
                endPoint.htmlObject.classList.remove("end");
                endPoint.htmlObject.classList.add("notWall");
                mapObject.htmlObject.classList.remove("notWall");
                mapObject.htmlObject.classList.add("end");
                endPoint = mapObject;
            }
        }
    }
    if (formOfAction == 3) {
        if (mapObject.isWall == true) {
            mapObject.isWall = false;
            mapObject.htmlObject.classList.remove("wall");
            mapObject.htmlObject.classList.add("notWall");
        }
    }
    if (formOfAction == 4) {
        if (mapObject == beginPoint) {
            alert("Нельзя точку начала сделать стеной");
            return;
        }
        if (mapObject == endPoint) {
            alert("Нельзя точку конца сделать стеной");
            return;
        }
        if (mapObject.isWall == false) {
            mapObject.isWall = true;
            mapObject.htmlObject.classList.remove("notWall");
            mapObject.htmlObject.classList.add("wall");
        }
    }
}
function allowChanging() {
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            map[i][j].htmlObject.onclick = function () { ifClicked(map[i][j]) };
        }
    }
}
//кол-во строк и столбцов
/////////////////////////////////////////////////////////////////////////////////////////////////////////генерация пустой карты
function blankMapCreation(e) {
    n = document.getElementById("maze_size").value;
    if (n < 3) {
        alert("Слишком маленький размер");
        return;
    }
    if (n > 300) {
        alert("Слишком большой размер");
        return;
    }
    document.getElementById("launch_maze_creation").setAttribute("disabled", "disabled");
    changesArePossible = true;
    //Тут работа с созданием html объектов и их настройка в зависимости от карты
    //работаем с переменными CSS
    var root = document.querySelector(':root');
    root.style.setProperty("--sizeOfCell", 700 / n + "px");
    // root.style.setProperty("--mainFieldSize", Math.floor(700 / n)*n  + "px");
    //работаем с section в body
    var mainObject = document.getElementById("mainField");
    mainObject.classList.add("lineSpace");
    var objectsArray = new Array(n);
    let nodeForMazeCreation;
    for (let i = 0; i < n; ++i) {
        objectsArray[i] = document.createElement("div");
        mainObject.appendChild(objectsArray[i]);
        objectsArray[i].classList.add("string");
        if (i == 0) {
            nodeForMazeCreation = mainObject.getElementsByTagName("div")[0];
        }
        else {
            nodeForMazeCreation = nodeForMazeCreation.nextSibling;
        }
        let arrayForNodes = new Array(n);
        for (let j = 0; j < n; ++j) {
            arrayForNodes[j] = document.createElement("p");
            nodeForMazeCreation.appendChild(arrayForNodes[j]);
        }
    }
    //создаю карту
    map = new Array(n);
    for (let i = 0; i < n; ++i) {
        map[i] = new Array(n);
        for (let j = 0; j < n; ++j) {
            map[i][j] = new point(i, j, false);
        }
    }
    //create beginning and end
    beginPoint = map[0][0];
    endPoint = map[n - 1][n - 1];
    //привязываю к карте объекты html
    var cells = mainObject.getElementsByTagName("p");
    let celLen = cells.length;
    for (let i = 0; i < celLen; ++i) {
        cells[i].classList.add("cell1");
        cells[i].classList.add("onHover");
        cells[i].classList.add("notWall");
    }
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; j++) {
            map[i][j].htmlObject = cells[celLen + i - n - j * n];
        }
    }
    document.getElementById("launch_maze_creation").setAttribute("disabled", "disabled");
    beginPoint.htmlObject.classList.remove("notWall");
    endPoint.htmlObject.classList.remove("notWall");
    beginPoint.htmlObject.classList.add("begin");
    endPoint.htmlObject.classList.add("end");
    //добавляем возможность нажать на 2 кнопку
    document.getElementById("launch_A_star").removeAttribute("disabled");
    document.getElementById("control_panel").removeAttribute("disabled", "disabled");
}
////////////////////////////////////////////////////////////////////////////////////////////////////генерация лабиринта
function MazeCreation(e) {
    n = document.getElementById("maze_size").value;
    if (n < 3) {
        alert("Слишком маленький размер");
        return;
    }
    if (n > 300) {
        alert("Слишком большой размер");
        return;
    }
    changesArePossible = true;
    //Тут работа с созданием html объектов и их настройка в зависимости от карты
    //работаем с переменными CSS
    var root = document.querySelector(':root');
    root.style.setProperty("--sizeOfCell", 700 / n + "px");
    // root.style.setProperty("--mainFieldSize", Math.floor(700 / n)*n  + "px");
    //работаем с section в body
    var mainObject = document.getElementById("mainField");
    mainObject.classList.add("lineSpace");
    var objectsArray = new Array(n);
    let nodeForMazeCreation;
    for (let i = 0; i < n; ++i) {
        objectsArray[i] = document.createElement("div");
        mainObject.appendChild(objectsArray[i]);
        objectsArray[i].classList.add("string");
        if (i == 0) {
            nodeForMazeCreation = mainObject.getElementsByTagName("div")[0];
        }
        else {
            nodeForMazeCreation = nodeForMazeCreation.nextSibling;
        }
        let arrayForNodes = new Array(n);
        for (let j = 0; j < n; ++j) {
            arrayForNodes[j] = document.createElement("p");
            nodeForMazeCreation.appendChild(arrayForNodes[j]);
        }
    }
    //создаю карту
    map = new Array(n);
    for (let i = 0; i < n; ++i) {
        map[i] = new Array(n);
        for (let j = 0; j < n; ++j) {
            map[i][j] = new point(i, j, true);
        }
    }
    //привязываю к карте объекты html
    var cells = mainObject.getElementsByTagName("p");
    let celLen = cells.length;
    for (let i = 0; i < celLen; ++i) {
        cells[i].classList.add("cell1");
        cells[i].classList.add("onHover");
        //map[i % n][Math.floor(i / n)] = cells[i];
    }
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; j++) {
            map[i][j].htmlObject = cells[celLen + i - n - j * n];
        }
    }
    document.getElementById("launch_maze_creation").setAttribute("disabled", "disabled");
    //после оперирования с html элементами начинается процесс создания лабриринта.

    //список, в котором будут лежать рассматриваемые точки
    let consideredCells = buckets.LinkedList();

    //create beginning and end
    beginPoint = map[0][0];
    beginPoint.isConcidered = true;
    endPoint = map[n - 1][n - 1];
    //собственно тут сам алгоритм Прима

    beginPoint.isWall = false;
    var currentCell = beginPoint;
    consideredCells.add(map[currentCell.x + 2][currentCell.y]);
    map[currentCell.x + 2][currentCell.y].isConcidered = true;
    consideredCells.add(map[currentCell.x][currentCell.y + 2], getRandomInt(0, 2));
    map[currentCell.x][currentCell.y + 2].isConcidered = true;
    //неьлоьшой список для рассмотрения ближайших клеток без стен
    let nearestCells = buckets.LinkedList();
    let randomCell;
    //собственно сам генератор
    while (consideredCells.isEmpty() != true) {
        randomCell = getRandomInt(0, consideredCells.size());
        currentCell = consideredCells.elementAtIndex(randomCell);
        consideredCells.removeElementAtIndex(randomCell);
        //добавляем вершины в список рассматриваемых, или в список тех, к кому можно провести стену
        if (currentCell.x - 2 >= 0) {
            if (map[currentCell.x - 2][currentCell.y].isConcidered == false) {
                consideredCells.add(map[currentCell.x - 2][currentCell.y]);
                map[currentCell.x - 2][currentCell.y].isConcidered = true;
            }
            else {
                if (map[currentCell.x - 2][currentCell.y].isWall == false)
                    nearestCells.add(map[currentCell.x - 1][currentCell.y]);

            }
        }

        if (currentCell.x + 2 < n) {
            if (map[currentCell.x + 2][currentCell.y].isConcidered == false) {
                consideredCells.add(map[currentCell.x + 2][currentCell.y]);
                map[currentCell.x + 2][currentCell.y].isConcidered = true;
            }
            else {
                if (map[currentCell.x + 2][currentCell.y].isWall == false)
                    nearestCells.add(map[currentCell.x + 1][currentCell.y]);

            }
        }

        if (currentCell.y - 2 >= 0) {
            if (map[currentCell.x][currentCell.y - 2].isConcidered == false) {
                consideredCells.add(map[currentCell.x][currentCell.y - 2]);
                map[currentCell.x][currentCell.y - 2].isConcidered = true;
            }
            else {
                if (map[currentCell.x][currentCell.y - 2].isWall == false)
                    nearestCells.add(map[currentCell.x][currentCell.y - 1]);

            }
        }

        if (currentCell.y + 2 < n) {
            if (map[currentCell.x][currentCell.y + 2].isConcidered == false) {
                consideredCells.add(map[currentCell.x][currentCell.y + 2]);
                map[currentCell.x][currentCell.y + 2].isConcidered = true;
            }
            else {
                if (map[currentCell.x][currentCell.y + 2].isWall == false)
                    nearestCells.add(map[currentCell.x][currentCell.y + 1]);

            }
        }
        //делаем текущую клетку свободной и слчайную из тех, кто рядом со свободной стеной
        currentCell.isWall = false;
        nearestCells.elementAtIndex(getRandomInt(0, nearestCells.size())).isWall = false;
        nearestCells.clear();
    }
    //Так как алгоритм Прима создает горизонтальную и вертикальную сплошную стену при n четном, усовершенствуем его немного
    if (n % 2 == 0) {
        endPoint.isWall = false;
        let randomVar = getRandomInt(0, 2);
        if (randomVar == 1)
            map[n - 2][n - 1].isWall = false;
        else
            map[n - 1][n - 2].isWall = false;
        for (let i = 0; i < n - 2; i += 2) {
            randomVar = getRandomInt(0, 5);
            if (randomVar % 2 == 1)
                map[i][n - 1].isWall = false;
        }
        for (let i = 0; i < n - 2; i += 2) {
            randomVar = getRandomInt(0, 5);
            if (randomVar % 2 == 1)
                map[n - 1][i].isWall = false;
        }
    }
    //делаем сязь между созданным лабиринтом и html элементами
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            if (map[i][j].isWall == true) {
                map[i][j].htmlObject.classList.add("wall");
            }
            else {
                map[i][j].htmlObject.classList.add("notWall");
            }
        }
    }
    beginPoint.htmlObject.classList.remove("notWall");
    endPoint.htmlObject.classList.remove("notWall");
    beginPoint.htmlObject.classList.add("begin");
    endPoint.htmlObject.classList.add("end");
    //добавляем возможность нажать на 2 кнопку
    document.getElementById("launch_A_star").removeAttribute("disabled");
    document.getElementById("control_panel").removeAttribute("disabled");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Создание пещеры
function CaveCreation(e) {
    n = document.getElementById("maze_size").value;
    if (n < 3) {
        alert("Слишком маленький размер");
        return;
    }
    if (n > 300) {
        alert("Слишком большой размер");
        return;
    }
    changesArePossible = true;
    //Тут работа с созданием html объектов и их настройка в зависимости от карты
    //работаем с переменными CSS
    var root = document.querySelector(':root');
    root.style.setProperty("--sizeOfCell", 700 / n + "px");
    // root.style.setProperty("--mainFieldSize", Math.floor(700 / n)*n  + "px");
    //работаем с section в body
    var mainObject = document.getElementById("mainField");
    mainObject.classList.add("lineSpace");
    var objectsArray = new Array(n);
    let nodeForMazeCreation;
    for (let i = 0; i < n; ++i) {
        objectsArray[i] = document.createElement("div");
        mainObject.appendChild(objectsArray[i]);
        objectsArray[i].classList.add("string");
        if (i == 0) {
            nodeForMazeCreation = mainObject.getElementsByTagName("div")[0];
        }
        else {
            nodeForMazeCreation = nodeForMazeCreation.nextSibling;
        }
        let arrayForNodes = new Array(n);
        for (let j = 0; j < n; ++j) {
            arrayForNodes[j] = document.createElement("p");
            nodeForMazeCreation.appendChild(arrayForNodes[j]);
        }
    }
    //создаю карту
    map = new Array(n);
    for (let i = 0; i < n; ++i) {
        map[i] = new Array(n);
        for (let j = 0; j < n; ++j) {
            map[i][j] = new point(i, j, true);
        }
    }
    //привязываю к карте объекты html
    var cells = mainObject.getElementsByTagName("p");
    let celLen = cells.length;
    for (let i = 0; i < celLen; ++i) {
        cells[i].classList.add("cell1");
        cells[i].classList.add("onHover");
        //map[i % n][Math.floor(i / n)] = cells[i];
    }
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; j++) {
            map[i][j].htmlObject = cells[celLen + i - n - j * n];
        }
    }
    document.getElementById("launch_maze_creation").setAttribute("disabled", "disabled");
    //после оперирования с html элементами начинается процесс создания лабриринта.

    //список, в котором будут лежать рассматриваемые точки
    let consideredCells = buckets.LinkedList();

    //create beginning and end
    beginPoint = map[0][0];
    beginPoint.isConcidered = true;
    endPoint = map[n - 1][n - 1];
    //собственно тут сам алгоритм Прима

    beginPoint.isWall = false;
    var currentCell = beginPoint;
    consideredCells.add(map[currentCell.x + 2][currentCell.y]);
    map[currentCell.x + 2][currentCell.y].isConcidered = true;
    consideredCells.add(map[currentCell.x][currentCell.y + 2], getRandomInt(0, 2));
    map[currentCell.x][currentCell.y + 2].isConcidered = true;
    //неьлоьшой список для рассмотрения ближайших клеток без стен
    let nearestCells = buckets.LinkedList();
    let randomCell;
    //собственно сам генератор
    while (consideredCells.isEmpty() != true) {
        randomCell = getRandomInt(0, consideredCells.size());
        currentCell = consideredCells.elementAtIndex(randomCell);
        consideredCells.removeElementAtIndex(randomCell);
        //добавляем вершины в список рассматриваемых, или в список тех, к кому можно провести стену
        if (currentCell.x - 2 >= 0) {
            if (map[currentCell.x - 2][currentCell.y].isConcidered == false) {
                consideredCells.add(map[currentCell.x - 2][currentCell.y]);
                map[currentCell.x - 2][currentCell.y].isConcidered = true;
            }
            else {
                if (map[currentCell.x - 2][currentCell.y].isWall == false)
                    nearestCells.add(map[currentCell.x - 1][currentCell.y]);

            }
        }

        if (currentCell.x + 2 < n) {
            if (map[currentCell.x + 2][currentCell.y].isConcidered == false) {
                consideredCells.add(map[currentCell.x + 2][currentCell.y]);
                map[currentCell.x + 2][currentCell.y].isConcidered = true;
            }
            else {
                if (map[currentCell.x + 2][currentCell.y].isWall == false)
                    nearestCells.add(map[currentCell.x + 1][currentCell.y]);

            }
        }

        if (currentCell.y - 2 >= 0) {
            if (map[currentCell.x][currentCell.y - 2].isConcidered == false) {
                consideredCells.add(map[currentCell.x][currentCell.y - 2]);
                map[currentCell.x][currentCell.y - 2].isConcidered = true;
            }
            else {
                if (map[currentCell.x][currentCell.y - 2].isWall == false)
                    nearestCells.add(map[currentCell.x][currentCell.y - 1]);

            }
        }

        if (currentCell.y + 2 < n) {
            if (map[currentCell.x][currentCell.y + 2].isConcidered == false) {
                consideredCells.add(map[currentCell.x][currentCell.y + 2]);
                map[currentCell.x][currentCell.y + 2].isConcidered = true;
            }
            else {
                if (map[currentCell.x][currentCell.y + 2].isWall == false)
                    nearestCells.add(map[currentCell.x][currentCell.y + 1]);

            }
        }
        //делаем текущую клетку свободной и слчайную из тех, кто рядом со свободной стеной
        currentCell.isWall = false;
        nearestCells.elementAtIndex(getRandomInt(0, nearestCells.size())).isWall = false;
        nearestCells.clear();
    }
    //Так как алгоритм Прима создает горизонтальную и вертикальную сплошную стену при n четном, усовершенствуем его немного
    if (n % 2 == 0) {
        endPoint.isWall = false;
        let randomVar = getRandomInt(0, 2);
        if (randomVar == 1)
            map[n - 2][n - 1].isWall = false;
        else
            map[n - 1][n - 2].isWall = false;
        for (let i = 0; i < n - 2; i += 2) {
            randomVar = getRandomInt(0, 5);
            if (randomVar % 2 == 1)
                map[i][n - 1].isWall = false;
        }
        for (let i = 0; i < n - 2; i += 2) {
            randomVar = getRandomInt(0, 5);
            if (randomVar % 2 == 1)
                map[n - 1][i].isWall = false;
        }
    }
    for (let counter = 0, cellCounter; counter < 4; ++counter) {
        for (let i = 0; i < n; ++i) {
            for (let j = 0; j < n; ++j) {
                cellCounter = 0;
                if (!(i == 0 && j == 0) && !(i == n - 1 && j == n - 1)) {
                    if (map[i][j].isWall == false) {
                        if (i - 1 >= 0) {
                            if (map[i - 1][j].isWall == false)
                                ++cellCounter;
                        }
                        if (i + 1 < n) {
                            if (map[i + 1][j].isWall == false)
                                ++cellCounter;
                        }
                        if (j - 1 >= 0) {
                            if (map[i][j - 1].isWall == false)
                                ++cellCounter;
                        }
                        if (j + 1 < n) {
                            if (map[i][j + 1].isWall == false)
                                ++cellCounter;
                        }
                    }
                    if (cellCounter == 1) {
                        map[i][j].isWall = true;
                    }
                }
            }
        }
    }
    for (let counter = 0, cellCounter; counter < 5; ++counter) {
        for (let i = 0; i < n; ++i) {
            for (let j = 0; j < n; ++j) {
                cellCounter = 0;
                if (map[i][j].isWall == true) {
                    for (let ii = -1; ii < 2; ++ii) {
                        for (let jj = -1; jj < 2; ++jj) {
                            if (i + ii >= 0 && i + ii < n && j + jj >= 0 && j + jj < n) {
                                if (map[i + ii][j + jj].isWall == false)
                                    ++cellCounter;
                            }
                        }
                    }
                    if (cellCounter >= 5) {
                        map[i][j].isWall = false;
                    }
                }
            }
        }
    }
    for (let counter = 0, cellCounter; counter < 4; ++counter) {
        for (let i = 0; i < n; ++i) {
            for (let j = 0; j < n; ++j) {
                cellCounter = 0;
                if (!(i == 0 && j == 0) && !(i == n - 1 && j == n - 1)) {
                    if (map[i][j].isWall == false) {
                        if (i - 1 >= 0) {
                            if (map[i - 1][j].isWall == false)
                                ++cellCounter;
                        }
                        if (i + 1 < n) {
                            if (map[i + 1][j].isWall == false)
                                ++cellCounter;
                        }
                        if (j - 1 >= 0) {
                            if (map[i][j - 1].isWall == false)
                                ++cellCounter;
                        }
                        if (j + 1 < n) {
                            if (map[i][j + 1].isWall == false)
                                ++cellCounter;
                        }
                    }
                    if (cellCounter == 1) {
                        map[i][j].isWall = true;
                    }
                }
            }
        }
    }
    //делаем сязь между созданным лабиринтом и html элементами
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            if (map[i][j].isWall == true) {
                map[i][j].htmlObject.classList.add("wall");
            }
            else {
                map[i][j].htmlObject.classList.add("notWall");
            }
        }
    }
    beginPoint.htmlObject.classList.remove("notWall");
    endPoint.htmlObject.classList.remove("notWall");
    beginPoint.htmlObject.classList.add("begin");
    endPoint.htmlObject.classList.add("end");
    //добавляем возможность нажать на 2 кнопку
    document.getElementById("launch_A_star").removeAttribute("disabled");
    document.getElementById("control_panel").removeAttribute("disabled");
}
///////////////
//
//
function clicking() {
    if (document.getElementById("map_form_selection").value == 1) {
        blankMapCreation();
    }
    else {
        if (document.getElementById("map_form_selection").value == 2) {
            MazeCreation();
        }
        else {
            CaveCreation();
        }
    }
    allowChanging();
}
document.getElementById("launch_maze_creation").onclick = clicking;
//
//
//////////////
//Нахождение эвристического пути
function distance(somePoint) {
    let distance = Math.abs(endPoint.x - somePoint.x) * 10 + Math.abs(endPoint.y - somePoint.y) * 10;
    return distance;
}
//Переменная, показывающая существование пути, длина диагонального и ортогонального перехода
var pathIsExist;
var ortLength = 10;
var diagLength = 14;
var timeCounter;
var queueForAnimationX = buckets.Queue();
var queueForAnimationY = buckets.Queue();
var openList;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////собственно сам алгоритм
function a_star() {
    movementSpeed=500/n;
    //Забиваем значение эвр.пути длч каждой вершины
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
            map[i][j].h = distance(map[i][j]);
        }
    }
    //настраиваем функцию сравнения в открытой куче
    openList = buckets.Heap(function (a, b) {
        if (a.h + a.g < b.g + b.h) {
            return -1;
        }
        if (a.h + a.g > b.g + b.h) {
            return 1;
        }
        return 0;
    });
    beginPoint.g = 0;
    openList.add(beginPoint);
    let cx;
    let cy;
    let tentativeScore;
    let currentPoint;
    timeCounter = 0;
    while (openList.isEmpty() != true) {
        if (currentPoint !== undefined && currentPoint!=beginPoint) {
            queueForAnimationX.add(currentPoint.x);
            queueForAnimationY.add(currentPoint.y);
            timeout = setTimeout(function () {// newSwag
                map[queueForAnimationX.peek()][queueForAnimationY.peek()].htmlObject.classList.remove("currentPoint");
                map[queueForAnimationX.dequeue()][queueForAnimationY.dequeue()].htmlObject.classList.add("notWall");
            }, timeCounter * movementSpeed);
            ++timeCounter;
        }
        currentPoint = openList.removeRoot();
        queueForAnimationX.add(currentPoint.x);
        queueForAnimationY.add(currentPoint.y);
        timeout = setTimeout(function () { // newSwag
            map[queueForAnimationX.peek()][queueForAnimationY.peek()].htmlObject.classList.remove("consideredPoint");
            map[queueForAnimationX.dequeue()][queueForAnimationY.dequeue()].htmlObject.classList.add("currentPoint");
        }, timeCounter * movementSpeed);
        ++timeCounter;
        if (currentPoint == endPoint) {
            return true;
        }
        currentPoint.isVisited = true;
        currentPoint.isInOpenList = false;
        cx = currentPoint.x;
        cy = currentPoint.y;
        //Здесь перебор соседниx вершин
        for (let i = -1; i < 2; ++i) {
            for (let j = -1; j < 2; ++j) {
                //проверка на границы, а также являются ли координаты равными current
                if (cx + i == n || cx + i == -1 || cy + j == n || cy + j == -1 || (i == 0 && j == 0)) {
                    continue;
                }
                //проверка на стены рядом с текущей клеткой
                if ((i + j) % 2 == 0) {
                    if (map[cx][cy + j].isWall === true || map[cx + i][cy].isWall === true)
                        continue;
                }
                if (map[cx + i][cy + j].isWall === true)
                    continue;
                //новый кратчайший путь до этой точки через current 
                if ((i + j) % 2 == 1) {
                    tentativeScore = currentPoint.g + ortLength;
                }
                else {
                    tentativeScore = currentPoint.g + diagLength;
                }
                if (map[cx + i][cy + j].isVisited == true && tentativeScore >= map[cx + i][cy + j].g) {
                    continue;
                }
                //Если у точки появился путь покороче
                if (map[cx + i][cy + j].isVisited == false && tentativeScore < map[cx + i][cy + j].g) {
                    map[cx + i][cy + j].parent = currentPoint;
                    map[cx + i][cy + j].g = tentativeScore;
                    map[cx + i][cy + j].f = map[cx + i][cy + j].g + map[cx + i][cy + j].h;
                    //проверка на наличие в открытом списке
                    if (map[cx + i][cy + j].isInOpenList == false) {
                        map[cx + i][cy + j].isInOpenList = true;
                        openList.add(map[cx + i][cy + j]);
                        queueForAnimationX.add(cx + i);
                        queueForAnimationY.add(cy + j);
                        timeout = setTimeout(function () { // newSwag
                            map[queueForAnimationX.peek()][queueForAnimationY.peek()].htmlObject.classList.remove("notWall");
                            map[queueForAnimationX.dequeue()][queueForAnimationY.dequeue()].htmlObject.classList.add("consideredPoint");
                        }, timeCounter * movementSpeed);
                        ++timeCounter;
                    }
                }

            }
        }
    }
    clearInterval(timeout) // newSwag
    return false;
}
let timeout ;// newSwag
function cleanMap() {
    
    let openListSize = openList.size();
    let cleaner;
    for (let i = 0; i < openListSize; ++i) {
        cleaner = openList.removeRoot();
        queueForAnimationX.add(cleaner.x);
        queueForAnimationY.add(cleaner.y);
        setTimeout(function () {
            map[queueForAnimationX.peek()][queueForAnimationY.peek()].htmlObject.classList.remove("consideredPoint");
            map[queueForAnimationX.dequeue()][queueForAnimationY.dequeue()].htmlObject.classList.add("notWall");
        }, timeCounter * movementSpeed);
        ++timeCounter;
    }
}
//Функция нахождения пути
function getPath() {
    if (pathIsExist == false) {
        setTimeout(function () {
            alert("Пути не существует");
        }, timeCounter * movementSpeed);
        return;
    }
    let currentPoint = endPoint.parent;
    let fullPath = buckets.Stack();

    while (currentPoint !== beginPoint) {
        fullPath.push(currentPoint);
        currentPoint = currentPoint.parent;
    }
    let sizeOfStack = fullPath.size();
    for (let i = timeCounter; i < sizeOfStack + timeCounter; ++i) {
        setTimeout(function () {
            fullPath.peek().htmlObject.classList.remove("notWall");
            fullPath.pop().htmlObject.classList.add("path");
        }, i * movementSpeed);
    }
    cleanMap();
}
function A_star_launch(e) {
    document.getElementById("launch_A_star").setAttribute("disabled", "disabled");
    document.getElementById("control_panel").setAttribute("disabled", "disabled");
    pathIsExist = a_star();
    getPath();
    e.preventDefault()
}
document.getElementById("launch_A_star").onclick = A_star_launch;