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

const test_tx =  async (amount) => {
  console.log("Test Tx: ", amount );

  const amountOutMinHex = ethers.BigNumber.from(amount.toString()).toHexString();
  console.log("amountOutMinHex: ", amountOutMinHex.toString() );
  const path = [daiAddr, wethAddr]; //An array of token addresses
  console.log("the beaten path: ", path );

  const to = acct2 // should be a checksummed recipient address
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
  //const value = trade.inputAmount.raw*10; // // needs to be converted to e.g. hex
  const value = amount;
  const valueHex = await ethers.BigNumber.from(value.toString()).toHexString(); //convert to hex string

params = {
  amountIn: amountOutMinHex,
  amountOutMin: toWei("0.001"),
  path,
  to,
  deadline, 
      gasLimit: 300000, //20e8,
      gasPrice:  ethers.utils.parseUnits("5.0", "gwei"),//20e9,
      nonce: provider.getTransactionCount(account.address, 'latest') + 1,
  
} //end params

  const rawTxn = await router.populateTransaction.swapExactTokensForETH({
    params
  })
    .then(
            (result) =>{ console.log("Swap Dai for Eth: ", result );
        });
  
  return "Functoin test_tx...can you dig it!";
}//end test_tx

module.exports = {test_tx}

test_tx(toWei("0.1"));