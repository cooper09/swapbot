
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

const buySwap = async ( wallet, acct ) => {
    console.log("buySwap: ", acct);

    //const Router = require('./artifacts/contracts/Router.sol/Router.json');
    const wethArtifact = require('../artifacts/contracts/Weth.sol/Weth.json');
    const daiArtifact = require('../artifacts/contracts/Dai.sol/Dai.json');

    UniswapABI = require("../abis/UniswapRouter.json")

    const wethAddr = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; //Mainnet
    const daiAddr = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; //Mainnet

    // WETH contract and balance
    const wethContract = new ethers.Contract( 
        wethAddr,
        wethArtifact.abi,
        wallet
    );

    const daiContract = new ethers.Contract( 
        daiAddr, 
        daiArtifact.abi, 
        wallet );

    //Create UniswapV2 Router contract
    const router = new ethers.Contract( 
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        UniswapABI,
        wallet
    );

/*********************************************************************** */
//Set Up a Uniswap trade...
const chainId = 1;

const dai = await Fetcher.fetchTokenData(chainId, daiAddr );
const weth = WETH[chainId];
const pair = await Fetcher.fetchPairData(dai,weth);
const route = new Route([pair], weth );
console.log("Buy WETH token with DAI: ", route.midPrice.toSignificant(6) );
console.log("Buy DAI token with WETH: ", route.midPrice.invert().toSignificant(6) );

let amountEthFromDAI = await router.getAmountsOut(
    toWei(route.midPrice.invert().toSignificant(6)),
    [daiAddr, wethAddr]
)

console.log("SELL - Amount of DAI from ETH: ", toEther(amountEthFromDAI[0]));
console.log("BUY - Amount of ETH from DAI: ", toEther(amountEthFromDAI[1]));

const amount = toEther(amountEthFromDAI[0]);
let slippage = toBytes32("0.050");

/************************************************************************* */
    try {
        console.log("create trade object...");
        let amountIn = ethers.utils.parseEther(amount.toString()); //helper function to convert ETH to Wei       
        amountIn = amountIn.toString()
        console.log("Amount (WETH) that goes in: ", toEther(amountIn) )
        const slippageTolerance = new Percent(slippage, "10000"); // 50 bips, or 0.50% - Slippage tolerance

        const trade = new Trade( //information necessary to create a swap transaction.
            route,
            new TokenAmount(weth, amountIn),
            TradeType.EXACT_INPUT
        );  //end trade

        //Set up SEND transaction
        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
        const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();
        const path = [wethAddr, daiAddr]; //An array of token addresses
        const to = acct // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
        const value = trade.inputAmount.raw*20; // // needs to be converted to e.g. hex
        const valueHex = await ethers.BigNumber.from(value.toString()).toHexString(); //convert to hex string

        const rawTxn = await router.populateTransaction.swapExactETHForTokens(
            amountOutMinHex,
             path, to,
              deadline,
            {
                value: valueHex
            })

            let sendTxn = (await wallet).sendTransaction(rawTxn)
            let reciept = (await sendTxn).wait()

            //Logs the information about the transaction it has been mined.
            if (reciept) {
                console.log(" - Transaction is mined - " + '\n' 
                + "Transaction Hash:", (await sendTxn).hash
                + '\n' + "Block Number: " 
                + (await reciept).blockNumber + '\n' 
                + "Navigate to whereever: "  
                + (await sendTxn).hash, "to see your transaction")
            } else {
                console.log("Error submitting transaction")
            }//end iffy

            const contractDaiWallet = daiContract.connect(wallet);
            await contractDaiWallet.balanceOf(acct)
                .then((bal) => {
                    console.log(wallet.address, " curren Receiver DAI balance: ", toEther(bal) )
                })
                //check for transfer EVENT
  
    } catch(e) {
        console.log("Buy Error: ", e.message);
    }
    return true;
}//end buySwap


module.exports.buySwap = buySwap;

