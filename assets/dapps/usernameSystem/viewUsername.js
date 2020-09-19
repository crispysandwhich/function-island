var tronWeb;
var currentAddr;
var userdbContract;

window.onload = function() {
    if (!window.tronWeb) {
        const HttpProvider = TronWeb.providers.HttpProvider;
        const fullNode = new HttpProvider('https://api.trongrid.io');
        const solidityNode = new HttpProvider('https://api.trongrid.io');
        const eventServer = 'https://api.trongrid.io/';

        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer,);
        window.tronWeb = tronWeb;
    }
    once();
};

async function once() {
    tronWeb = window.tronWeb;
    userdbContract = await tronWeb.contract().at("TUGE5RtKfFdzgorsb79ZPGh1sVQdkpvAWz");

    currentAddr = tronWeb.defaultAddress['base58'];
    console.log(currentAddr);
          
    setTimeout(function() {}, 2000);
    setInterval(function() {namecheck();}, 2000);
}

function namecheck() {
    getLoggedInUsername();
}

function getLoggedInUsername() {
    if (currentAddr == undefined) {
        console.log('Undefined Addr')
    } else {
        userdbContract.getNameByAddress(currentAddr).call().then(result => {
            console.log(result)
            $('.arcTag').text(result.name)
            document.getElementsByClassName("arcTag").className = "text-white";
        }).catch((err) => {
            console.log(err)
        });
    } 
}