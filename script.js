
// Access input display container to change content.
let inputDisplay= document.querySelector(".user-input-display");

// get the buttons list to attach event listener to each button
let buttonsList = document.querySelectorAll("button");
let dataValue;

buttonsList.forEach(button =>{
        button.addEventListener("click", function(event){
        dataValue = event.currentTarget.dataset.value;
        console.log(dataValue);

        displayInput(dataValue);
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
      git      }
            else{
                inputDisplay.textContent= inputDisplay.textContent.slice(0,-1);
            }
        })
    })
    
}

deletion();


// binary operators calculation function
function binaryCalculation(value){
    
    let firstOperand = 0;
    let secondOperand = 0;
    let operator = null; 



}