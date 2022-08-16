const { provider, account, acct1, acct2 } = require('./accts');
const { toEther } = require('./utils');
const { daiContract } = require('./contracts');

const {buySwap} = require('./buyswap');
const {sellSwap} = require('./sellswap');
//const {sellSwap} = require('./testSell-3'); // test and breakdlown the buy into parts...

const buyAndSell = async (buy) => {
    console.log("The fun of buying and selling: ", buy);
    const network =  await provider.detectNetwork()
    console.log("Runnig on network id: ", network.chainId, "", network.name );

    const balance = await provider.getBalance(account.address);
    console.log("acct: ",account.address," start balance: ", toEther(balance));

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

}//end buyAndSell

module.exports.buyAndSell = buyAndSell;