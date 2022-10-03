const {ethers} = require('ethers');
const {getPrice} = require('./getPrice.js');
const {provider, acct1, acct2, privateKey, signer, account } = require("./accts");
const {toBytes32, toString, toWei, toEther, toRound } = require('./utils');
//const {sell} = require('./sell');
const {sellSwap} = require('./testSell-2');

let orderFullfilled = false;

const check_sell_orders = async (sellOrders, id) => {
    console.log("check_sell_orders: ", sellOrders , " sell Id:");

    console.log("check_sell_orders - update price.\n")
    let price = await getPrice();
    price = Math.round(price);

        // cooper s - test price here
        //price = 1324;

    for (let sellOrder of sellOrders) {
    //    console.log(`checking sell order ${sellOrder['id']}`);
    //    console.log("current price: ", Math.round(price)," sellorder price: ", Math.round(sellOrder['order']));

        let sellPrice = Math.round(sellOrder['order'])
        let sellId  = sellOrder['id'];
        console.log("check_sell_orders - current price: ", price, " sellorder price: ", Math.round(sellOrder['order']))

        if (price === sellPrice ) {
            console.log("time to sell: ", sellPrice );

            try {

                let order = await sellSwap(sellId, account, acct1, provider)
                console.log("Sell Order complete: ", order)
                orderFullfilled = true;
                return sellId;
                //process.exit(0)
            } catch (e) {
                console.log("Sell failed: ", e)
                process.exit(0)
            }//end try
        }//end iffy
    }//end for loop

    return orderFullfilled;
}

module.exports.check_sell_orders = check_sell_orders



//check_sell_orders(testOrders)