
let arr1 = [1,2,3,4, 5]
let arr2 = []

// cooper s - random number generator to be replaced by check_buy)orders and check_sell_orders
const R = (min, max) => {
    return Math.floor((Math.random()*max)+min)
}//end R

while( arr2.length < arr1.length ) {
    setInterval ( async () => {
    let randomNum = R(1,5); 
    //console.log("random number: ", randomNum );

    for (i in arr1) {
        let num = arr1[i];

        //cooper s - add order number to the closed order list only if not there already
        if (num == randomNum && !arr2.includes(num)){
            arr2.push(num)
        }//end if
       }//end for 
    }, 60000);
}//end while


console.log("final arr2: ", arr2 )
