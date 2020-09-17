// contractAddress = 'TUqFXRpoEHohQWMKU4uoAkVchMkgHAjKVY';
contractAddress = 'TN25ZeR3C8s7mMGCn4McgtCu6PcXBmrYPJ';
var myContract;
var canSell = true;

function sellIslandResources(callback){
    if (canSell) {
        canSell = false;
        console.log('Selling');
        myContract.sellIslandResources().send().then(result => {
            callback();
        }).catch((err) => {
            console.log(err)
        });
        setTimeout(function(){
            canSell = true;
        },10000);
    } else {
        console.log('Cannot sell yet...')
    };
}

function calculateResourceBuy(trx,contractBalance,callback){
    myContract.calculateResourceBuy(trx,contractBalance).call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function calculateResourceBuySimple(trx,callback){
    myContract.calculateResourceBuySimple(trx).call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function calculateResourceSell(resources,callback){
    myContract.calculateResourceSell(resources).call().then(result => {callback(tronWeb.toDecimal(result));}).catch((err) => {console.log(err)});
}

function claimedIslandResources(callback){
    myContract.claimedIslandResources().call().then(result => {callback(tronWeb.toDecimal(result));}).catch((err) => {console.log(err)});
}

function RESOURCES_TO_GET_1POWER(callback){
    myContract.RESOURCES_TO_GET_1POWER().call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function getBalance(callback){
    myContract.getBalance().call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function getIslandResourcesSinceLastConvert(address,callback){
    myContract.getIslandResourcesSinceLastConvert(address).call().then(result => {
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function getMyIslandResources(callback){
    myContract.getMyIslandResources().call().then(result => {callback(tronWeb.toDecimal(result));}).catch((err) => {console.log(err)});
}

function contractBalance(callback){
    tronWeb.trx.getBalance(contractAddress).then(result => {callback(tronWeb.toDecimal(result));}).catch((err) => {console.log(err)});
}

function buyIslandResources(trx,callback){
    myContract.buyIslandResources().send({callValue: trx}).then(result => {callback();}).catch((err) => {console.log(err)});
}

function convertIslandResources(callback){
    myContract.convertIslandResources().send().then(result => {console.log(result);});
}

function getMyIslandPower(callback){
    myContract.getMyIslandPower().call().then(result => {
        if (result == '0x') {result = 0;}
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}

function lastConvert(address,callback){
    myContract.lastConvert(address).call().then(result => {callback(tronWeb.toDecimal(result));}).catch((err) => {console.log(err)});
}

function marketIslandResources(callback){
    myContract.marketIslandResources().call().then(result => {
        console.log(result)
        console.log(tronWeb.toDecimal(result))
        callback(tronWeb.toDecimal(result));
    }).catch((err) => {
        console.log(err)
    });
}