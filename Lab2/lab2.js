//Lab 2, Colten Stamm

var alertButton = document.getElementById("dateAlertButton");
var pageButton = document.getElementById("datePageButton");
var onPageDateText = document.getElementById("dateText");
var onPageTimeText = document.getElementById("timeText");
var timeDropdown = document.getElementById("timeTypeDrop");
const dateObj = new Date;
const monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var time12 = true; //boolean, if false, show time in 24 hour, if true show in 12 hour. Updates onChange from the select tag
datePage(); //Page loaded with on-page display of date and time


//Called if the alert button is pressed, changes border color of buttons to show which one is currently selected, 
//displays date and time in alert
function dateAlert(){
    pageButton.style.borderColor = "black";
    alertButton.style.borderColor = "red";
    onPageDateText.innerHTML = `The date today is: `;
    onPageTimeText.innerHTML = `The time today is: `;
    alert(`${getDateText()}\n${getTimeText()}`);

}

//Called if the on-page display button is pressed, changes border color of buttons to show which one is currently selected,
//displays date and time on page
function datePage(){
    alertButton.style.borderColor = "black";
    pageButton.style.borderColor = "red";
    onPageDateText.innerHTML = getDateText();
    onPageTimeText.innerHTML = getTimeText();
}

//fetches and formats date
function getDateText(){
    return `The date today is: ${monthsArr[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
}

//Formats the time to be either 12 or 24 hour schemes based on the value of global var time12, includes AM/PM if necessary
//Special cases to handle if the hour is 0 or 12
function getTimeText(){
    let result = `The time today is: `;
    let tmp = ``;
    if(time12){ //12 hour system
        tmp = dateObj.getHours() >= 12 ? `PM` : `AM`;
        dateObj.getHours() % 13 == 0 ? result += 12 : result += dateObj.getHours() % 13;
    }else{ //24 hour system
        result += dateObj.getHours();
        if(dateObj.getHours() == 0){result += 0;}
    }
    result += `:${dateObj.getMinutes()}${tmp}`;
    return result;
}