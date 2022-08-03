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
//const acct1 ="0x2fc8eB0aD0Ba242b5856fbdbF411237342A6756F"; //Primary Account 1 
const acct1 = "0xb12A2AE1735Cc533837EB73D2747e4804471A0b0"; //Test Account address
const acct2 = "0x4986828740bBDBC7CD6Ab10e0753d123f868dc40"; //local Receiver Account 1
const privateKey = "af11e0cdb8816e4e036731d9cf0b223a988068d671217244aef3bfe356a2779c"// Test Account 
//const privateKey = "efc31df5cce3adac2038c35dae71a28d8b74c75e3ad4e9a0b1602e7c4672ec" // Receiver acctount
const signer = new ethers.Wallet(privateKey); //
const account = signer.connect(provider);  //The signer is Test Account

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
    //const {sellSwap} = require('./modules/sellswap');
    const {sellSwap} = require('./modules/testSell'); // test and breakdlown the buy into parts...
    
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

    //process.exit(0);

    }//end buyAndSell

    let count = 0;
    const BUY_SELL = true;
    //buyAndSell (BUY_SELL);

    const init = async () =>{
        return Math.random() < 0.5;
    }

    init()
    .then( async (result) => {
        setInterval ( async () => {
            ++count;
            const buy_or_sell = Math.random() < 0.5;
            console.log("initial seed value: ", buy_or_sell )
            const final = await buyAndSell(false);   // true: buy, false: sell 
            console.log("Everything is A-OK: ", count );
            const finalBal = await provider.getBalance(account.address);
            //process.exit(0);
        //}, 60000) //*/
        }, 3000)
    })
    .catch(err => {
        console.log("Init - Error returned: ", err.message );
        process.exit(1);
    })