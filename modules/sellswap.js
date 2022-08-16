
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

const chainId = 1;

const dai = await Fetcher.fetchTokenData(chainId, daiAddr );
const weth = WETH[chainId];
const pair = await Fetcher.fetchPairData(dai,weth);
const route = new Route([pair], weth );
console.log("Buy 1 WETH  token with ", route.midPrice.toSignificant(6), " DAI." );
console.log("Buy 1 DAI token with ", route.midPrice.invert().toSignificant(6), " WETH." );


const daiBal = await daiContract.balanceOf(acct);

console.log("Receiver Dai balance: ", toEther(daiBal) )
let amountEthFromDAI = await router.getAmountsOut(
        //toWei(route.midPrice.invert().toSignificant(6)),
        daiBal,
        [daiAddr, wethAddr]
    )
    console.log("The ammount of Dai we are selling: ", toEther(daiBal) )

console.log("Amount of DAI from ETH: ", toEther(amountEthFromDAI[0]));
console.log("Amount of ETH from DAI: ", toEther(amountEthFromDAI[1]));

const amountDai =toEther(amountEthFromDAI[0]);
const amountEth = toEther(amountEthFromDAI[1]);
console.log("amount of Eth we should get back : ", amountEth, " for ", amountDai, " Dai" );
let slippage = toBytes32("0.050");

let amountIn = ethers.utils.parseEther(amountDai.toString()); //helper function to convert ETH to Wei       
amountIn = amountIn.toString()
console.log("Amount (WETH) that we should get back: ", toEther(amountIn) )
const slippageTolerance = new Percent(slippage, "10000"); // 50 bips, or 0.50% - Slippage tolerance

    try {
    // Set up the Uniswap DAi to Eth swap    
        console.log('Ready to Trade...')

        const trade = new Trade( //information necessary to create a swap transaction.
                route,
                new TokenAmount(weth, amountIn),
                TradeType.EXACT_INPUT
        );

        //console.log('Trade object created - amount in: ', trade.inputAmount.minimumAmountOut() );
        //console.log('Trade object created - amount out: ', trade.outputAmount.currency.address )

        /******************************************************************************************** */
        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
        //const amountOutMin = amount;
        console.log("amountOutMin: ", amountOutMin.toString() );
        const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();
        console.log("amountOutMinHex: ", amountOutMinHex.toString() );
        //const path = [wethAddr, daiAddr]; //An array of token addresses
        const path = [daiAddr, wethAddr]; //An array of token addresses
        console.log("the beaten path: ", path );

        const to = acct // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
        const value = trade.inputAmount.raw*10; // // needs to be converted to e.g. hex
        const valueHex = await ethers.BigNumber.from(value.toString()).toHexString(); //convert to hex string

        
        const sellTx = require("./sell-tx");

        sellTx.sell_tx(amountIn);

        /*
        const amountInHex = ethers.BigNumber.from(amountIn.toString()).toHexString();

        const routerWithWallet = router.connect(wallet); 

        console.log('create transaction - amountIn: ', amountIn , " amountOut: ", toEther(amountOutMinHex) );
             process.exit(0);
        daiContract.approve(router.address, amountInHex )
            .then ( () =>{
                console.log("Dai Amount approved... " )
            })

            process.exit(0)

        //const rawTxn = await router.populateTransaction.swapExactTokensForETH(
        const rawTxn = await router.populateTransaction.swapExactTokensForTokens(
            amountInHex,
            amountOutMinHex,
            path,
            to,
            Date.now()+1000*60*5,
            {
                gasLimit: 300000, //20e8,
                gasPrice:  ethers.utils.parseUnits("5.0", "gwei"),//20e9,
                nonce: provider.getTransactionCount(wallet.address, 'latest'),

                //nonce: ++nonce
            })
            .then(console.log("Swap Dai for Eth..."));
/*

        const rawTxn = await routerWithWallet.populateTransaction.swapExactTokensForETH(
                amountInHex, 
                amountOutMinHex , 
                [daiAddr,wethAddr],
                "0x4986828740bBDBC7CD6Ab10e0753d123f868dc40",
                Date.now()+1000*60*5, 
                {   
                    gasLimit: 200000, //20e8,
                    gasPrice:  ethers.utils.parseUnits("5.0", "gwei"),//20e9,
                    
                })

 
            console.log('Send transaction...')
                let sendTxn = (await wallet).
                sendTransaction(rawTxn);
                let reciept = (await sendTxn).wait();
                //Logs the information about the transaction it has been mined.
                if (reciept) {
                    console.log(" - Transaction is mined - " + '\n' 
                    + "Transaction Hash:", (await sendTxn).hash
                    + '\n' + "Block Number: " 
                    + (await reciept).blockNumber + '\n' 
                    + "Navigate to whereever" 
                    + (await sendTxn).hash, "to see your transaction")
                } else {
                    console.log("Error submitting transaction")
                }

                */
                console.log('All done!!!')
                const ethBalAfter = await provider.getBalance(acct)
                .then((bal) => {
                    console.log("Receiver ETH balance after trade: ", toEther(bal) )
                }) 


    } catch(e) {
        console.log("Sell Error: ", e.message);
    }

}//end sellSwap


    const approve = async () => {
        const valueToapprove = ethers.utils.parseUnits('0.01', 'ether')
        const tx = await WETH.approve(router.address, valueToapprove, {
    //    gasPrice: provider.getGasPrice(),
    //    gasLimit: 100000,
        })
        console.log('Approving...')
    //    const receipt = await tx.wait()
    //    console.log('Approve receipt')
    //    console.log(receipt)
    }

module.exports.sellSwap = sellSwap;