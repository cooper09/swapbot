
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

const sell = async (id) => {
    console.log("Sell id: ", id );
    return `resolved sell order ${id}`;
}
module.exports.sell = sell;

//const result = sell(1);
//console.log("result: ", result );