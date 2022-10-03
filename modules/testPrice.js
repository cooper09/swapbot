//return random test price
 const testPrice = async (min, max ) => {
    return Math.floor(Math.random() * (max - min) + min)
}//end testPrice

module.exports.testPrice = testPrice;
