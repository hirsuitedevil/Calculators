class Stack {
  constructor() {
    this.items = [];
  }
  push(value) {
    this.items.push(value);
  }
  pop() {
    return this.items.length ? this.items.pop() : "Oops empty";
  }
  top() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  size() {
    return this.items.length;
  }
}

let inputStringAndroid = "";
let currNumberAndroid = "";
let evaluateFlagAndroid = false;
let expandableAndroid = [
  "cos",
  "log",
  "(",
  ")",
  "DEG",
  "INV",
  "sin",
  "tan",
  "√",
  "^",
  "!",
  "e",
  "ln",
  "π",
  " ",
];
const operatorArrayAndroid = ["^", "+", "-", "*", "/"];
const specialOperatorsAndroid = ["log", "cos", "sin", "tan", "ln", "√","abs",];
const variablesAndroid = ["π", "e"];
let lastValAndroid = "";
const operatorPrecedenceAndroid = {
  "^": 0,
  "/": 1,
  "*": 1,
  "+": 2,
  "-": 2,
};

const inputTagAndroid = document.getElementById("inputAndroid");
const resultTagAndroid = document.getElementById("resultAndroid");

const handleInputANDROID = (e) => {
  if (isValidParenthesisANDROID(inputStringAndroid, e)) {
    if (isNumericOrDotANDROID(e)) {
      handleNumberInputANDROID(e);
    } else {
      if (operatorArrayAndroid.includes(e)) {
        handleOperatorInputANDROID(e);
      } else if (specialOperatorsAndroid.includes(e)) {
        inputStringAndroid += e + "(";
        inputTagAndroid.value = inputStringAndroid;
      } else {
        inputStringAndroid += e;
        inputTagAndroid.value = inputStringAndroid;
      }
    }
  }
  inputTagAndroid.dispatchEvent(new Event("update"));
};
const isValidParenthesisANDROID = (inputStringAndroid, newChar) => {
  let openCount = 0;
  for (const char of inputStringAndroid) {
    if (char === "(") {
      openCount++;
    } else if (char === ")") {
      openCount--;
      if (openCount < 0) return false;
    }
  }
  if (newChar === "(") {
    return true;
  } else if (newChar === ")") {
    return openCount > 0;
  }

  return true;
};

const handleAbsANDROID = () => {
  inputStringAndroid += "abs(";
  inputTagAndroid.value = inputStringAndroid;
  inputTagAndroid.dispatchEvent(new Event("update"));
};
const handleSquareANDROID = () => {
  const lastNum =
    currNumberAndroid || inputStringAndroid.split(/[^0-9.]+/).pop();
  if (lastNum) {
    inputStringAndroid += `^2`;
    inputTagAndroid.value = inputStringAndroid;
    inputTagAndroid.dispatchEvent(new Event("update"));
  }
};
const isNumericOrDotANDROID = (char) => !isNaN(char) || char === ".";

const isNumericOrDotANDROIDorPercent = (char) =>
  !isNaN(char) || char === "." || char === "%";

const handleNumberInputANDROID = (e) => {
  if (e === "." && currNumberAndroid.includes(".")) return;
  inputStringAndroid += e;
  currNumberAndroid += e;
  inputTagAndroid.value = inputStringAndroid;

  evaluateFlagAndroid = inputStringAndroid.split(/[/*+-]/).length >= 2;
};

const handleOperatorInputANDROID = (e) => {
  if (operatorArrayAndroid.includes(inputStringAndroid.slice(-1))) {
    inputStringAndroid = inputStringAndroid.slice(0, -1) + e;
  } else {
    inputStringAndroid += e;
  }
  inputTagAndroid.value = inputStringAndroid;
  currNumberAndroid = "";
};

const evaluateANDROID = (inputStr) => {
  try {
    const result = evaluateExpressionANDROID(inputStr);
    if (
      result === undefined ||
      result === null ||
      result === "Oops empty" ||
      isNaN(result) ||
      result === Infinity ||
      result === -Infinity
    ) {
      throw new Error("Invalid result");
    } else {
      evaluateFlagAndroid = true;
    }
    resultTagAndroid.value = result;
    lastValAndroid = evaluateFlagAndroid ? result : "";
  } catch (error) {
    resultTagAndroid.value = lastValAndroid || "";
  }
};

const evaluateExpressionANDROID = (inputStr) => {
  const numStackAndroid = new Stack();
  const operatorStackAndroid = new Stack();
  let num = "";

  for (let i = 0; i < inputStr.length; i++) {
    const char = inputStr[i];
    if (isNumericOrDotANDROID(char)) {
      while (i < inputStr.length && isNumericOrDotANDROIDorPercent(inputStr[i])) {
        num += inputStr[i++];
      }
      numStackAndroid.push(processPercentageANDROID(num));
      num = "";
      i--;
    } else if (char === "(") {
      operatorStackAndroid.push(char);
    } else if (char === ")") {
      processUntilLeftParenthesisANDROID(numStackAndroid, operatorStackAndroid);
    } else if (char === "!") {
      const val = numStackAndroid.pop();
      numStackAndroid.push(processFactorialANDROID(val));
    } else if (operatorArrayAndroid.includes(char)) {
      processOperatorsANDROID(char, numStackAndroid, operatorStackAndroid);
    } else if (variablesAndroid.includes(char)) {
      const val = processVariableANDROID(char);
      numStackAndroid.push(val);
    } else {
      let opr = "";
      while (inputStr[i] != "(") {
        opr += inputStr[i];
        i++;
      }
      operatorStackAndroid.push(opr);
    }
  }

  while (!operatorStackAndroid.isEmpty()) {
    processOperatorFromStackANDROID(numStackAndroid, operatorStackAndroid);
  }
  return numStackAndroid.top();
};

const processFactorialANDROID = (n) => {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

const processVariableANDROID = (char) => {
  switch (char) {
    case "e":
      return Math.E;
    case "π":
      return Math.PI;
  }
};
const processUntilLeftParenthesisANDROID = (numStackAndroid, operatorStackAndroid) => {
  while (!operatorStackAndroid.isEmpty() && operatorStackAndroid.top() !== "(") {
    processOperatorFromStackANDROID(numStackAndroid, operatorStackAndroid);
  }
  operatorStackAndroid.pop();
};

const processOperatorsANDROID = (currentOp, numStackAndroid, operatorStackAndroid) => {
  while (
    !operatorStackAndroid.isEmpty() &&
    operatorPrecedenceAndroid[operatorStackAndroid.top()] <= operatorPrecedenceAndroid[currentOp]
  ) {
    processOperatorFromStackANDROID(numStackAndroid, operatorStackAndroid);
  }
  operatorStackAndroid.push(currentOp);
};

const processOperatorFromStackANDROID = (numStackAndroid, operatorStackAndroid) => {
  const op = operatorStackAndroid.pop();
  if (operatorArrayAndroid.includes(op)) {
    const value1 = numStackAndroid.pop();
    const value2 = numStackAndroid.pop();
    numStackAndroid.push(calcANDROID(value1, value2, op));
  } else if (specialOperatorsAndroid.includes(op)) {
    const value1 = numStackAndroid.pop();
    numStackAndroid.push(calcSpecialANDROID(value1, op));
  }
};
const calcSpecialANDROID = (value1, opr) => {
  switch (opr) {
    case "log":
      return Math.log10(value1);
    case "cos":
      return Math.cos(value1);
    case "sin":
      return Math.sin(value1);
    case "tan":
      return Math.tan(value1);
    case "ln":
      return Math.log(value1);
    case "√":
      return Math.sqrt(value1);
    case "abs":
      return Math.abs(value1);
  }
};
const calcANDROID = (value1, value2, opr) => {
  switch (opr) {
    case "+":
      return value2 + value1;
    case "-":
      return value2 - value1;
    case "*":
      return value2 * value1;
    case "/":
      return value1 !== 0 ? value2 / value1 : Infinity;
    case "^":
      return Math.pow(value2, value1);
  }
};

const processPercentageANDROID = (numStr) => {
  const [number, percentSigns] = numStr.split(/(%)/);
  return (
    parseFloat(number) / Math.pow(100, percentSigns ? percentSigns.length : 0)
  );
};

const handleEqualsANDROID = () => {
  evaluateANDROID(inputStringAndroid);
  resetCalcANDROID(false);
};

const resetCalcANDROID = (clearResult = true) => {
  if (clearResult) resultTagAndroid.value = "";
  inputStringAndroid = "";
  currNumberAndroid = "";
  evaluateFlagAndroid = false;
  inputTagAndroid.value = inputStringAndroid;
  lastValAndroid = "";
};

const backspaceANDROID = () => {
  inputStringAndroid = inputStringAndroid.slice(0, -1);
  currNumberAndroid = currNumberAndroid.slice(0, -1);
  inputTagAndroid.value = inputStringAndroid;
  inputTagAndroid.dispatchEvent(new Event("update"));
};

function toggleExpandANDROID() {
  const expandableButtons = document.querySelectorAll('.expandable');
  expandableButtons.forEach(button => {
      button.classList.toggle('show'); 
  });

  const expand2 = document.querySelectorAll('#expand2');
  expand2.forEach(row => {
    row.classList.toggle('show');
  })
}

const expandButton = document.getElementById("Expand");
expandButton.addEventListener("click", toggleExpandANDROID);


inputTagAndroid.addEventListener("update", () => evaluateANDROID(inputStringAndroid));


let currNumberIos = "";
let resultIos;
let prevoperIos;
let curroperIos;

const handleNumberIOS = (e) => {
  if (currNumberIos.includes(".") && e == ".") {
    inputChangeIOS(currNumberIos);
  } else {
    currNumberIos = currNumberIos + e;
    inputChangeIOS(currNumberIos);
  }
};
const handleOperatorIOS = (e) => {
  if (["+", "-", "*", "/"].includes(e)) {
    if (document.querySelector(".inverted")) {
      const tag = document.querySelector(".inverted");
      tag.classList.toggle("inverted");
    }
    changeClass(e);
  } else if (e === "=") {
    if (document.querySelector(".inverted")) {
      const tag = document.querySelector(".inverted");
      tag.classList.toggle("inverted");
    }
  }
  if (currNumberIos !== "") {
    curroperIos = e;
    let numIos = parseFloat(currNumberIos);
    if (resultIos === undefined && prevoperIos === undefined) {
      resultIos = numIos;
      prevoperIos = curroperIos;
      currNumberIos = "";
    } else {
      if (curroperIos === "=") {
        performCalcIOS(numIos);
        inputChangeIOS("= " + resultIos);
        resetCalcIOS(false);
      } else if (curroperIos === "%") {
        numIos = numIos / 100;
        currNumberIos = numIos;
        inputChangeIOS(currNumberIos);
      } else {
        performCalcIOS(numIos);
        prevoperIos = curroperIos;
      }
    }
  }
};
const changeClass = (e) => {
  const tag = document.getElementById(e);
  tag.classList.toggle("inverted");
};
const performCalcIOS = (numIos) => {
  if (prevoperIos === "+") {
    resultIos = resultIos + numIos;
  } else if (prevoperIos === "-") {
    resultIos = resultIos - numIos;
  } else if (prevoperIos === "*") {
    resultIos = resultIos * numIos;
  } else if (prevoperIos === "/") {
    resultIos = resultIos / numIos;
  } else if (prevoperIos === "%") {
    resultIos = resultIos / 100;
  }
  currNumberIos = "";
};

const resetCalcIOS = (flag) => {
  currNumberIos = "";
  resultIos = undefined;
  curroperIos = undefined;
  prevoperIos = undefined;
  if (flag) {
    inputChangeIOS(currNumberIos);
  }
};

const handleAbsIOS = () => {
  if (currNumberIos[0] === "-") {
    let temp = currNumberIos.split("-");
    currNumberIos = temp[1];
    inputChangeIOS(currNumberIos);
  } else {
    let temp = "-" + currNumberIos;
    currNumberIos = temp;
    inputChangeIOS(currNumberIos);
  }
};

const inputChangeIOS = (numIos) => {
  const input = document.getElementById("inputIOS");
  input.value = numIos;
};

const IOSvisible = document.getElementById("iosButton").addEventListener("click", () => {
  document.getElementById("iosButton").style.display = "none";
  document.getElementById("iosCalculator").style.display = "block";
  document.getElementById("iosBack").style.display = "block";
  document.getElementById("iosDivID").style.alignItems = "flex-start";
});

const IOShidden = document.getElementById("iosBack").addEventListener("click", () => {
  document.getElementById("iosButton").style.display = "block";
  document.getElementById("iosCalculator").style.display = "none";
  document.getElementById("iosBack").style.display = "none";
  document.getElementById("iosDivID").style.alignItems = "center";
});

const Androidvisible = document.getElementById("androidButton").addEventListener("click", () => {
  document.getElementById("androidButton").style.display = "none";
  document.getElementById("androidCalculator").style.display = "block";
  document.getElementById("androidBack").style.display = "block";
  document.getElementById("androidDivID").style.alignItems = "flex-start";
});

const Androidhidden = document.getElementById("androidBack").addEventListener("click", () => {
  document.getElementById("androidButton").style.display = "block";
  document.getElementById("androidCalculator").style.display = "none";
  document.getElementById("androidBack").style.display = "none";
  document.getElementById("androidDivID").style.alignItems = "center";
});

