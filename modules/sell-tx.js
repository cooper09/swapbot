const { IpcProvider } = require("@ethersproject/providers");
const { Wallet } = require("ethers");
const { ethers } = require("hardhat");

const rpcURL = 'http://localhost:8545';
//const provider = new ethers.providers.JsonRpcProvider( rpcURL);

/***********************************************************************************/ 
// set up primary and secondary addresses
const {provider, acct1, acct2, privateKey, signer, account } = require("./accts");

/***********************************************************************************/ 

const sell_tx = async (amount) => {
    
    console.log("send transaction: ", amount, " signer: "  );
    const params = {
        from: signer.address,
        to: acct2,
        value: ethers.utils.parseUnits("1", "ether").toHexString()
    }

    try {
            console.log("About to send tx...");
            const hash = await provider.send('eth_sendTransaction', params);
            console.log("Transactions hash: ", hash );
        } catch (e) {
            console.log("sell_tx - pulled a dud: ", e.message )
        }
        
 }//end test_send_ether

 module.exports = {sell_tx}

 //sell_tx();
