var counter = 0;
var countOfTops;
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
function displayCounter(counter) {
  document.getElementById("counterWindow").innerText = counter;
}
// кнопка добавления вершины в графе
document.getElementById("add").onclick = function () {
  document.getElementById("window").onclick = function (event) {
    clearCanvas();
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
    clearCanvas();
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
          console.log(i);
          listOfNodes.splice(i, 1);
          console.log(listOfNodes);
          flag = true;
        }
        if (flag && i != counter) {
          listOfNodes[i].id--;
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
};

// кнопка запуска алгоритма
document.getElementById("algorithm").onclick = function () {
  clearCanvas();
  countOfTops = counter;
  init(massivOfDist, massivOfFeromon);
  main();
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

function drawLines(bestGene, flag) {
  let size = bestGene.length;
  let startPoint = {
    x: parseInt(document.getElementById(`${bestGene[0]}`).style.left) + 11,
    y: parseInt(document.getElementById(`${bestGene[0]}`).style.top) + 11,
  };
  context.beginPath();
  context.moveTo(startPoint.x, startPoint.y);
  for (let i = 1; i < size; i++) {
    let nextPoint = {
      x: parseInt(document.getElementById(`${bestGene[i]}`).style.left) + 11,
      y: parseInt(document.getElementById(`${bestGene[i]}`).style.top) + 11,
    };
    context.lineTo(nextPoint.x, nextPoint.y);
  }
  if (!flag) {
    context.strokeStyle = "#4f4f4f";
  } else {
    context.strokeStyle = "#7d87a8";
  }
  context.lineWidth = 3;
  context.stroke();
}

//                  МУРАВЬИНЫЙ АЛГОРИТМ

class Point {
  constructor(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
  }
}

var start_feromon = 0.1;
var massivOfDist = [];
var massivOfFeromon = [];
const alpha = 1;
const beta = 4;
const evaporation = 0.6;
const Q = 4;

function distbetweentops(first, second) {
  return Math.sqrt(
    Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2)
  );
}

function sum(x) {
  var s = 0;
  for (i = 0; i < x.length; i++) {
    s += x[i];
  }
  return s;
}

function fill(massive, countOfTops) {
  for (var i = 0; i < countOfTops; ++i) {
    massive.push(0);
  }
  return massive;
}
console.log(listOfNodes);
function init(massivOfDist, massivOfFeromon) {
  //const t0 = performance.now();
  for (let i = 0; i < countOfTops; ++i) {
    massivOfDist.push(new Array(countOfTops));
    massivOfFeromon.push(new Array(countOfTops));
    for (let j = 0; j < countOfTops; ++j) {
      massivOfFeromon[i][j] = start_feromon;
      massivOfDist[i][j] = distbetweentops(listOfNodes[i], listOfNodes[j]);
    }
  }
  /* const t1 = performance.now();
    console.log(t1 - t0, 'milliseconds | init'); */
}

function ChooseTop(massivOfProbabilities) {
  // const t0 = performance.now();
  let rnd = Math.random();
  let t_start = 0;
  let t_end = massivOfProbabilities[0];
  for (let i = 0; i < countOfTops; i++) {
    if (rnd > t_start && rnd < t_end) {
      return i;
    }
    t_start = t_end;
    t_end += massivOfProbabilities[i + 1];
  }
  /* const t1 = performance.now();
    console.log(t1 - t0, 'milliseconds | ChoseTop'); */
}

//console.log(ChooseTop([0,0.6,0.1,0,0.3]))

function countProb(used, actionTop) {
  // const t0 = performance.now();
  let sum = 0;
  for (k = 0; k < countOfTops; k++) {
    if (used[k] != 1) {
      sum +=
        Math.pow(massivOfFeromon[actionTop][k], alpha) *
        Math.pow(1 / massivOfDist[actionTop][k], beta);
    }
  }

  let massivOfProbabilities = new Array(countOfTops);

  for (let i = 0; i < countOfTops; ++i) {
    if (used[i] == 1) {
      massivOfProbabilities[i] = 0;
    } else {
      let one = Math.pow(massivOfFeromon[actionTop][i], alpha);
      let two = Math.pow(1 / massivOfDist[actionTop][i], beta);
      massivOfProbabilities[i] = (one * two) / sum;
    }
  }
  const t1 = performance.now();
  /* console.log(t1 - t0, 'milliseconds | countProb');
    console.log((massivOfProbabilities)); */
  return massivOfProbabilities;
}

function pherRenewal(listOfWays) {
  // const t0 = performance.now();
  for (let i = 0; i < countOfTops; i++) {
    for (let j = 0; j < countOfTops; j++) {
      massivOfFeromon[i][j] *= evaporation;
    }
  }
  for (let i = 0; i < countOfTops; i++) {
    let sumOfL = 0;
    for (let j = 1; j < listOfWays[i].length; j++) {
      sumOfL += massivOfDist[listOfWays[i][j]][listOfWays[i][j - 1]];
      let newPher = Q / sumOfL;
      massivOfFeromon[listOfWays[i][j]][listOfWays[i][j - 1]] += newPher;
      massivOfFeromon[listOfWays[i][j - 1]][listOfWays[i][j]] += newPher;
    }
  }
  /* const t1 = performance.now();
    console.log(t1 - t0, 'milliseconds | pherRenewal'); */
}

function comparingWays(listOfWays) {
  let table = [];
  for (let i = 0; i < countOfTops; i++) {
    table.push(new Array(countOfTops).fill(0));
  }
  for (let i = 0; i < countOfTops; i++) {
    for (let j = 0; j < countOfTops; j++) {
      table[listOfWays[i][j]][listOfWays[i][j + 1]]++;
      table[listOfWays[i][j + 1]][listOfWays[i][j]]++;
    }
  }
  for (let i = 0; i < countOfTops - 1; i++) {
    if (table[listOfWays[0][i]][listOfWays[0][i + 1]] != countOfTops) {
      return 0;
    }
  }
  return 1;
}

function main() {
  let cc = 0;
  do {
    
    var listOfUsed = new Array();
    var listOfWays = new Array();
    cc++;
    for (let k = 0; k < countOfTops; ++k) {
      listOfUsed.push(fill(new Array(), countOfTops));

      listOfWays.push([k]);
      listOfUsed[k][k] = 1;
      let actionTop = k;

      for (let j = 0; j < countOfTops - 1; ++j) {
        let actual = ChooseTop(countProb(listOfUsed[k], actionTop));
        listOfUsed[k][actual] = 1;
        actionTop = actual;
        listOfWays[k].push(actual);
      }
      listOfWays[k].push(k);
    }
    pherRenewal(listOfWays);
    
  } while (comparingWays(listOfWays) == 0 && cc < 100000);
  console.log(cc);
  console.log(listOfWays);
  drawLines(listOfWays[0], true);
}
