
const { ethers } = require('hardhat');
const  {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');

const {provider, acct1, acct2, privateKey, signer, account } = require("./accts");
const {toBytes32, toString, toWei, toEther, toRound } = require('./utils');
const {wethArtifact, daiArtifact,daiContract, daiAddr, wethAddr, router } = require("./contracts")
/********************************************************************* */

const sell = async (id) => {
    console.log("Sell id: ", id );
    const network =  await provider.detectNetwork()
    console.log("Sell - network id: ", network.chainId, "", network.name );
    
    const chainId = 1;
    const dai = await Fetcher.fetchTokenData(chainId, daiAddr );
    const weth = WETH[chainId];
    const pair = await Fetcher.fetchPairData(dai,weth);
    const route = new Route([pair], dai );

    const daiBalSender  = await daiContract.balanceOf(acct1);
    const daiBalRcvr  = await daiContract.balanceOf(acct2);

    console.log("Sell - Dai balance Sender: ", toEther(daiBalSender) , " Dai Balance Receiver: ", toEther(daiBalRcvr));

    let amountEthFromDAI = await router.getAmountsOut(
        daiBalSender, //daiBalRcvr ?
        [daiAddr, wethAddr]
    )//end amountEthFromDAI

    const amountDaiIn = amountEthFromDAI[0];
    const amountEthOut = amountEthFromDAI[1];

    // cooper s - amount of dai balance
    const contractDaiWallet = daiContract.connect(account);
    //const currentDaiBal = await contractDaiWallet.balance(acct2);

    let slippage = toBytes32("0.050");
    const slippageTolerance = new Percent(slippage, "10000");

    //trade Dai for Eth
    try {
        console.log("Sell - Trade dai for eth");
        const trade = new Trade(
            route,
            new TokenAmount(dai, amountDaiIn),
            TradeType.EXACT_INPUT
        )//end Trade
    } catch (e) {
        console.log("Sell - trade failed: ", e )
    }//end try/catch

    const value = trade.inputAmount.raw;
    console.log("Sell - Trade raw value: ", value );

    const valueHex = await ethers.BigNumber.from (amountEthOut.toString()).toHexString();
    const approveTx = require("./approve-txt")
    
    try {
        console.log("Sell - Send Sell transaction")
    } catch (e) {
        console.log("Sell - sell transaction failed: ", e )
    }//end try/catch

    /********************************************************************** */

    return `resolved sell order ${id}`;
}
module.exports.sell = sell;

//const result = sell(1);
//console.log("result: ", result );