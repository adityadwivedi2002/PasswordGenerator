const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 1;

handleSlider();
// set strength circle color to grey
setIndicator("#ccc");

// set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min))+"% 100%"

}
 
function setIndicator(color){
    indicator.style.backgroundColor = color;
    // homework shadow effect
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandInteger(min , max){
   return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRandInteger(0 , 9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandInteger(97 , 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandInteger(65 , 91));
}

function generateSymbol(){
    const randNum = getRandInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
      } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
      ) {
        setIndicator("#ff0");
      } else {
        setIndicator("#f00");
      }
}

async function copyContent() {

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }

    catch(e){
        copyMsg.innerText = "Failed";
    }
      
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },1000);
}

// Shuffle the array randomly - Fisher Yates Method

function shufflePassword(array){
    for(let i = array.length-1; i>0;i--){
        //  random j find 
        const j = Math.floor(Math.random()*(i+1));
        // swap number 
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}


function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkBox) => {
        if(checkBox.checked)
        checkCount++;
    });

    // special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}


allCheckBox.forEach((checkBox) => {
    checkBox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click',() => {
// none of the checkbox are zero
    if(checkCount <= 0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    console.log("start")
    // lets start the turning to find new password

    // remove old password
    password = "";

    // lets put the stuff mention by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let functArr = [];

    if(uppercaseCheck.checked)
        functArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        functArr.push(generateLowerCase);

    if(numbersCheck.checked)
        functArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        functArr.push(generateSymbol);

    // compulsory addition
     
    for(let i = 0; i<functArr.length;i++){
        password += functArr[i]();
    }
    console.log("medium")
    //remaining addition

    for(let i=0;i<passwordLength-functArr.length;i++){
        let randIndex = getRandInteger(0,functArr.length);
        password += functArr[randIndex]();
    }

    console.log("comp")
    //shuffle the password

    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

        // calculation strength 
        calcStrength();


})

















