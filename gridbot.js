const {getCurrentPrice} = require('./modules/getCurrentPrice.js');
const {getPrice} = require('./modules/getPrice.js');
const {buy} = require('./modules/buy');
const {sell} = require('./modules/sell');

let config = require("./config");

let buyOrders=[];
let sellOrders=[];

const init = async (start) => {
    console.log("Starting price: ", start );
    console.log("type: ", typeof(start));
    console.log("float: ", parseFloat(start) );

    // convert price string to floating point for math
    const startPrice = parseFloat(start);

    for (var i=1; i <= config.NUM_BUY_GRID_LINES; ++i ){
        let price = startPrice - (config.GRID_SIZE*i);
        console.log("submitting market limit buy order: ", price )
        // put buy order here
        const buyOrder = {
                            id:i,
                            order: price,
                        }
        buyOrders.push(buyOrder)
    }//end for Buy

    for (var i=1; i <= config.NUM_SELL_GRID_LINES; ++i ){
        let price = startPrice + (config.GRID_SIZE*i);
        console.log("submitting market limit sell order: ", price )
        // put buy order here
        const sellOrder = {
                            id:i,
                            order: price,
                        }
        sellOrders.push(sellOrder)
    }//end for Sell

    console.log("Buy orders: ", buyOrders );
    console.log("Sell orders: ", sellOrders );

    let currentPrice = await getPrice();
    console.log("current price: ", currentPrice);
    console.log("type: ", parseFloat(currentPrice));
    
    closedOrderIds = [];

    for (let buyOrder of buyOrders) {
        console.log(`checking buy order ${buyOrder['id']}`);
        console.log("current price: ", currentPrice," buyorder price: ", Math.round(buyOrder['order']));

        let bidPrice = Math.round(buyOrder['order'])
        let bidId  = buyOrder['id'];
        console.log("current price: ", typeof(currentPrice), " buyorder price: ", typeof(Math.round(buyOrder['order'])))

        if (currentPrice === bidPrice ) {
            console.log("time to buy: ", bidPrice );
            try {
                let order = await buy(bidId);
                console.log("Buy Order complete: ", order)
            } catch (e) {
                console.log("Buy failed: ", e)
            }//end try
        }//end iffy
    }//end for loop

    //Go through sell orders

    for (let sellOrder of sellOrders) {
        console.log(`checking sell order ${sellOrder['id']}`);
        console.log("current price: ", currentPrice," buyorder price: ", Math.round(sellOrder['order']));

        currentPrice = 1286;
        let sellPrice = Math.round(sellOrder['order'])
        let sellId  = sellOrder['id'];
        console.log("current price: ", typeof(currentPrice), " sellorder price: ", typeof(Math.round(sellOrder['order'])))

        if (currentPrice === sellPrice ) {
            console.log("time to sell: ", sellPrice );
            try {
                let order = await sell(sellId);
                console.log("Sell Order complete: ", order)
            } catch (e) {
                console.log("Sell failed: ", e)
            }//end try
        }//end iffy
    }//end for loop

    process.exit(0);
}//end init

const start = async () =>{
    return await getPrice();
    //return Math.random() < 0.5;
}

setInterval ( async () => {
    console.log("tic");
    init(await start());
}, 3000)
