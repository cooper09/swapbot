const { IpcProvider } = require("@ethersproject/providers");
const { Wallet } = require("ethers");
const { ethers } = require("hardhat");

const rpcURL = 'http://localhost:8545';
const provider = new ethers.providers.JsonRpcProvider( rpcURL);

/***********************************************************************************/ 
// set up primary and secondary addresses
const acct1 = "0xb12A2AE1735Cc533837EB73D2747e4804471A0b0"; //Test Account address
const acct2 = "0x4986828740bBDBC7CD6Ab10e0753d123f868dc40"; //local Receiver Account 1
const privateKey = "af11e0cdb8816e4e036731d9cf0b223a988068d671217244aef3bfe356a2779c"// Test Account 
const signer = new ethers.Wallet(privateKey); //
const account = signer.connect(provider);  //The signer is Test Account

const test_send_ether = async () => {
    
    const params = {
        from: signer.address,
        to: acct2,
        value: ethers.utils.parseUnits("1", "ether").toHexString()
    }

    try {
    const hash = await provider.send('eth_sendTransaction', params);
    console.log("Transactions hash: ", hash );
    } catch (e) {
        console.log("pulled a dud: ", e.message )
    }
 }//end test_send_ether


 test_send_ether();
