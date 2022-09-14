const { IpcProvider } = require("@ethersproject/providers");
const { Wallet } = require("ethers");
const { ethers } = require("hardhat");

const rpcURL = 'http://localhost:8545';
//const provider = new ethers.providers.JsonRpcProvider( rpcURL);

/***********************************************************************************/ 
// set up primary and secondary addresses
const {provider, acct1, acct2, privateKey, signer, account } = require("./modules/accts");

/***********************************************************************************/ 

const testtx = require("./modules/test-tx");

const shellTx = async () => {
   console.log("test tx shell"); 

   const result = testtx.test_tx(1);
   console.log("result: ", result )
 }//end shell_tx

 //shellTx();
// module.exports.test_tx = test_tx;
