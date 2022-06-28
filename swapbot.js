const { Provider } = require("@ethersproject/abstract-provider");
const { IpcProvider } = require("@ethersproject/providers");
const { Wallet } = require("ethers");
const { ethers } = require("hardhat");
const { experimentalAddHardhatNetworkMessageTraceHook } = require("hardhat/config");

//1) create provider
//2) get address contract
//3) display contract provider balance

//const rpcURL = 'https://polygon-mainnet.g.alchemy.com/v2/-xVyH7D3cYUoEWpjV1xuaHXQcXL7va-X';
//const rpcURL = 'https://mainnet.infura.io/v3/4cd98623d90d401ca984c02080c6bf72';
const rpcURL = 'http://localhost:8545';

const provider = new ethers.providers.JsonRpcProvider( rpcURL);

/***********************************************************************************/ 
// set up primary and secondary addresses
const acct1 ="0x2fc8eB0aD0Ba242b5856fbdbF411237342A6756F"; //Primary Account 1 
const acct2 = "0x4986828740bBDBC7CD6Ab10e0753d123f868dc40"; //local Receiver Account 1
const privateKey = "a3994cf9f5df831441f98cbe07d1dbd4f2b1ac80518a1de7d66e6f7ef2a03a4a"// Primary Account 1
;const signer = new ethers.Wallet(privateKey); //
const account = signer.connect(provider);  //The signer is Primary Account 1

/********************************************************************* */

/********************************************************************* */
// utils
const toBytes32 = text => ( ethers.utils.formatBytes32String(text));
const toString = byte32 => ( ethers.utils.formatBytes32String(byte32));
const toWei = ether => ( ethers.utils.parseEther(ether));
const toEther = wei => ( ethers.utils.formatEther(wei).toString());
const toRound = num => ( ethers.utils.toFixed(2));
/********************************************************************* */

// Set up contracts 
const wethArtifact = require('./artifacts/contracts/Weth.sol/Weth.json');
const daiArtifact = require('./artifacts/contracts/Dai.sol/Dai.json');

UniswapABI = require("./abis/UniswapRouter.json")

const wethAddr = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; //Mainnet
const daiAddr = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; //Mainnet

const daiContract = new ethers.Contract( 
    daiAddr, 
    daiArtifact.abi, 
    account );

//Create UniswapV2 Router contract
    const router = new ethers.Contract( 
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        UniswapABI,
        account
    );

    /***************************************************************************** */

    const {buySwap} = require('./modules/buyswap');
    const {sellSwap} = require('./modules/sellswap');
    
    const buyAndSell = async (buy) => {
        console.log("The fun of buying and selling: ", buy);

        const network =  await provider.detectNetwork()
        console.log("Runnig on network id: ", network.chainId, "", network.name );
    
        const balance = await provider.getBalance(account.address);
        console.log("acct: ",account.address," balance: ", toEther(balance));

        const contractDaiWallet = daiContract.connect(account);
        await contractDaiWallet.balanceOf(acct1)
            .then((bal) => {
                console.log(account.address, " current DAI balance: ", toEther(bal) )
            })

    /********************************************************************** */
    // set up Uniswap variables for pair trading...
   
    if (buy) {
        console.log("Buy DAI with ETH");
            await buySwap( account, acct2);
        } else {
            console.log("Sell DAI for ETH");
            await sellSwap(account, acct2, provider);
        }

    process.exit(0);

    }//end buyAndSell

    const BUY_SELL = false; // True: Buy, False: Sell --- start with a buy then altermate
    buyAndSell (BUY_SELL);