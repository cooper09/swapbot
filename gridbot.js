const {getCurrentPrice} = require('./modules/getCurrentPrice.js');
const {getPrice} = require('./modules/getPrice.js');
const {check_buy_orders} = require('./modules/check_buy_orders.js')
const {check_sell_orders} = require('./modules/check_sell_orders.js')

let config = require("./config");

let buyOrders=[];
let sellOrders=[];

const init = async (start) => {
    console.log("Starting price: ", start );
    console.log("type: ", Math.round(start));

    // convert price string to floating point for math
    const startPrice = Math.round(start);

    for (var i=1; i <= config.NUM_BUY_GRID_LINES; ++i ){
        let price = startPrice - (config.GRID_SIZE*i);
        //console.log("submitting market limit buy order: ", price )
        // put buy order here
        const buyOrder = {
                            id:i,
                            order: Math.round(price),
                        }
        buyOrders.push(buyOrder)
    }//end for Buy

    for (var i=1; i <= config.NUM_SELL_GRID_LINES; ++i ){
        let price = startPrice + (config.GRID_SIZE*i);
        //console.log("submitting market limit sell order: ", price )
        // put buy order here
        const sellOrder = {
                            id:i,
                            order: Math.round(price),
                        }
        sellOrders.push(sellOrder)
    }//end for Sell

    //console.log("Buy orders: ", buyOrders );
    //console.log("Sell orders: ", sellOrders );

    let currentPrice = await getPrice();
    console.log("current price - raw: ", currentPrice);
    console.log("rounded ", Math.round(currentPrice));

    currentPrice = Math.round(currentPrice)
    
    closedOrderIds = [];

    const buyResult = await check_buy_orders(currentPrice,buyOrders)
    console.log("buy orders result: ", buyResult );

    const sellResult = await check_sell_orders(sellOrders)
    console.log("sell orders result: ", sellResult );

    if (buyResult) {
        console.log("gridbot buy settled ")
    }

    if (sellResult) {
        console.log("gridbot sell settled ")
    }
    
   // process.exit(0);
}//end init

const start = async () =>{
    return await getPrice();
}

let count = 0;
setInterval ( async () => {
    console.log("let us begin...\n");
    init(await start());
//}, 3000) //every 3 seconds
}, 60000 ) //every minute
//}, 300000 ) //every 5 minutes
//}, 900000 ) //every 15 minutes
//}, 1800000 ) //every 30 minutes
//}, 3600000 ) //every hour


