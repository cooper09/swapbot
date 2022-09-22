const { ethers } = require('ethers');
const  {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const chainId = 1;
const daiAddr = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
   
const ERC20_ABI = [
    "function name() view returns (string)"
]
const getCurrentPrice = async () => {

    const dai = await Fetcher.fetchTokenData(chainId, daiAddr );
    const weth = WETH[chainId];
    
    const pair = await Fetcher.fetchPairData(dai,weth);
    const route = new Route([pair], weth );
    console.log("Buy Dai token with WETH: ", route.midPrice.toSignificant(6) );
    console.log("Buy WETH token with DAI: ", route.midPrice.invert().toSignificant(6) );

    
    return route.midPrice.invert().toSignificant(6); //Math.random();
}
module.exports.getCurrentPrice = getCurrentPrice;

const buy = async (wallet, acct, value) => {
    console.log("Buy that bad boy...");

    try {    
        const tx = await wallet.sendTransaction({
            to: acct,//
            value: ethers.utils.parseEther(value)
        })
            await tx.wait();
            console.log("The deal is done: ", tx.hash );//
        } catch (e) {
            console.log("Gosh Golly: ", e.message )
        }
    return true;
}
module.exports.buy = buy;

const sell = async (wallet, acct, value) => {
    console.log("Sell that bad boy...");

    try {    
        const tx = await wallet.sendTransaction({
            to: acct,//
            value: ethers.utils.parseEther(value)
        })
            await tx.wait();
            console.log("The deal is done: ", tx.hash );//
        } catch (e) {
            console.log("Gosh Golly: ", e.message )
        }

    return true;
}
module.exports.sell = sell;
