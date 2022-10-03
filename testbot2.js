/***********************************************************************************/ 

// set up prvider, primary and secondary addresses
const {provider, acct1, acct2, privateKey, signer, account } = require("./modules/accts");

/********************************************************************* */
const {getCurrentPrice} = require('./modules/getCurrentPrice.js');
const {getPrice} = require('./modules/getPrice.js');
const {check_buy_orders} = require('./modules/check_buy_orders.js')
const {check_sell_orders} = require('./modules/check_sell_orders.js')

const {buy} = require('./modules/buy')
const {sell} = require('./modules/sell')

const { buySwap } = require('./modules/buyswap');
const { sellSwap } = require('./modules/testSell-2');

//const { check_buys } = require('./modules/returnTrue');
const { check_sells } = require('./modules/returnTrue');
const { check_orders } = require('./modules/returnTrue');

const { testPrice } = require('./modules/testPrice');

let config = require("./config");

let buyOrders=[];
let sellOrders=[];
let closedOrders=[];

let orders = [];
let closed = false;
let orderId = 0;

let count = 0;

const start = async (startPrice) => {
    startPrice = Math.round(startPrice);
    console.log("start price: ", startPrice );

// cooper s - set buy gried
    if (buyOrders.length == 0 ) {
    for (var i=1; i <= config.NUM_BUY_GRID_LINES; ++i ){
        let price = startPrice - (config.GRID_SIZE*i);
        const buyOrder = {
                            id:i,
                            order: Math.round(price),
                        }
        buyOrders.push(buyOrder)
     }//end for Buy
    }//end if
    //console.log("buy order grid: ", buyOrders );

    if (sellOrders.length == 0) {
        for (var i=1; i <= config.NUM_SELL_GRID_LINES; ++i ){
            let price = startPrice + (config.GRID_SIZE*i);
            const sellOrder = {
                                id:i,
                                order: Math.round(price),
                            }
            sellOrders.push(sellOrder)
        }//end for Sell       
    } 
    //console.log("sell order grid: ", sellOrders )  

        // 1) get latest price
        let currentPrice = Math.round(await getPrice()) ;
        console.log("current price: ", currentPrice)


    //cooper s - for testing purposes only
    //currentPrice = 1329

/*
    while( closedOrders.length < buyOrders.length )  {

        console.log("closeOrders length: ",closedOrders.length," buyOrders.length: ", buyOrders.length)
        
        // 2) check buy orders-add completed buy/sells to closed list
        const buyResult = await check_buy_orders(currentPrice, buyOrders, closedOrders)
        console.log("buy orders result: ", buyResult );
        
        const sellResult = await check_sell_orders(sellOrders)
        console.log("sell orders result: ", sellResult );

        // 3) Wnen the closed liist is full - stop

        if (buyResult !== false) {
            console.log("add closed buy order to array: ", buyResult )
            //closedOrders.push(buyResult);

            for (i in buyOrders) {
                let num = buyOrders[i].id;
    
                //cooper s - add order number to the closed order list only if not there already
                if (num == buyResult && !closedOrders.includes(num)){
                    console.log("push closed buy order")
                    closedOrders.push(num);
                }//end if


            }//end for 
            //cooper s - now that the buy is settled - do the sell side
                //const sellOrder = await sell(buyResult, sellOrders)
                let sellOrder = await sellSwap(buyResult, account, acct2, provider)
                console.log("post buy - sell orders result: ", sellOrder );

            console.log("current closed orders: ", closedOrders )

            //process.exit(0)
        }//end buy iffy

        if (sellResult !== false) {
            console.log("add closed order to array: ", sellResult )
            //closedOrders.push(buyResult);

            for (i in sellOrders) {
                let num = sellOrders[i].id;
    
                //cooper s - add order number to the closed order list only if not there already
                if (num == sellResult && !closedOrders.includes(num)){
                    console.log("push closed order")
                    closedOrders.push(num);
                }//end if
            }//end for 
            console.log("current closed orders: ", closedOrders )

            //cooper s - now that the buy is settled - do the sell side
            //const buyOrder = await buy(sellResult, buyOrders)
            let buyOrder = await buySwap( sellResult, account, acct2);
            console.log("buy orders result: ", buyOrder );
            //process.exit(0)

        }//end sell iffy
       
 }//end while
*/

//currentPrice = 1293

while( closedOrders.length < buyOrders.length )  {
    console.log("start while: ", closedOrders);
    console.log("current order id: ", orderId);

    // cooper s - testing purposes only
    //currentPrice = await testPrice(1300, 1296)
    let latestPrice = Math.round(await getPrice())
    console.log("latest price: ", latestPrice )
    let sub = await testPrice(6,1) 
    console.log("subtract from latest price: ", sub)

    latestPrice = latestPrice + sub;  // "-" for buys, "+" for sells

    /****************************************************************/
    //cooper s - first check buy orders
    await check_orders (latestPrice, buyOrders)
        .then( async res => {
            console.log("check_buys result: ", res )
            if (res) {
                console.log("We have a successfull buy order: ", res);
                if (!closedOrders.includes(res)) {
                    console.log("check_buys - close order: ", res )
                    closedOrders.push(res);
                    await buy(res)
                        .then( async (res) => {
                            console.log("check_buys - buy me baby... ");
                            console.log("check_buys - now sell me");
                            await sell(res)
                                .then(console.log("I'm sold!"))
                                return true;
                            })
                }//end if closeOrders clear
            }//end iffy
        })//end buy orders then

/****************************************************************/
    //cooper s - then check sell orders
    await check_orders (latestPrice, sellOrders)
    .then( async res => {
        console.log("check_sells result: ", res )
        if (res) {
            console.log("We have a successfull sell order: ", res);
            if (!closedOrders.includes(res)) {
                console.log("check_sells - close order: ", res )
                closedOrders.push(res);
                await sell(res)
                //await sellSwap(res, account, acct2, provider)
                    .then( async (res) => {
                        console.log("check_sells - sell me baby... ");
                        console.log("check_sells - now buy me");
                        await buy(res)
                            .then(console.log("I'm bought!"))
                            return true;
                        })
            }//end if closeOrders clear
        }//end iffy
    })//end sell orders then

    }//end while

 console.log("TestBot - Final closed orders: ", closedOrders )
 process.exit(0)
}//end start

/****************************************************** */

const init = async() => {
    return await getPrice();
}//end init

setInterval ( async () => {
    console.log("Gridbot 1.0\n");
    start(await init());
    ++count;
    console.log("Start - finished Tx #: ", count,"\n")
    //process.exit(0);
//}, 3000) //every 3 seconds
}, 60000 ) //every minute
//}, 300000 ) //every 5 minutes
//}, 900000 ) //every 15 minutes
//}, 1800000 ) //every 30 minutes
//}, 3600000 ) //every hour



/*
let arr1 = [1,2,3,4, 5]
let arr2 = []

// cooper s - random number generator to be replaced by check_buy)orders and check_sell_orders
const R = (min, max) => {
    return Math.floor((Math.random()*max)+min)
}//end R

while( arr2.length < arr1.length ) {
    let randomNum = R(1,5); 
    console.log("random number: ", randomNum );

    for (i in arr1) {
        let num = arr1[i];

        //cooper s - add order number to the closed order list only if not there already
        if (num == randomNum && !arr2.includes(num)){
            arr2.push(num)
        }//end if
    }//end for 
}//end while


console.log("final arr2: ", arr2 )

*/