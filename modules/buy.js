
const { ethers } = require('hardhat');
const  {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');

const {provider, acct1, acct2, privateKey, signer, account } = require("./accts");
const {toBytes32, toString, toWei, toEther, toRound } = require('./utils');
const {wethArtifact, daiArtifact,daiContract, daiAddr, wethAddr, router } = require("./contracts");
/********************************************************************* */

const buy = async (id, orders) => {
    //console.log("Buy id: ", id );

/************************************************************************* */
    //return `resolved buy order ${id}`;
        return  Math.floor((Math.random()*5)+1);
    //returned the new buyOrders array
}
module.exports.buy = buy