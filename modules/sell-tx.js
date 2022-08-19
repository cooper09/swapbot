const { IpcProvider } = require("@ethersproject/providers");
const { Wallet } = require("ethers");
const { ethers } = require("hardhat");

//const rpcURL = 'http://localhost:8545';
//const rpcURL = 'https://mainnet.infura.io/v3/4cd98623d90d401ca984c02080c6bf72';
/********************************************************************* */

// utils generic ethers tools for formatting 
const {toBytes32, toString, toWei, toEther, toRound } = require('./utils');

/***********************************************************************************/ 
// set up primary and secondary addresses
const {provider, acct1, acct2, privateKey, signer, account } = require("./accts");

/***********************************************************************************/ 

const sell_tx = async (amount) => {
    
    console.log("send transaction: ", toEther(amount)  );

    const gasPrice = await provider.getGasPrice();
    console.log("gas price: ", ethers.utils.formatEther(gasPrice))

    const tx = {
        from: account.address,
        to: acct2,
        //value: ethers.utils.parseUnits('0.001', 'ether'),
        value: ethers.utils.parseUnits(toEther(amount), 'ether'),
        gasPrice,
        gasLimit: ethers.utils.hexlify(100000), //100 gwei
        nonce: provider.getTransactionCount(account.address, 'latest')
        }//end 

    try {
        console.log("submit sell tx...")
        const transaction = await account.sendTransaction(tx)
        console.log("transaction: ", transaction.hash)
        return true;

        } catch (e) {
        console.log("Send transaction failed: ", e.message);
        process.exit(1);
    }
   const ethBalbalance = await provider.getBalance(acct2)
    .then((bal) => {
        console.log("Receiver ETH balance after trade: ", toEther(bal) )
    }) 
 }//end test_send_ether

 module.exports = {sell_tx}

const amount =  ethers.BigNumber.from("0.000000477994554741")

 sell_tx(amount.toHexString);
