const { IpcProvider } = require("@ethersproject/providers");
const { Wallet } = require("ethers");
const { ethers } = require("hardhat");

//const rpcURL = 'http://localhost:8545';
//const provider = new ethers.providers.JsonRpcProvider( rpcURL);

/***********************************************************************************/ 
// set up primary and secondary addresses
const {provider, acct1, acct2, privateKey, signer, account } = require("./accts");

/***********************************************************************************/ 

const test_tx = (amount) => {
  return "Functoin test_tx...can you dig it!";
}//end test_tx

module.exports = {test_tx}
/*
const test_tx = async (amount) => {
    
   console.log("test tx amount: ", amount );
 }//end test_send_ether

 module.exports.test_tx = test_tx;
*/