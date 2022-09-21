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
const { getPrice} = require('./modules/getprice');

    let count = 0;
    const BUY_SELL = true;

    const init = async () =>{
        return await getPrice();

        //return Math.random() < 0.5;

    }

    init()
    .then( async (startPrice) => {
            console.log("starting price: ", startPrice);
            setInterval ( async () => {
      
                    ++count;
                    console.log("\n\nInit - initial seed value: ", startPrice );
                    //const final = await buyAndSell(false);   // true: buy, false: sell 
                    //tally up final balances
                    const final = await buyAndSell(startPrice); 
                    console.log("Everything is A-OK: ", count, "\n" );
                    const finalBal = await provider.getBalance(account.address);
                    console.log("send (Test) account - final ETH balance: ", toEther(finalBal));
                    // Sender Dai balance
                    const contractDaiWalletSender = daiContract.connect(acct1);

                    //Test Account Eth/Dai balance
                        const rcvrBal = await provider.getBalance(acct2);
                        console.log("Final Rcvr ETH account ", acct2, " final ETH balance: ", toEther(rcvrBal));
                        await contractDaiWalletSender.balanceOf(acct2)
                        .then((bal) => {
                            console.log("Rcvr DAI balance: ", toEther(bal) )
                        })
        // Set specific time interval
            //}, 3000) //every 3 seconds
            //}, 60000) //every minute/
            }, 300000)  //every 5 minutes
            //}, 900000 ) //every 15 minutes
            //}, 1800000 )//every 30 minutes
            //}, 3600000) //every hour (3600000)
        //process.exit(0);
    })
    .catch(err => {
        console.log("Init - Error returned: ", err.message );
        process.exit(1);
    })