

const sell = async (id) => {
    console.log("Sell id: ", id );
    return `resolved sell order ${id}`;
}
module.exports.sell = sell;

//const result = sell(1);
//console.log("result: ", result );