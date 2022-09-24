
const { ethers } = require('hardhat');
const  {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');

const {provider, acct1, acct2, privateKey, signer, account } = require("./accts");
const {toBytes32, toString, toWei, toEther, toRound } = require('./utils');
const {wethArtifact, daiArtifact,daiContract, daiAddr, wethAddr, router } = require("./contracts");
/********************************************************************* */

const buy = async (id) => {
    console.log("Buy id: ", id );

    const network =  await provider.detectNetwork();
    const wethArtifact = require('../artifacts/contracts/Weth.sol/Weth.json');
    const daiArtifact = require('../artifacts/contracts/Dai.sol/Dai.json');

    UniswapABI = require("../abis/UniswapRouter.json")

    const wethAddr = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; //Mainnet
    const daiAddr = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; //Mainnet

    // WETH contract and balance
    const wethContract = new ethers.Contract( 
        wethAddr,
        wethArtifact.abi,
        account
    );

    const daiContract = new ethers.Contract( 
        daiAddr, 
        daiArtifact.abi, 
        account );

    //Create UniswapV2 Router contract
    const router = new ethers.Contract( 
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        UniswapABI,
        account
    );

    /*********************************************************************** */
    //Set Up a Uniswap trade...
    const chainId = 1;

    const dai = await Fetcher.fetchTokenData(chainId, daiAddr );
    const weth = WETH[chainId];
    const pair = await Fetcher.fetchPairData(dai,weth);
    const route = new Route([pair], weth );
    //console.log("Buy 1 WETH with ", route.midPrice.toSignificant(6)," Dai" );
    //console.log("Buy 1 DAI with ", route.midPrice.invert().toSignificant(6)," Eth" );

    console.log("The ammount of Dai we are selling: ", toWei(route.midPrice.invert().toSignificant(6)) )
    let amountEthFromDAI = await router.getAmountsOut(
            toWei(route.midPrice.invert().toSignificant(6)),
            [daiAddr, wethAddr]
        )//end amountFromDai

    console.log("The ammount of Dai we are selling: ", toWei(route.midPrice.invert().toSignificant(6)) )
//console.log("Amount of Eth from Dai - DAI: ", toEther(amountEthFromDAI[0]));
//console.log("Amount of ETH from DAI - ETH: ", toEther(amountEthFromDAI[1]));

const amount = toEther(amountEthFromDAI[0]);
let slippage = toBytes32("0.050");
/************************************************************************* */   
// Buy Swap goes here...

/************************************************************************* */
    return `resolved buy order ${id}`;
}
module.exports.buy = buy;