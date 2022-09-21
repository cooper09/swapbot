
const { ethers } = require('hardhat');
const  {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');

/***********************************************************************************/ 

// set up prvider, primary and secondary addresses
const {provider, acct1, acct2, privateKey, signer, account } = require("./accts");

/********************************************************************* */

// utils generic ethers tools for formatting 
const {toBytes32, toString, toWei, toEther, toRound } = require('./utils');

/********************************************************************* */

// Set up contracts 
const { daiAddr, wethAddr, wethArtifact, daiArtifact,daiContract, router } = require("./contracts")

/***************************************************************************** */


const sellSwap = async ( wallet, acct, provider ) => {

    console.log ("sellSwap -  account: ", acct )
                  
    const startBal = await provider.getBalance(acct);
    console.log("sellSwap - send account - start ETH balance: ", toEther(startBal));
    
    const chainId = 1;

    console.log("sellSwap - current block: ",  await provider.getTransactionCount(account.address, 'latest'))
    //console.log("current gas limit: ",  await provider.getBlock(account.address, 'latest').gaslimit );
    
    //gasPrice * gasLimit = 200000 * 50 * 10^-9 = 0.01.
    //console.log("current gas limit: ",  await provider.getBlock(account.address).gaslimit );

    const dai = await Fetcher.fetchTokenData(chainId, daiAddr );

    const weth = WETH[chainId];
    const pair = await Fetcher.fetchPairData(dai,weth);
    const route = new Route([pair], dai );

    const daiBalSender  = await daiContract.balanceOf(acct);
    const daiBalRcvr  = await daiContract.balanceOf(acct);

    //console.log("sellSwap - Dai balance Sender: ", toEther(daiBalSender) , " Dai Balance ReceiverL ", toEther(daiBalRcvr));
    
    let amountEthFromDAI = await router.getAmountsOut(
        //toWei(route.midPrice.invert().toSignificant(6)),
        //daiBalRcvr,
        daiBalSender,
        [daiAddr, wethAddr]
    )

    const amountDaiIn  = amountEthFromDAI[0];
    const amountEthOut = amountEthFromDAI[1];

    //cooper s - should amount DAI in be the balance
    const contractDaiWallet = daiContract.connect(account);
    const currentDaiBal = await contractDaiWallet.balanceOf(acct)
        .then((bal) => {
            console.log(account.address, "sellSwap -  current Sender DAI balance: ", toEther(bal) )
        })
    //
        //check for transfer EVENT
    console.log("sellSwap - Eth amount for Dai: ", toEther(amountEthFromDAI[0]) );
    console.log("sellSwap - For ", toEther(amountDaiIn), " Dai receive ", toEther(amountEthOut), " of ETH"  );

    let slippage = toBytes32("0.050");
    console.log("slippage: ", slippage ) 
    const slippageTolerance = new Percent(slippage, "10000");

    try {
        console.log("sellSwap - set up trade to do the swap of dai for tokens");
        const trade = new Trade( //information necessary to create a swap transaction.
            route,
            new TokenAmount(dai, (amountDaiIn)),
            TradeType.EXACT_INPUT
        ); //end trade

        const value = trade.inputAmount.raw; // // needs to be converted to e.g. hex

        //cooper s - not sure if this is the value returned from TokenAmount or if it should AmountEthOut
        //const valueHex = await ethers.BigNumber.from(value.toString()).toHexString();
        const valueHex = await ethers.BigNumber.from(amountEthOut.toString()).toHexString();
   
        console.log("sellSwap - value: ", value, " valueHex: ", valueHex );
        console.log("sellSwap - value in ether: ", toEther(valueHex) )

        const approveTx = require("./approve-tx")

        await approveTx.approve(daiContract, account, valueHex )
            .then (() => {
                console.log("sellSwap - amount approved...")
            })

        // Set up and execute actual swap 
        try {  
            console.log("sellSwap - amount to transfer: ", amountEthOut );
            console.log("sellSwap - get jiggy  with it: ", ethers.utils.formatUnits(amountEthOut))
            const routerWithWallet = router.connect(wallet); 
            const decimals = 18;

            const tx = await wallet.sendTransaction({
                to: acct2,
                //value: amountEthOut,
                //value: valueHex,
               // value: ethers.utils.parseUnits(valueStr, 'ether'),
                value: toWei("0.001"), //Fee: $1.58/tx
                nonce: provider.getTransactionCount(account.address, 'latest')
            })
            console.log("Transfer hash: ",tx.hash )
        } catch (e) {
            console.log("SellSwap-Swap Transaction error: ", e.message )
        }
    

    //remove when testing is finished...
    //    process.exxit(0);

    } catch(e) {
        console.log("Trade failed: ", e.message )
    }

}//end sellSwap

module.exports.sellSwap = sellSwap;

//sellSwap(account, acct2, provider);