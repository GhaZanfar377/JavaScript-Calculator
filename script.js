
// Access input display container and result to change content.
let inputDisplay= document.querySelector(".user-input-display");
let resultDisplay = document.querySelector(".results");

// get the buttons list to attach event listener to each button
let buttonsList = document.querySelectorAll("button");
let dataValue;

buttonsList.forEach(button =>{
        button.addEventListener("click", function(event){
        dataValue = event.currentTarget.dataset.value;

        displayInput(dataValue);

        binaryCalculation();
        
    })
})

// function to display inputs 
function displayInput(value){
    if(value!== undefined){
        inputDisplay.textContent+= value;
    }

    
}


// Delete top or clearAll character function

function deletion(){
    let target = document.querySelectorAll(".cross-btn, .AC-btn");
    target.forEach(button =>{
        button.addEventListener("click", function(event){
            if(event.currentTarget.dataset.action === "cross-all"){
                inputDisplay.textContent = "";
                resultDisplay.textContent="";
            }
            else{
                inputDisplay.textContent= inputDisplay.textContent.slice(0,-1);
            }
        })
    })
    
}

deletion();


// binary operators calculation function doing calculation in presidence order

function binaryCalculation(){
    
    let inputArray;
    let binaryResult;

    // converts the user inputs to an array for operations
    if(inputDisplay.textContent!==undefined){
        inputArray= inputDisplay.textContent.split(/([+×÷\/-])/).filter(Boolean);
    }

    // handling if - or + are entered as first entry.

    if(inputArray[0] === "-" || inputArray[0] === "+"){

        inputArray.splice(inputArray[0], 2, inputArray[0] + inputArray[1]);
    }

    // loop to inputArray and do calculation only if an operand exists after the operator
    for (let i= 1; i<inputArray.length-1; i++){
        
        if(
            inputArray[i] === "×" ||
            inputArray[i] === "/" 
        ){


            if(inputArray[i+1] !== ""){

                let firstOperand= Number(inputArray[i-1]);
                let secondOperand= Number(inputArray[i+1]);

                if(inputArray[i] === "×"){
                    binaryResult= firstOperand*secondOperand;
                }
                
                else{
                    binaryResult = firstOperand/secondOperand;
                }


                // splicing the array so that result should be updated
                inputArray.splice(i-1, 3, String(binaryResult));

                i--;  //update index after splitting

            }
             
        }

    }


    // loop for handling addition and substraction 

    for(let i=0; i<inputArray.length-1; i++){

        if(inputArray[i] === "-" || inputArray[i] === "+"){

            // decides the operands when operator is entered.
            let firstOperand= Number(inputArray[i-1]);
            let secondOperand= Number(inputArray[i+1]);


            if(inputArray[i] === "+"){
                binaryResult= firstOperand+secondOperand;
            }
            
            else if(inputArray[i] === "-"){
                binaryResult = firstOperand-secondOperand;
            }

            else{
                continue;
            }

            inputArray.splice(i - 1, 3, String(binaryResult));
            i--;

        }

    }

    resultDisplay.textContent = binaryResult;
}



// function for unary operators

function unaryCalculation(){
    
}