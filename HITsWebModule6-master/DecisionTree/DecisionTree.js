"use script";
/*
color,diam,fruit
Green,3,Apple
Yellow,3,Apple
Red,1,Grape
Red,1,Grape
Yellow,3,Lemon
*/
var m;
var n;
var userData;
var text;
var header;
var predict;
var tree;
//проверка, правильно ли введены данные
function isFormatTrue() {
  m = text.data.length - 1;
  n = text.data[0].length;
  for (let i = 0; i < m + 1; ++i) {
    if (text.data[i].length != n) return false;
  }
  return true;
}
//можно ли перевести строку в число
function IsNumber(value) {
  if (isNaN(Number(value))) {
    return false;
  } else {
    return true;
  }
}
//число ли value
function IsNumeric(value) {
  if (typeof value == "number" && !isNaN(value)) return true;
  return false;
}
//проверка на "числовой" столбец
function IscolumnOfNumbers(numberOfcolumn) {
  for (let i = 0; i < m; ++i) {
    if (!IsNumber(userData[i][numberOfcolumn])) {
      return false;
    }
  }
  return true;
}
//перевод столбца в числа из текста
function parseToNumbers(numberOfcolumn) {
  for (let i = 0; i < m; ++i) {
    if (userData[i][numberOfcolumn] != "") {
      userData[i][numberOfcolumn] = Number(userData[i][numberOfcolumn]);
    }
  }
}

//преобразование полученных данных в массив
function createUserData() {
  header = text.data[0];
  userData = new Array(m);
  for (let i = 0; i < m; ++i) {
    userData[i] = new Array(n);
    for (let j = 0; j < n; ++j) {
      userData[i][j] = text.data[i + 1][j];
    }
  }
  for (let i = 0; i < m; ++i) {
    if (userData[i][n - 1] == "") {
      userData.splice(i, 1);
      --i;
      --m;
    }
  }
}

//получение введённых данных в переменную
function getUserData() {
  var inputCSV = document.getElementById("CSVtext").value;
  text = Papa.parse(inputCSV);
  if (isFormatTrue()) {
    createUserData();
  } else {
    alert("Неверный формат данных");
  }
  for (let i = 0; i < n; ++i) {
    if (IscolumnOfNumbers(i)) {
      parseToNumbers(i);
    }
  }
}
//document.getElementById("sendButton").onclick = getUserData;
//поиск уникальных значений столбца в наборе данных
function uniqueVals(data, col) {
  let mySet = new Set();
  for (let row = 0; row < data.length; row++) {
    if (data[row][col] != "") mySet.add(data[row][col]);
  }
  return mySet;
}
function classCounts(rows, numberOfcolumn) {
  let counts = buckets.Dictionary();
  let label;
  for (let i = 0; i < rows.length; ++i) {
    label = rows[i][numberOfcolumn];
    if (label === "") continue;
    if (!counts.containsKey(label)) {
      counts.set(label, 0);
    }
    counts.set(label, counts.get(label) + 1);
  }
  return counts;
}
function returningQuestion(numberOfCol, val, express) {
  this.numberOfColumn = numberOfCol;
  this.value = val;
  this.expression = express;
}
//возвращает текст вопроса
function questionExpressionAndData(numberOfColumn, value) {
  nameOfColumn = header[numberOfColumn];
  let expression = nameOfColumn;
  if (typeof value == typeof 3) {
    expression += " >= ";
    expression += String(value);
  } else {
    expression += " ";
    expression += value;
  }
  this.numberOfColumn = numberOfColumn;
  this.value = value;
  this.expression = expression + " ?";
  //let returningObject = new returningQuestion(numberOfColumn, value, expression + " ?");
  return this;
}
//разделение в зависимости от вопроса
function partition(data, qst) {
  let true_r = [];
  let false_r = [];
  if (IsNumeric(qst.value)) {
    for (let row = 0; row < data.length; row++) {
      if (data[row][qst.numberOfColumn] >= qst.value) {
        true_r.push(data[row]);
      } else {
        false_r.push(data[row]);
      }
    }
  } else {
    for (let row = 0; row < data.length; row++) {
      if (data[row][qst.numberOfColumn] == qst.value) {
        true_r.push(data[row]);
      } else {
        false_r.push(data[row]);
      }
    }
  }
  this.true_rows = true_r;
  this.false_rows = false_r;
  return this;
}
//получение коэф. Джини
function Gini(rows) {
  let counts = classCounts(rows, rows[0].length - 1);
  impurity = 1;
  counts.forEach((element) => {
    let currentProbability = counts.get(element) / rows.length;
    impurity -= Math.pow(currentProbability, 2);
  });
  return impurity;
}
function infoGain(left, right, current_uncertainty) {
  let p = left.length / (left.length + right.length);
  return current_uncertainty - p * Gini(left) - (1 - p) * Gini(right);
}
function findBestSplit(data) {
  let best_gain = 0;
  let best_question;
  let impurity = Gini(data);
  let numOfFeatures = data[0].length;
  for (let col = 0; col < numOfFeatures - 1; col++) {
    let arrOfUniqueVals = uniqueVals(data, col);
    for (let val of arrOfUniqueVals) {
      let question = questionExpressionAndData(col, val);
      let rows = partition(data, question);

      let true_rows = rows.true_rows;
      let false_rows = rows.false_rows;
      if (true_rows.length == 0 || false_rows.length == 0) {
        continue;
      }
      let gain = infoGain(true_rows, false_rows, impurity);
      if (gain >= best_gain) {
        best_gain = gain;
        best_question = {
          expression: question.expression,
          value: question.value,
          numberOfColumn: question.numberOfColumn,
        };
      }
    }
  }

  this.question = best_question;
  this.impurity = best_gain;
  this.newGini = impurity;
  return this;
}

function createLeaf(level, rows) {
  this.level = level;
  let counts = classCounts(rows, rows[0].length - 1);
  let arrayForLeaf = [];
  counts.forEach((element) => {
    let currentProbability = counts.get(element) / rows.length;
    arrayForLeaf.push(
      `${element}:${Number(currentProbability * 100).toFixed(2)}%`
    );
  });
  this.type = "leaf";
  this.data = arrayForLeaf;
  return this;
}

//создание вершины дерева
function createDecisionNode(level, quest, trueBr, falseBr) {
  this.level = level;
  this.type = "node";
  this.question = quest;
  this.trueBranch = trueBr;
  this.falseBranch = falseBr;
  return this;
}

//основная функция для создания дерева
function buildTree(level, rows) {
  ++level;
  let newNode = findBestSplit(rows);
  let NodeObject = {
    question: newNode.question,
    impurity: newNode.impurity,
    newGini: newNode.newGini,
  };
  if (
    NodeObject.impurity == 0 ||
    NodeObject.newGini >= minWeightFractionLeaf ||
    level >= maxDepth - 1 ||
    rows.length <= minSamplesLeaf
  ) {
    return new createLeaf(level, rows);
  }
  let resultRows = partition(rows, NodeObject.question);
  let BranchesObject = {
    true_rows: resultRows.true_rows,
    false_rows: resultRows.false_rows,
  };
  if (
    BranchesObject.true_rows.length == 0 ||
    BranchesObject.false_rows.length == 0
  ) {
    return new createLeaf(level, rows);
  }
  let trueBranch = buildTree(level, BranchesObject.true_rows);
  let falseBranch = buildTree(level, BranchesObject.false_rows);
  return new createDecisionNode(
    level,
    NodeObject.question,
    trueBranch,
    falseBranch
  );
}

var parameterSelectionMethod = document.getElementById("control_panel");
parameterSelectionMethod.addEventListener("click", function () {
  let currValue = parameterSelectionMethod.value;
  if (currValue == 4) {
    for (let i = 0; i < 3; ++i) {
      document
        .getElementsByName("hyperparameter")
        [i].removeAttribute("disabled");
    }
  } else {
    for (let i = 0; i < 3; ++i) {
      document
        .getElementsByName("hyperparameter")
        [i].setAttribute("disabled", "disabled");
    }
  }
});

//Гиперпараметры
var maxDepth;
var minSamplesLeaf;
// var minImpurityDecrease;
var minWeightFractionLeaf;
function setHyperParameters() {
  if (parameterSelectionMethod.value == 4) {
    maxDepth = document.getElementById("maxDepth").value;
    minSamplesLeaf = document.getElementById("minSamplesLeaf").value;
    // minImpurityDecrease = document.getElementById("minImpurityDecrease").value;
    minWeightFractionLeaf = document.getElementById("minWeightFractionLeaf")
      .value;
    if (maxDepth == "" || minSamplesLeaf == "" || minWeightFractionLeaf == "") {
      alert("Не все гиперпараметры введены");
      return true;
    }
  }

  if (parameterSelectionMethod.value == 1) {
    maxDepth = Infinity;
    minSamplesLeaf = 1;
    // minImpurityDecrease = 0;
    minWeightFractionLeaf = 1;
  }

  if (parameterSelectionMethod.value == 2) {
    if (m < 200) {
      maxDepth = 4;
      minSamplesLeaf = 5;
      minWeightFractionLeaf = 1;
    } else {
      if (m < 800) {
        maxDepth = 5;
        minSamplesLeaf = 15;
        minWeightFractionLeaf = 1;
      } else {
        if (m < 1500) {
          maxDepth = 7;
          minSamplesLeaf = 25;
          minWeightFractionLeaf = 0.95;
        } else {
          maxDepth = 8;
          minSamplesLeaf = 40;
          minWeightFractionLeaf = 0.9;
        }
      }
    }
  }

  if (parameterSelectionMethod.value == 3) {
    if (m < 250) {
      maxDepth = 3;
      minSamplesLeaf = 15;
      minWeightFractionLeaf = 1;
    } else {
      if (m < 850) {
        maxDepth = 4;
        minSamplesLeaf = 35;
        minWeightFractionLeaf = 0.95;
      } else {
        if (m < 2000) {
          maxDepth = 5;
          minSamplesLeaf = 50;
          minWeightFractionLeaf = 0.9;
        } else {
          maxDepth = 6;
          minSamplesLeaf = 65;
          minWeightFractionLeaf = 0.85;
        }
      }
    }
  }
  return false;
}

function clicking(e) {
  e.preventDefault();
  getUserData();
  if (setHyperParameters() == true) {
    return;
  }
  tree = buildTree(-1, userData);
  printTree(tree, "treeID", "_");
  // printTree2(tree, "");
}
document.getElementById("sendButton").onclick = clicking;

function printTree(node, ID, lbl) {
  let actual = document.getElementById(ID);

  let li = document.createElement("li");
  let span = document.createElement("span");
  li.id = ID + lbl + "_li";
  span.id = ID + lbl + "_span";
  actual.appendChild(li);
  document.getElementById(li.id).appendChild(span);
  if (node.type === "leaf") {
    span.innerText = node.data;
  } else {
    span.innerText = node.question.expression;
    let ul = document.createElement("ul");
    ul.id = ID + lbl;
    document.getElementById(li.id).appendChild(ul);
    printTree(node.falseBranch, ul.id, "f");
    printTree(node.trueBranch, ul.id, "t");
  }
}
var checking = false;
var IDaddition;
var predict;
function prediction(labelAttribute) {
  if (labelAttribute != "clear") {
    predict = Papa.parse(document.getElementById("predictionText").value);
  }
  let currentNode = tree;
  IDaddition = "";
  while (true) {
    if (labelAttribute == "clear") {
      document.getElementById(`treeID_${IDaddition}_span`).setAttribute("style", "background-color: #ebebebb9");
    } else {
      document.getElementById(`treeID_${IDaddition}_span`).setAttribute("style", "background-color:#0fe0f5"); 
    }
    if (currentNode.type == "leaf") {
      return;
    }
    if (IsNumeric(currentNode.question.value)) {
      if (
        Number(predict.data[0][currentNode.question.numberOfColumn]) >=
        currentNode.question.value
      ) {
        currentNode = currentNode.trueBranch;
        IDaddition += "t";
      } else {
        currentNode = currentNode.falseBranch;
        IDaddition += "f";
      }
    } else {
      if (
        predict.data[0][currentNode.question.numberOfColumn] ==
        currentNode.question.value
      ) {
        currentNode = currentNode.trueBranch;
        IDaddition += "t";
      } else {
        currentNode = currentNode.falseBranch;
        IDaddition += "f";
      }
    }
  }
}
/*
color,diam,fruit
Green,3,Apple
Yellow,3,Apple
Red,1,Grape
Red,1,Grape
Yellow,3,Lemon
 */
/*
Соперник,Играем,Лидеры,Дождь,Победа
Выше,Дома,На месте,Да,Нет
Выше,Дома,На месте,Нет,Да
Выше,Дома,Пропускают,Нет,Нет
Ниже,Дома,Пропускают,Нет,Да
Ниже,В гостях,Пропускают,Нет,Нет
Ниже,Дома,Пропускают,Да,Да
Выше,В гостях,На месте,Да,Нет
Ниже,В гостях,На месте,Нет,Да
*/
document.getElementById("predictionButton").onclick = function () {
  if (checking == false) {
    checking = true;
    prediction();
  } else {
    prediction("clear");
    IDaddition = "";
    prediction("run");
  }
};


// function printTree(node, ID, lbl) {
//   let li = document.createElement("li");
//   let span = document.createElement("span");

//   let new_li_ID = ID + lbl;
//   li.id = new_li_ID;

//   let oldElem = document.getElementById(ID);
//   let newElem = document.getElementById(new_li_ID);

//   if (node.type == "leaf") {
//     span.innerText = node.data;
//   } else {
//     span.innerText = node.question.expression;
//     let ul = document.createElement("ul");
//     newElem.appendChild(ul);
//   }

//   newElem.appendChild(span);
//   oldElem.appendChild(li);

//   if (node.type != "leaf") {
//     printTree(node.falseBranch, ID, "f");
//     printTree(node.trueBranch, ID, "t");
//   }
//   return;
// }

// function printTree2(node, spacing) {
//   if (node.type == "leaf") {
//     console.log(spacing + "prediction:", node.data);
//     return;
//   } else {
//     console.log(spacing + node.question.expression);
//     spacing += "   ";
//     console.log(spacing + "-->true:");
//     printTree2(node.trueBranch, spacing, );
//     console.log(spacing + "-->false:");
//     printTree2(node.falseBranch, spacing);
//   }
// }

