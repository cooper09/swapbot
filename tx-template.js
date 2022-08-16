const { IpcProvider } = require("@ethersproject/providers");
const { Wallet } = require("ethers");
const { ethers } = require("hardhat");

const rpcURL = 'http://localhost:8545';
//const provider = new ethers.providers.JsonRpcProvider( rpcURL);

/***********************************************************************************/ 
// utils generic ethers tools for formatting 
const {toBytes32, toString, toWei, toEther, toRound } = require('./modules/utils');

/***********************************************************************************/ 
// set up primary and secondary addresses
const {provider, acct1, acct2, privateKey, signer, account } = require("./modules/accts");

/***********************************************************************************/ 

const test_send_ether = async () => {
    
    console.log("test_send_ether: ");
    const params = {
        from: signer.address,
        to: acct2,
        value: ethers.utils.parseUnits("1", "ether").toHexString(),
        nonce: provider.getTransactionCount(account.address, 'latest')
    }
/*
    const params = {
        "from":signer.address,
        "to": acct2,
        "gas": "0x76c0", // 30400
        "gasPrice": "0x9184e72a000", // 10000000000000
        "value": "0x9184e72a", // 2441406250
        "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"
      };
*/
    try {
    const hash = await provider.send('eth_sendTransaction', params);
    console.log("Transactions hash: ", hash );
    } catch (e) {
        console.log("pulled a dud: ", e.message )
    }
 }//end test_send_ether

 module.exports.test_send_ether = test_send_ether;

 test_send_ether();
