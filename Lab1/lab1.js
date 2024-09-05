//Lab 1, Colten Stamm


//called on button press, generates an array of 5 random numbers 0-99, finds the mean,
//and a second array for which of the 5 numbers are greater than the mean, outputs all of this to HTML
function fillRandArr(){
    var arr = [];
    var greaterArr = [];
    var mean = 0;
    var tmp;
    while(arr.length < 5){
        tmp = Math.floor(Math.random() * 100);
        mean += tmp;
        arr.push(tmp);
    }
    mean /= 5;
    for(let i = 0; i < arr.length; i++){
        if(arr[i] > mean){
            greaterArr.push(arr[i]);
        }    
    }

    document.getElementById("textOutput").innerHTML = "Array: " + arr + "<br>Mean: " + mean + "<br>Greater: " + greaterArr;

}