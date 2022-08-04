
const { ethers } = require('hardhat');
const  {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');

/********************************************************************* */
// utils
const toBytes32 = text => ( ethers.utils.formatBytes32String(text));
const toString = byte32 => ( ethers.utils.formatBytes32String(byte32));
const toWei = ether => ( ethers.utils.parseEther(ether));
const toEther = wei => ( ethers.utils.formatEther(wei).toString());
const toRound = num => ( ethers.utils.toFixed(2));

/********************************************************************* */

const wethAddr = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; //Mainnet
const daiAddr = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; //Mainnet
const ethAddr = "exeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

   //Create UniswapV2 Router contract
   let router = null;

const sellSwap = async ( wallet, acct, provider ) => {

    console.log ("Sell me, baby...Part 2");

    // External contracts for DAI, WETH and the V2 Router
    const wethArtifact = require('../artifacts/contracts/Weth.sol/Weth.json');
    const daiArtifact = require('../artifacts/contracts/Dai.sol/Dai.json');

    UniswapABI = require("../abis/UniswapRouter.json");
        
    //Create UniswapV2 Router contract
    router = new ethers.Contract( 
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        UniswapABI,
        wallet
    ); 

    const daiContract = new ethers.Contract( 
        daiAddr, 
        daiArtifact.abi, 
        wallet );

    const chainId = 1;

    const ethBalbalanceBefore = await provider.getBalance(acct)
    .then((bal) => {
        console.log("Receiver ETH balance before trade: ", toEther(bal) )
}) 

    //Fetch the DAI/WETH pair prices
    const dai = await Fetcher.fetchTokenData(chainId, daiAddr );
    const weth = WETH[chainId];
    const pair = await Fetcher.fetchPairData(dai,weth);
    const route = new Route([pair], weth );
    console.log("Buy 1 WETH  token with ", route.midPrice.toSignificant(6), " DAI." );
    console.log("Buy 1 DAI token with ", route.midPrice.invert().toSignificant(6), " WETH." );
//Get amount of ETH for DAI
let amountEthFromDAI = await router.getAmountsOut(
    toWei(route.midPrice.invert().toSignificant(6)),
    [daiAddr, wethAddr]
)

//console.log("SELL - Amount out of DAI from ETH: ", toEther(amountEthFromDAI[0]));
//console.log("BUY - Amount out of ETH from DAI: ", toEther((amountEthFromDAI[1]*10).toString()));
//console.log("BUY - Amount out of ETH from DAI - string: ", toEther(amountEthFromDAI[1]).toString());

const valueStr = toEther((amountEthFromDAI[1]*10000).toString()); //10000 multiplier
//const valueStr = toEther(route.midPrice.invert().toSignificant(6).toString());
console.log("BUY - Amount out of ETH from DAI - string: ", valueStr );

//Set up sell transaction
console.log("Set up transaction...")
    const gasPrice = await provider.getGasPrice();
    console.log("gas price: ", ethers.utils.formatEther(gasPrice))

const tx = {
    from: wallet.address,
    to: acct,
    //value: ethers.utils.parseUnits('0.001', 'ether'),
    value: ethers.utils.parseUnits(valueStr, 'ether'),
    gasPrice,
    gasLimit: ethers.utils.hexlify(100000), //100 gwei
    nonce: provider.getTransactionCount(wallet.address, 'latest')
}//end 

//const transaction = await wallet.sendTransaction(tx)
//console.log("transaction: ", transaction.nonce)

const ethBalbalance = await provider.getBalance(acct)
.then((bal) => {
    console.log("Receiver ETH balance after trade: ", toEther(bal) )
}) 
   
}//end sellSwap

module.exports.sellSwap = sellSwap;