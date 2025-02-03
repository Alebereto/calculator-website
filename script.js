const display = document.getElementById("calc-display");
const mathOperations = ["+", "-", "*", "/"];

// object for each number in equation
class CalcNumber {
  #num = "";

  setNumber(v) {
    if (typeof (v) === "number") {
      this.#num = String(v);
    }
  }

  toString() {
    return this.#num;
  }

  clear() {
    this.#num = "";
  }

  isEmpty() {
    return this.#num === "";
  }

  isValidNumber() {
    return this.#num !== "" && this.#num !== "-";
  }

  // returns false if could not input negative to number
  addChar(c) {
    // if input is "-" and number is not empty, return false
    if (this.#num.length > 0 && c === "-") return false;
    // if input is decimal mark
    if (c === ".") {
      // if number already has decimal mark
      if (this.#num.indexOf(".") > -1) return true;
      // if number does not have a first digit, make it zero
      else if (this.#num === "" || this.#num === "-") {
        this.#num += "0.";
        return true;
      }
    }
    this.#num += c;
    return true;
  }

  deleteChar() {
    this.#num = this.#num.slice(0, -1);
  }
}

// adds click event listener to buttons
function linkButtons() {
  const calcButtons = document.getElementsByClassName("calc-button");
  for (let i = 0; i < calcButtons.length; ++i) {
    calcButtons[i].addEventListener("click", onClick);
  }
}

// sets given string as display of calculator
function setDisplay(str) {
  if (typeof (str) !== "string") return;
  display.innerText = str;
}

// returns current calculator equation as a string
function getCurrentEquation() {
  let eq = numOne.toString();
  if (operation === null) return eq;
  eq += " " + operation;
  if (numTwo.isEmpty()) return eq;
  return eq + " " + numTwo.toString();
}

// updates the calculator display with current equation
function updateDisplay() {
  setDisplay(getCurrentEquation());
}


// clears calculator equation
function clear() {
  numTwo.clear();
  operation = null;
  numOne.clear();
  updateDisplay();
}

// called when user presses on a digit, decimal mark or negative
// returns false if could not input negative to current number
function addDigit(v) {
  let success = false;
  if (operation === null) {
    success = numOne.addChar(v);
  }
  else {
    success = numTwo.addChar(v);
  }
  if (success) updateDisplay();
  return success;
}

function addOperation(v) {
  if (operation === null && numOne.isValidNumber()) {
    operation = v;
  }
  else if (operation !== null && numTwo.isValidNumber()) {
    let result = calculate();
    clear();
    numOne.setNumber(result);
    operation = v;
  }
  updateDisplay();
}

// deletes last character in equation
function deleteChar() {
  if (!numTwo.isEmpty()) {
    numTwo.deleteChar();
  }
  else if (operation !== null) {
    operation = null;
  }
  else {
    numOne.deleteChar();
  }
  updateDisplay();
}

// returns the value of the current equation as a number,
// null if equation is invalid and undefined if there is a math error
function calculate() {
  if (!numTwo.isValidNumber()) return null;
  if (operation == "/" && Number(numTwo.toString()) === 0) return undefined;
  let a = Number(numOne.toString()), b = Number(numTwo.toString());
  switch (operation) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return a / b;
  }
  return null;
}

// called when "=" is pressed
function equate() {
  let result = calculate();
  if (result === undefined) {
    clear();
    setDisplay("Error");
  }
  else if (result !== null) {
    clear();
    numOne.setNumber(result);
    updateDisplay();
  }
}

// called when clicking on a calculator button
function onClick(ev) {
  let v = ev.target.dataset.val;
  if (v === undefined || v.length !== 1) return;

  if (v === "-" || v === "." || (v >= "0" && v <= "9")) {
    if (addDigit(v)) return;
  }
  if (mathOperations.includes(v)) {
    addOperation(v);
  }
  else {
    switch (v) {
      case "=": equate();
        break;
      case "D": deleteChar();
        break;
      case "C": clear();
    }
  }
}

linkButtons();
const numOne = new CalcNumber();
const numTwo = new CalcNumber();
let operation = null;
