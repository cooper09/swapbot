const { ethers } = require('hardhat');

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
