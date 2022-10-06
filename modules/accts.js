const { ethers } = require('hardhat');

//const rpcURL = 'https://polygon-mainnet.g.alchemy.com/v2/-xVyH7D3cYUoEWpjV1xuaHXQcXL7va-X';
const rpcURL = 'https://mainnet.infura.io/v3/4cd98623d90d401ca984c02080c6bf72';
//const rpcURL = 'http://localhost:8545';

const provider = new ethers.providers.JsonRpcProvider( rpcURL);

//
module.exports.provider = provider;
module.exports.acct1 = acct1;
module.exports.acct2 = acct2;
module.exports.privateKey = privateKey;
module.exports.account = account;
module.exports.signer = signer;
