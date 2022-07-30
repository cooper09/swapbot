
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

   //Create UniswapV2 Router contract
   let router = null;

const sellSwap = async ( wallet, acct, provider ) => {
    console.log("sellSwap: ");

    const wethArtifact = require('../artifacts/contracts/Weth.sol/Weth.json');
    const daiArtifact = require('../artifacts/contracts/Dai.sol/Dai.json');

    UniswapABI = require("../abis/UniswapRouter.json");

    const daiContract = new ethers.Contract( 
        daiAddr, 
        daiArtifact.abi, 
        wallet );
    
    //Create UniswapV2 Router contract
        router = new ethers.Contract( 
            "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
            UniswapABI,
            wallet
        ); 

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

    try {

        const ethBalBefore = await provider.getBalance(acct)
        .then((bal) => {
            console.log("Receiver ETH balance before trade: ", toEther(bal) )
        }) 
        
        let amountIn = ethers.utils.parseEther(amount.toString()); //helper function to convert ETH to Wei       
        amountIn = amountIn.toString()
        console.log("Amount (WETH) that goes in: ", toEther(amountIn) )
        const slippageTolerance = new Percent(slippage, "10000"); // 50 bips, or 0.50% - Slippage tolerance
    
        console.log('')
        const trade = new Trade( //information necessary to create a swap transaction.
                route,
                new TokenAmount(weth, amountIn),
                //new TokenAmount(dai, amountIn),
                TradeType.EXACT_INPUT
        );
        console.log('Trade object created...')

        /******************************************************************************************** */

        const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // needs to be converted to e.g. hex
        const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();
        //const path = [wethAddr, daiAddr]; //An array of token addresses
        const path = [daiAddr, wethAddr]; //An array of token addresses
        const to = acct // should be a checksummed recipient address
        const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
        const value = trade.inputAmount.raw*10; // // needs to be converted to e.g. hex
        const valueHex = await ethers.BigNumber.from(value.toString()).toHexString(); //convert to hex string

        const amountInHex = ethers.BigNumber.from(amountIn.toString()).toHexString();

        const routerWithWallet = router.connect(wallet); 

        console.log('create transaction: ', routerWithWallet );
    
        // approve sale???
        //await approve(amountOutMinHex);
        //await routerWithWallet.approve(acct, amountIn)
        //.then ( () =>{
        //    console.log("Dai Amount approved... " )
        //})

        const rawTxn = await router.populateTransaction.swapExactTokensForETH(
            amountInHex,
            amountOutMinHex,
            path,
            to,
            Date.now()+1000*60*5,
            {
                gasLimit: 300000, //20e8,
                gasPrice:  ethers.utils.parseUnits("5.0", "gwei"),//20e9,
                value: valueHex
            })
/*pwd

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

    */
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