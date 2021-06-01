"use strict";

function displayCounter(counter) {
  document.getElementById("counterWindow").innerText = counter;
}

function displayDistance(distance) {
  document.getElementById("distWindow").innerText = distance;
}

var counter = 0;
var listOfNodes = [];

const canvas = document.querySelector("canvas");
const window_ = window.getComputedStyle(document.getElementById("window"));
const context = canvas.getContext("2d");

canvas.height = parseInt(window_.height);
canvas.width = parseInt(window_.width);

function structOfNodes(id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
}

// кнопка добавления вершины в графе
document.getElementById("add").onclick = function () {
  document.getElementById("window").onclick = function (event) {
    clearCanvas();
    displayDistance("-");

    let coordinates = {
      x: event.clientX - 790,
      y: event.clientY - 37,
    };

    let element = document.createElement("div");
    document.getElementById("window").appendChild(element);

    element.className = "node";
    element.id = `${counter}`;
    element.style.left = `${coordinates.x}px`;
    element.style.top = `${coordinates.y}px`;

    let newElementToList = new structOfNodes(
      counter,
      coordinates.x,
      coordinates.y
    );
    addToList(newElementToList);

    counter++;
    displayCounter(counter);
  };
};

// кнопка удаления вершин определённых в графе
document.getElementById("del").onclick = function () {
  document.getElementById("window").onclick = function (event) {
    if (event.target.className == "node") {
      clearCanvas();
      displayDistance("-");

      let numberOfPoint = event.target.id;
      let toDelete = document.getElementById(`${numberOfPoint}`);
      toDelete.parentNode.removeChild(toDelete);
      let class_ = document.getElementsByClassName("node");
      let flag = false;
      counter--;
      displayCounter(counter);
      if (toDelete.id == listOfNodes.length - 1) {
        listOfNodes.pop();
      } else {
        for (let i = 0; i < counter; i++) {
          class_[i].id = `${i}`;
          if (listOfNodes[i].id == toDelete.id && !flag) {
            listOfNodes.splice(i, 1);
            flag = true;
          }
          if (flag && i != counter) {
            listOfNodes[i].id--;
          }
        }
      }
    }
  };
};

// кнопка удаления всех вершин в графе
document.getElementById("delAll").onclick = function () {
  clearCanvas();
  document.querySelectorAll(".node").forEach((element) => element.remove());
  while (listOfNodes.length != 0) {
    listOfNodes.pop();
  }
  counter = 0;
  displayCounter(counter);
  displayDistance("-");
};

// кнопка запуска алгоритма
document.getElementById("algorithm").onclick = function () {
  clearCanvas();

  let matrix = [];
  fromListToMatrix(matrix);

  travellingSalesmanProblem(matrix);
};

// очистка поля от рёбер
function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

// добавление точки в список вершин
function addToList(element) {
  listOfNodes.push(element);
}

// построение матрицы смежности из списка вершин
function fromListToMatrix(matrix) {
  for (let i = 0; i < counter; i++) {
    matrix[i] = new Array();
    for (let j = 0; j < counter; j++) {
      matrix[i][j] = 0;
    }
  }

  for (let i = 0; i < listOfNodes.length - 1; i++) {
    for (let j = i + 1; j < listOfNodes.length; j++) {
      let point1 = listOfNodes[i];
      let point2 = listOfNodes[j];

      let dist = distanceBetweenPoints(point1, point2);

      matrix[i][j] = matrix[j][i] = parseInt(dist);
    }
  }
}

// вычисление расстояния между двумя точками
function distanceBetweenPoints(point1, point2) {
  let a = Math.abs(parseInt(point1.x) - parseInt(point2.x));
  let b = Math.abs(parseInt(point1.y) - parseInt(point2.y));
  let distance = Math.pow(a, 2) + Math.pow(b, 2);
  return Math.pow(distance, 0.5);
}

// ГЕНЕТИЧЕСКИЙ АЛГОРИТМ

// структура для хранения информации о гене
function structOfGen(path, weight) {
  this.path = path; // путь
  this.weight = weight; // вес пути
}

// генератор рандомного пути
function generateRandPath(n) {
  let way = [];

  for (let i = 1; i < n; i++) {
    way[i] = i;
  }

  for (let i = 0; i < 100; i++) {
    way.sort(() => Math.random() - 0.5);
  }

  let array = [0];
  array = array.concat(way);
  array[array.length - 1] = 0;

  return array;
}

// вычисление длины пути
function weightOfPathIs(nodes, path) {
  let weight = 0;

  for (let i = 0; i < nodes.length; i++) {
    weight += nodes[path[i]][path[i + 1]];
  }

  return weight;
}

// скрещивание двух генов
function crossover(array1, array2) {
  let firstPoint = Math.floor(Math.random() * (array1.length - 1) + 1);
  let lastPoint;

  do {
    Math.floor(Math.random() * (array1.length - firstPoint) + firstPoint);
  } while (lastPoint == firstPoint);

  let newArray1 = array1.slice(firstPoint, lastPoint);

  for (let i = 0; i < array2.length - 1; i++) {
    let node = array2[i];
    if (!newArray1.includes(node)) {
      newArray1.push(node);
    }
  }

  newArray1.push(newArray1[0]);

  return newArray1;
}

// мутация гена
function mutation(array) {
  let indexFirst = Math.floor(Math.random() * (array.length - 2));
  let indexSecond;

  indexSecond = Math.floor(
    Math.random() * (array.length - 2 - (indexFirst + 1)) + (indexFirst + 1)
  );

  let tmp = array[indexFirst];
  array[indexFirst] = array[indexSecond];
  array[indexSecond] = tmp;

  array[array.length - 1] = array[0];
  return array;
}

// итерация выполнения алгоритма
function iteration(
  population,
  bestGeneEver,
  sizeOfPopulation,
  nodes,
  numOfGeneration,
  lastBestGene
) {
  let tmpPopulation = [];

  for (let i = 0; i < population.length - 1; i++) {
    for (let j = i + 1; j < population.length; j++) {
      let parentFirst = population[i].path;
      let parentSecond = population[j].path;

      let child = crossover(parentFirst, parentSecond);
      child = mutation(child);
      let childWeight = weightOfPathIs(nodes, child);

      let newGeneFirst = new structOfGen(child, childWeight);
      tmpPopulation.push(newGeneFirst);
    }
  }

  tmpPopulation.sort(function (a, b) {
    if (a.weight >= b.weight) {
      return 1;
    } else if (a.weight < b.weight) {
      return -1;
    }
    return 0;
  }); // сортировка популяции

  while (tmpPopulation.length > sizeOfPopulation) {
    tmpPopulation.pop();
  }

  population = tmpPopulation.slice();

  if (population[0].weight < bestGeneEver.weight) {
    bestGeneEver = population[0];
    lastBestGene = numOfGeneration;
    clearCanvas();
    drawLines(bestGeneEver.path, false);
    displayDistance(bestGeneEver.weight);

    if (numOfGeneration - lastBestGene <= 1000) {
      timeout = setTimeout( // new Swag
        () =>
          iteration(
            population,
            bestGeneEver,
            sizeOfPopulation,
            nodes,
            numOfGeneration + 1,
            lastBestGene
          ),
        10
      );
    }
  } else if (numOfGeneration - lastBestGene <= 1000) {
    iteration(
      population,
      bestGeneEver,
      sizeOfPopulation,
      nodes,
      numOfGeneration + 1,
      lastBestGene
    );
  } else {
    clearCanvas();
    drawLines(bestGeneEver.path, true);
    return;
  }
 
}
let timeout; // new Swag
// прорисовка рёбер
function drawLines(bestGene, flag) {
  clearInterval(timeout); // new Swag
  let size = bestGene.length;
  let startPoint = {
    x: parseInt(document.getElementById(`${bestGene[0]}`).style.left) + 5,
    y: parseInt(document.getElementById(`${bestGene[0]}`).style.top) + 7,
  };

  context.beginPath();
  context.moveTo(startPoint.x, startPoint.y);

  for (let i = 1; i < size; i++) {
    let nextPoint = {
      x: parseInt(document.getElementById(`${bestGene[i]}`).style.left) + 5,
      y: parseInt(document.getElementById(`${bestGene[i]}`).style.top) + 7,
    };
    context.lineTo(nextPoint.x, nextPoint.y);
  }

  if (!flag) {
    context.strokeStyle = "#4f4f4f";
  } else {
    context.strokeStyle = "#7d87a8";
  }

  context.lineWidth = 3;
  context.lineCap = "square";
  context.stroke();
}

function travellingSalesmanProblem(nodes) {
  let numOfGeneration = 1; // счётчик поколений

  let bestGeneEver = new structOfGen([], Number.MAX_SAFE_INTEGER);

  let lastBestGene = 1;

  let sizeOfPopulation = nodes.length; // размер популяции
  let population = []; // создание популяции (массив с маршрутами и их весами)

  for (let i = 0; i < sizeOfPopulation; i++) {
    let randPath = generateRandPath(nodes.length); // генерация случайного пути
    let weightOfPath = weightOfPathIs(nodes, randPath); // вычисление длины случайного пути
    if (weightOfPath < bestGeneEver.weight) {
      bestGeneEver.weight = weightOfPath;
      bestGeneEver.path = randPath;
    }
    population.push(new structOfGen(randPath, weightOfPath)); // внесение данных в популяцию
  }

  clearCanvas();
  if (nodes.length > 2) {
    drawLines(bestGeneEver.path, false);
    displayDistance(bestGeneEver.weight);
  } else {
    drawLines(bestGeneEver.path, true);
    displayDistance(bestGeneEver.weight);
  }

  if (nodes.length > 2) {
    iteration(
      population,
      bestGeneEver,
      sizeOfPopulation,
      nodes,
      numOfGeneration,
      lastBestGene
    );
  }
}
