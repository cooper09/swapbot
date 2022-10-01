const { ethers } = require('hardhat');

//const rpcURL = 'https://polygon-mainnet.g.alchemy.com/v2/-xVyH7D3cYUoEWpjV1xuaHXQcXL7va-X';
//const rpcURL = 'https://mainnet.infura.io/v3/4cd98623d90d401ca984c02080c6bf72';
const rpcURL = 'http://localhost:8545';

const provider = new ethers.providers.JsonRpcProvider( rpcURL);

const acct1 = "0xb12A2AE1735Cc533837EB73D2747e4804471A0b0"; //Test Account address
//const acct1 = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; //Hardhatt Account address
const acct2 = "0x4986828740bBDBC7CD6Ab10e0753d123f868dc40"; //local Receiver Account 1

//Primary Acocunt - used for testing purposes onely
const testAcct = "0x2fc8eB0aD0Ba242b5856fbdbF411237342A6756F";  //Primary Acocunt - used for testing purposes onely
//privateKey = "a3994cf9f5df831441f98cbe07d1dbd4f2b1ac80518a1de7d66e6f7ef2a03a4a";

//Private keys
const privateKey = "af11e0cdb8816e4e036731d9cf0b223a988068d671217244aef3bfe356a2779c"// Test Account 
//const privateKey = "efc31df5cce3adac2038c35dae71a28d8b74c75e3ad4e9a0b1602e7c4672ec18" // Receiver acctount
//Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
//privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'  //hardhat fork account

//signer account
const signer = new ethers.Wallet(privateKey); //
const account = signer.connect(provider);  //The signer is Test Account
//
module.exports.provider = provider;
module.exports.acct1 = acct1;
module.exports.acct2 = acct2;
module.exports.testAcct = testAcct;
module.exports.privateKey = privateKey;
module.exports.account = account;
module.exports.signer = signer;
