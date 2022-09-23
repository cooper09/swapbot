const {ethers} = require('ethers');
const {getPrice} = require('./getPrice.js');
//const {sell} = require('./sell');
const { provider, account, acct1, acct2 } = require('./accts');
const {sellSwap} = require('./sellswap');

const check_sell_orders = async (sellOrders) => {
    console.log("check_sell_orders: ", sellOrders );

    let orderFullfilled = false;

    console.log("check_sell_orders - update price.\n")
    let price = await getPrice();
    price = Math.round(price);

    for (let sellOrder of sellOrders) {
        console.log(`checking sell order ${sellOrder['id']}`);
        console.log("current price: ", Math.round(price)," sellorder price: ", Math.round(sellOrder['order']));

        let sellPrice = Math.round(sellOrder['order'])
        let sellId  = sellOrder['id'];
        console.log("current price: ", typeof(price), " sellorder price: ", Math.round(sellOrder['order']))

        if (price === sellPrice ) {
            console.log("time to sell: ", sellPrice );
            orderFullfilled = true;
            try {
                let order = await sellSwap(sellId);
                console.log("Sell Order complete: ", order)
                process.exit(0)
            } catch (e) {
                console.log("Sell failed: ", e)
            }//end try
        }//end iffy
    }//end for loop

    return orderFullfilled;
}

module.exports.check_sell_orders = check_sell_orders