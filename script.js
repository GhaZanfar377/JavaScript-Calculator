
// Access input display container and result to change content.
let inputDisplay = document.querySelector(".user-input-display");
let resultDisplay = document.querySelector(".results");
let inputContainer = document.querySelector(".user-input-container");

// get the buttons list to attach event listener to each button
let buttonsList = document.querySelectorAll("button");
let dataValue;
let dataAction;

// to find in which calculation stage the calculator is
let equalsClicked;

//  for better display of operations
let rawInput = "";

function formatForDisplay(rawText) {
    return rawText
        .replace(/x²/g, "²")
        .replace(/1\/x/g, "⁻¹");
}



// get data value and data action or each button when clicked
buttonsList.forEach(button => {
    button.addEventListener("click", function (event) {
        dataValue = event.currentTarget.dataset.value;
        dataAction = event.currentTarget.dataset.action;

        displayInput(dataValue);


        // calling calculations functions to show final result
        let cleanedArray = unaryCalculation();
        let finalResult = binaryCalculation(cleanedArray);

        displayResult(finalResult);


        // calling equals to function
        if (dataAction === "=") {
            equalsTo();
        }

    })
})


// function to display inputs 
function displayInput(value) {
    if (value !== undefined) {

        if (equalsClicked === true) {


            inputContainer.style.display = "";
            resultDisplay.style.fontSize = "";

            // handling if input is an operator other than underroot
            let isOperator = value === "+" || value === "-" || value === "×" || value === "/" || value === "x²" || value === "1/x" || value === "%";
            if (isOperator) {
                rawInput = resultDisplay.textContent + value;
            }

            else {
                rawInput = value;
            }

            inputDisplay.textContent = formatForDisplay(rawInput);
            scrollInputToEnd();

            equalsClicked = false;
        }

        else {


            if (value === ".") {
                let currentNumber = rawInput.match(/[0-9.]*$/)[0];

                if (currentNumber.includes(".")) {
                    return;
                }
            }



            // handling double operators, and operator followed by -

            let currentOperator = value === "+" || value === "-" || value === "×" || value === "/";  //current value is an operator or not?
            let prevValue = rawInput.slice(-1);  //get previous value

            let prevIsOprerator = prevValue === "+" || prevValue === "-" || prevValue === "×" || prevValue === "/";  //previous value is an operator or not?
            let isSignException = value === "-" && (prevValue === "+" || prevValue === "×" || prevValue === "/");  //is "-" being followed by any other operator

            if(currentOperator && prevIsOprerator && (!isSignException)){;
                return;
            }

            rawInput += value;
            inputDisplay.textContent = formatForDisplay(rawInput);
            scrollInputToEnd();
        }

    }


}




// result displaying function
function displayResult(value) {

    if (rawInput === "") {
        resultDisplay.textContent = "";
        return;
    }

    if (!Number.isNaN(Number(value))) {
        resultDisplay.textContent = value;
        resultDisplay.scrollLeft = resultDisplay.scrollWidth;
    }
}

// Delete top or clearAll character function

function deletion() {
    let target = document.querySelectorAll(".cross-btn, .AC-btn");
    target.forEach(button => {
        button.addEventListener("click", function (event) {


            equalsClicked = false;
            inputContainer.style.display = "";
            resultDisplay.style.fontSize = "";
            
            if (event.currentTarget.dataset.action === "cross-all") {
                rawInput = "";
                inputDisplay.textContent = "";
                resultDisplay.textContent = "";
            }

            else {
                rawInput = rawInput.slice(0, -1);
                inputDisplay.textContent = formatForDisplay(rawInput);

                let cleanedArray = unaryCalculation();
                let finalResult = binaryCalculation(cleanedArray);
                displayResult(finalResult);
            }
        })
    })

}

deletion();


// binary operators calculation function doing calculation in presidence order

function binaryCalculation(inputArray) {

    let binaryResult;

    // loop to inputArray and do calculation only if an operand exists after the operator
    for (let i = 1; i < inputArray.length - 1; i++) {

        if (
            inputArray[i] === "×" ||
            inputArray[i] === "/"
        ) {


            if (inputArray[i + 1] !== "") {

                let firstOperand = Number(inputArray[i - 1]);
                let secondOperand = Number(inputArray[i + 1]);

                if (inputArray[i] === "×") {
                    binaryResult = firstOperand * secondOperand;
                }

                else {
                    binaryResult = firstOperand / secondOperand;
                }


                // splicing the array so that result should be updated
                inputArray.splice(i - 1, 3, String(binaryResult));

                i--;  //update index after splitting

            }

        }

    }


    // loop for handling addition and substraction 

    for (let i = 1; i < inputArray.length - 1; i++) {

        if (inputArray[i] === "-" || inputArray[i] === "+") {

            // decides the operands when operator is entered.
            let firstOperand = Number(inputArray[i - 1]);
            let secondOperand = Number(inputArray[i + 1]);


            if (inputArray[i] === "+") {
                binaryResult = firstOperand + secondOperand;
            }

            else if (inputArray[i] === "-") {
                binaryResult = firstOperand - secondOperand;
            }

            else {
                continue;
            }

            inputArray.splice(i - 1, 3, String(binaryResult));
            i--;

        }

    }

    return inputArray[0];

}



// function for unary operators

function unaryCalculation() {

    // splitting the expression to array for calculations

    let unaryResult;
    let inputArray;

    if (rawInput !== undefined) {

        inputArray = rawInput.split(/(\+|-|×|\/|√|%|x²|1\/x)/).filter(Boolean);
    }


    // loop for gluing "+" or "-" to the next character, "+" at start entry only byt "-" anywhere

    for (let i = 0; i < inputArray.length - 1; i++) {

        let isStart = i === 0;    //are we at start or not?

        // previous value is any given operator?
        let prevIsPlusOrMulOrDiv = inputArray[i-1] === "+" || inputArray[i-1] === "×" || inputArray[i-1] === "/";

        let isSignSpot = isStart || prevIsPlusOrMulOrDiv;    // whether we are at start or previous value is a mentioned operator?

        let isSignCharacter = inputArray[i] === "-" || (isStart && inputArray[i] === "+");

        if (isSignCharacter && isSignSpot && inputArray[i+1] !== undefined) {
            inputArray.splice(i, 2, inputArray[i] + inputArray[i+1]);
        }
    }

    // handling the operators and modifying the array as according to calculations
    for (let i = 0; i < inputArray.length; i++) {

        let number;
        if (inputArray[i] === "√" && inputArray[i + 1] !== undefined) {
            number = Number(inputArray[i + 1]);
            unaryResult = Math.sqrt(number);
            inputArray.splice(i, 2, unaryResult);
            i--;
        }


        else if (inputArray[i] === "x²") {

            if (inputArray[i - 1] !== undefined) {
                number = Number(inputArray[i - 1]);
                unaryResult = number ** 2;
                inputArray.splice(i - 1, 2, unaryResult);
                i--;
            }
        }

        else if (inputArray[i] === "1/x") {

            if (inputArray[i - 1] !== undefined) {
                number = Number(inputArray[i - 1]);
                unaryResult = 1 / number;
                inputArray.splice(i - 1, 2, unaryResult);
                i--;
            }
        }



        // handling the percentage operator on the context

        else if (inputArray[i] === "%") {

            let prevOperator = inputArray[i - 2];
            let prevNumber = Number(inputArray[i - 3]);

            /* "%" produces different results based on the context such as when a previous
             operator in the expression exists or not, so handling result based on the context:
            */

            if (inputArray[i - 1] !== undefined) {

                number = Number(inputArray[i - 1]);

                // calculate result based on the presvious operators
                let startIndex;

                if (prevOperator === "+") {
                    unaryResult = prevNumber + (prevNumber * number / 100);
                    startIndex = i - 3;
                }

                else if (prevOperator === "-") {
                    unaryResult = prevNumber - (prevNumber * number / 100);
                    startIndex = i - 3;
                }

                else if (prevOperator === "×") {
                    unaryResult = prevNumber * number / 100;
                    startIndex = i - 3;
                }

                else if (prevOperator === "/") {
                    unaryResult = prevNumber / (number / 100);
                    startIndex = i - 3;
                }

                // calculate result when "%"" is the very first element
                else {
                    unaryResult = number / 100;
                    startIndex = i - 1;
                }


                // splice the array with updated result
                inputArray.splice(startIndex, i - startIndex + 1, unaryResult);
                i = startIndex;


            }
        }
    }

    // if no operator remains between two operands then by default multiply them.
    for (let i = 0; i < inputArray.length - 1; i++) {

        let currentIsOperator = inputArray[i] === "+" || inputArray[i] === "-" || inputArray[i] === "×" || inputArray[i] === "/";
        let nextIsOperator = inputArray[i + 1] === "+" || inputArray[i + 1] === "-" || inputArray[i + 1] === "×" || inputArray[i + 1] === "/";

        if (currentIsOperator === false && nextIsOperator === false) {
            inputArray.splice(i + 1, 0, "×");
        }
    }
    return inputArray;
}



// handlling "=" function
function equalsTo() {
    equalsClicked = true;

    inputContainer.style.display = "none";
    resultDisplay.style.fontSize = "45px";


}



// handling overflowing input length
function scrollInputToEnd(){
    let container = document.querySelector(".user-input-container");
    container.scrollLeft = container.scrollWidth;
}
