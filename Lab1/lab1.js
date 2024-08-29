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