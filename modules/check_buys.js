//check through buy orders
const check_buys = async (latestPrice, buyOrders)
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
})//end then

module.exports.check_buys = check_buys;
