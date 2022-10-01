const {ethers} = require('ethers');
const {provider, acct1, acct2, privateKey, signer, account } = require("./accts");
const {toBytes32, toString, toWei, toEther, toRound } = require('./utils');
const {buy} = require('./buy');
const { buySwap } = require('./buyswap');

let bidId;
let orderFullfilled = false;

const check_buy_orders = async (price,buyOrders, closedOrders) => {
    //console.log("check_buy_orders - current closed orders: ", closedOrders);
    
    for (let buyOrder of buyOrders) {
    // cooper s - test price here
    //price = 1321;

        let bidPrice = Math.round(buyOrder['order'])
        bidId  = buyOrder['id'];
        //console.log("check_buy_orders - current price: ", price, " buyorder price: ", Math.round(buyOrder['order']))
        console.log("check_buy_orders - current id: ", bidId );

        //if (price === bidPrice ) {
        if (price === bidPrice  && !closedOrders.includes(bidId)){
            console.log("check_buy_orders - time to buy: ", bidPrice, " bidId: ", bidId  );
            try {
                //cooper s - actual buy should return the order id 
                let order = await buySwap( bidId, account, acct2);
                return bidId;
            } catch (e) {
                console.log("Buy failed: ", e)
            }//end try
        }//end iffy
    }//end for loop
    
    //if order isn't processed return false
    return false;

}//end check_buy_orders

module.exports.check_buy_orders = check_buy_orders