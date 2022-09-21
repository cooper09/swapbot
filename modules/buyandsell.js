const { provider, account, acct1, acct2 } = require('./accts');
const { toEther } = require('./utils');
const { daiContract } = require('./contracts');

const {buySwap} = require('./buyswap');
const {sellSwap} = require('./sellswap');

const { getPrice} = require('./getprice');

const buyAndSell = async (startPrice) => {
    console.log("BuyAndSell - startPrice: ", startPrice);
    const network =  await provider.detectNetwork()
    console.log("Runnig on network id: ", network.chainId, "", network.name );

    const balance = await provider.getBalance(account.address);
    console.log("acct: ",account.address," start balance: ", toEther(balance));

    const contractDaiWallet = daiContract.connect(account);
    await contractDaiWallet.balanceOf(account.address)
        .then((bal) => {
            console.log(account.address, " current DAI balance: ", toEther(bal) )
        })

/********************************************************************** */
// set up Uniswap variables for pair trading...

const currentPrice = await getPrice();
console.log("BuyandSell - start price: ",startPrice," current price: ", currentPrice, " currentPrice");

 let incNumber = Number(startPrice);
 //console.log("new startprice: ", ++incNumber)

if ((Number(currentPrice)  > Number(startPrice))  && ((Number(currentPrice) <= (Number(currentPrice)+50 )))) {
//if (( incNumber  > Number(startPrice))  && ((Number(currentPrice) <= (Number(currentPrice)+50 )))) {  //use then force a sell...
    console.log("Sell me, baby!!");
    await sellSwap(account, acct2, provider);
}

if (Number(currentPrice) === Number(startPrice) ) {
    console.log("do nothing...")
}

if ((Number(currentPrice) < Number(startPrice)) && ((Number(currentPrice) >= (Number(currentPrice)-50 )))){
    console.log("Buy me, baby!!");
    await buySwap( account, acct2);
}

/*

if (buy) {
    console.log("Buy DAI with ETH");
        await buySwap( account, acct2);
    } else {
        console.log("Sell DAI for ETH");
        await sellSwap(account, acct2, provider);
    }
*/

}//end buyAndSell

module.exports.buyAndSell = buyAndSell;