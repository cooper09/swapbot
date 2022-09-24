const {ethers} = require('ethers');
const {provider, acct1, acct2, privateKey, signer, account } = require("./accts");
const {toBytes32, toString, toWei, toEther, toRound } = require('./utils');
const {buy} = require('./buy');
const { buySwap } = require('./buyswap');

let orderFullfilled = false;

const check_buy_orders = async (price, buyOrders) => {
    //console.log("check_buy_orders - current price: ",price ," buyOrders: ", buyOrders);
    
    for (let buyOrder of buyOrders) {
    //    console.log(`checking buy order ${buyOrder['id']}`);
    //    console.log("current price: ", price," buyorder price: ", Math.round(buyOrder['order']));

    // cooper s - test price here
    //price = 1344;

        let bidPrice = Math.round(buyOrder['order'])
        let bidId  = buyOrder['id'];
        console.log("check_buy_orders - current price: ", price, " buyorder price: ", Math.round(buyOrder['order']))

        if (price === bidPrice ) {
            console.log("check_buy_orders - time to buy: ", bidPrice );

            try {
                //let order = await buy(bidId);
                let order = await buySwap( bidId, account, acct2);
                console.log("check_buy_orders - Buy Order complete: ", order);
                orderFullfilled = true;
                //process.exit(0)
            } catch (e) {
                console.log("Buy failed: ", e)
            }//end try
        }//end iffy
    }//end for loop
    
    //if order is processed return true otherwise return
    return orderFullfilled;
}

module.exports.check_buy_orders = check_buy_orders