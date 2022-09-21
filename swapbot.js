const { Provider } = require("@ethersproject/abstract-provider");
const { IpcProvider } = require("@ethersproject/providers");
const { ethers } = require("hardhat");
const { experimentalAddHardhatNetworkMessageTraceHook } = require("hardhat/config");

//1) create provider
//2) get address contract
//3) display contract provider balance

/***********************************************************************************/ 

// set up prvider, primary and secondary addresses
const {provider, acct1, acct2, privateKey, signer, account } = require("./modules/accts");

/********************************************************************* */

// utils generic ethers tools for formatting 
const {toBytes32, toString, toWei, toEther, toRound } = require('./modules/utils');

/********************************************************************* */

// Set up contracts 
const {wethArtifact, daiArtifact,daiContract, router } = require("./modules/contracts")

/***************************************************************************** */

//lets get down to business
const { buyAndSell} = require('./modules/buyandsell');

    let count = 0;
    const BUY_SELL = true;

    const init = async () =>{
        return Math.random() < 0.5;
    }

    init()
    .then( async (result) => {
            console.log("current count: ", count);
            //setInterval ( async () => {
                if (count <= 1 ){
                    ++count;
                    console.log("initial seed value: ", result );
                    const final = await buyAndSell(false);   // true: buy, false: sell 
                    console.log("Everything is A-OK: ", count );
                    const finalBal = await provider.getBalance(account.address);
                    console.log("send account ", account.address, " final balance: ", toEther(finalBal));
                } else {
                    console.log("All done...")
                    process.exit(0);
                }//end iffy
          //  }, 3000) //every 3 seconds
            //}, 60000) //every minute/
            //}, 3.6e+6) //every hour (3600000)

    })
    .catch(err => {
        console.log("Init - Error returned: ", err.message );
        process.exit(1);
    })