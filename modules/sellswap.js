
const { ethers } = require('hardhat');
const  {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');

/********************************************************************* */

// utils generic ethers tools for formatting 
const {toBytes32, toString, toWei, toEther, toRound } = require('./utils');

/********************************************************************* */

//accounts and provider
const {provider, acct1, acct2, privateKey, signer, account } = require("./accts");

/********************************************************************* */

// Set up contracts 
const {wethArtifact, daiArtifact,daiContract,daiAddr, wethAddr, router } = require("./contracts")

/********************************************************************* */

const sellSwap = async ( wallet, acct, provider ) => {
    console.log("sellSwap: ");

    console.log("current block: ",  await provider.getTransactionCount(wallet.address, 'latest'))
    console.log("current gas limit: ",  await provider.getBlock(wallet.address, 'latest').gaslimit )
    //console.log("current gas price: ",  await provider.getTransactionCount(wallet.address, 'latest'))

const chainId = 1;

const dai = await Fetcher.fetchTokenData(chainId, daiAddr );
const weth = WETH[chainId];
const pair = await Fetcher.fetchPairData(dai,weth);
const route = new Route([pair], dai );

const daiBal = await daiContract.balanceOf(acct);

console.log("Receiver Dai balance: ", toEther(daiBal) )
let amountEthFromDAI = await router.getAmountsOut(
        //toWei(route.midPrice.invert().toSignificant(6)),
        daiBal,
        [daiAddr, wethAddr]
    )
    console.log("The ammount of Dai we are selling: ", toEther(daiBal) )

const amountDai =toEther(amountEthFromDAI[0]);
const amountEth = toEther(amountEthFromDAI[1]);
console.log("amount of Eth we should get back : ", amountEth, " for ", amountDai, " Dai" );
let slippage = toBytes32("0.050");

//let amountIn = ethers.utils.parseEther(amountDai.toString()); //helper function to convert ETH to Wei       
//let amountIn = ethers.utils.parseEther(amountEth.toString());
let amountIn = ethers.utils.parseEther(amountDai.toString());


amountIn = amountIn.toString()
console.log("Amount (WETH) that we should get back: ", amountIn );
console.log("Amount (DAI) that we should put in: ", amountDai);
console.log("Amount (WETH) that we should get back: ", amountEth);

const slippageTolerance = new Percent(slippage, "10000"); // 50 bips, or 0.50% - Slippage tolerance
console.log("Slippage calculated...");

    try {
        // set up our trade
                
        const trade = new Trade( //information necessary to create a swap transaction.
            route,
            new TokenAmount(dai, amountIn),
            TradeType.EXACT_INPUT
        ); //end trade

             /******************************************************************************************** */
             //const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
             const amountOutMin = ethers.BigNumber.from(
                trade.minimumAmountOut(slippageTolerance).raw.toString()
              ).toHexString();
            console.log("Minimum amount I will receive: ", amountOutMin );

              const path = [daiAddr, wethAddr];
              const to = acct;
              const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

              // return the value of the Dai/Eth trade in hex (why hex?)
            /*const value = ethers.BigNumber.from(
                trade.inputAmount.raw.toString()
              ).toHexString();
                */
            
              const value = trade.inputAmount.raw*10; // // needs to be converted to e.g. hex
              const valueHex = await ethers.BigNumber.from(value.toString()).toHexString();
            
              console.log("trade value: ", value," hex: ",  valueHex );


            //ok set up the transaction to handle the actual swap
            try {
                const approvalTx = await approve(daiContract, account, valueHex )
                    .then (async (result) => {
                        console.log("approve result: ", result );
                        //let sendTxn = (await account).sendTransaction(result);
                    });//end approve 
            } catch(e) {
                console.log("SellSwap-Swap Approval error: ", e.message )
            }//end tx try

// Set up and execute actual swap 
        try {  
            console.log("amount to transfer: ", amountIn)
            const routerWithWallet = router.connect(wallet); 
            const decimals = 18;
            const transaction = await wallet.sendTransaction({
                to: acct2,
                value: amountIn,
                //value: ethers.utils.parseUnits(toEther(amount), 'ether'),
                //value: ethers.utils.parseEther("0.01") 
            })
            console.log("Transfer hash: ", transaction.hash )
            
        } catch (e) {
            console.log("SellSwap-Swap Transaction error: ", e.message )
        }


    } catch (e) {
        console.log("Sell Swap Error: ", e.message);
    }//end try/catch

}//end sellSwap


const approve = async (daiContract, account, value ) => {
    console.log("Sellswap - Approve: ", value );

    let count = await provider.getTransactionCount(account.address, 'latest')

    const routerWithWallet = router.connect(provider); 
    const decimals = 18;
                    
    const approveTx = await daiContract.populateTransaction.approve(router.address, value )

    let sendTxn = (await account).sendTransaction(approveTx);
    let receipt = (await sendTxn).wait();

    if (receipt) {
        console.log(" -Approval Transaction is mined - " + '\n' 
        + "Transaction Hash:", (await sendTxn).hash
        + '\n' + "Block Number: " 
        + (await receipt).blockNumber + '\n' 
        + "Navigate to whereever" 
        + (await sendTxn).hash, "to see your transaction")

        return true;
        
    } else {
        console.log("Error submitting approval transaction")
    }//end try/catch

}//end approve

module.exports.sellSwap = sellSwap;