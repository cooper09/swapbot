
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

const getPrice = async () => {
    console.log("Getprice")

    const chainId = 1;
    const [ownerSigner] = await ethers.getSigners();
    //console.log("getPrice - owner: ", [ownerSigner]);
    try {
    //console.log("Uniswap contract: ", uniswap )
    const dai = await Fetcher.fetchTokenData(chainId, daiAddr);
    const weth = WETH[chainId];
    const pair = await Fetcher.fetchPairData(dai,weth);
    const route = new Route([pair], weth );
    console.log("GetPrice - Buy WETH token with ", route.midPrice.toSignificant(6), " DAI" );
    console.log("GetPrice - Buy DAI token with ", route.midPrice.invert().toSignificant(6), " WETH\n" );

    return route.midPrice.toSignificant(6); //ethers.utils.formatUnits(value);

    } catch (e) {
        console.log("Uniswap price failed: ", e.message)// return the amount of WEI to trade
        process.exit(0) //on any error leave immediately
    }

}//end getPrice

module.exports.getPrice = getPrice;

// cooper s - for testing
//getPrice().then ((result) => {
//    console.log("getPrice returns: ", result )
//}