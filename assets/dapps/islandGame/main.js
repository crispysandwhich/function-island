var modal
var modalContent
var lastNumIslandResources=-1
var lastNumIslandPower=-1
var lastSecondsUntilFull=100
lastConvertTime=0
var islandresourcestoconvert1=864
var lastUpdate=new Date().getTime()
var modalID=0
function main(){
    // console.log('test')
    modal = document.getElementById('myModal');
    modalContent=document.getElementById('modal-internal')
    waitForTronWeb()
}
async function waitForTronWeb(){
    if (typeof(window.tronWeb) === 'undefined') {
        console.log('Waiting for tronWeb...');
        setTimeout(waitForTronWeb, 1000);
    } else {
        myContract = await tronWeb.contract().at(contractAddress);
        setTimeout(function(){
            controlLoop()
            controlLoopFaster()
        },1000);
    }
}

function controlLoop(){
    refreshData()
    setTimeout(controlLoop,2500)
}

function controlLoopFaster(){
    liveUpdateIslandResources()
    setTimeout(controlLoopFaster,30)
}

function stripDecimals(str, num){
	if (str.indexOf('.') > -1){
		var left = str.split('.')[0];
		var right = str.split('.')[1];
		return left + '.' + right.slice(0,num);
	}
	else {
		return str;
	}
}

function numberWithCommas(x) {return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");} 
function formatIslandResources(islandresources){return translateQuantity(islandresources/islandresourcestoconvert1)}
function displayTransactionMessage(){alertify.success("Transaction Submitted")}
function weiToDisplay(trxprice){return formatTrxValue(tronWeb.toSun(trxprice))}
function formatTrxValue(trxstr){return parseFloat(parseFloat(trxstr).toFixed(5));}
function onlyLetters(text){return text.replace(/[^0-9a-zA-Z\s\.!?,]/gi, '')}
function onlyurl(str){return str.replace(/[^0-9a-zA-Z\.?&\/\+#=\-_:]/gi, '')}
function callbackClosure(i, callback) {return function() {return callback(i);}}

function refreshData(){
    var balanceElem = document.getElementById('contractBal');
    
    contractBalance(function(result){
        rawStr = numberWithCommas(tronWeb.fromSun(result));
        balanceElem.textContent = stripDecimals(rawStr, 1);
    });

    calculateResourceSell(86400,function(sun){});
    lastConvert(tronWeb.defaultAddress['base58'],function(lh){lastConvertTime=lh});
    
    RESOURCES_TO_GET_1POWER(function(islandresources){islandresourcestoconvert1=islandresources});
    getMyIslandResources(function(islandresources){
        if(lastNumIslandResources!=islandresources){
            lastNumIslandResources=islandresources
            lastUpdate=new Date().getTime()
            updateResourceNumber(islandresources/islandresourcestoconvert1)//formatIslandResources(islandresources))

        }
        var timeuntilfulldoc=document.getElementById('timeuntilfull')
        secondsuntilfull=islandresourcestoconvert1-islandresources/lastNumIslandPower
        console.log('secondsuntilfull ',secondsuntilfull,islandresourcestoconvert1,islandresources,lastNumIslandPower)
        lastSecondsUntilFull=secondsuntilfull
        timeuntilfulldoc.textContent=secondsToString(secondsuntilfull)
        if(lastNumIslandPower==0){timeuntilfulldoc.textContent='?'}
    });
    
    getMyIslandPower(function(islandpower){
        lastNumIslandPower=islandpower
        var allnumislandpower=document.getElementsByClassName('numislandpower')
        for(var i=0;i<allnumislandpower.length;i++){if(allnumislandpower[i]){allnumislandpower[i].textContent=translateQuantity(islandpower)}}
        var productiondoc=document.getElementById('production')
        productiondoc.textContent=formatIslandResources(lastNumIslandPower*60*60)
    });
    updateBuyPrice()
    updateSellPrice()
}

function updateResourceNumber(islandresources){
    var convertislandpowerquantitydoc=document.getElementById('convertislandpowerquantity')
    convertislandpowerquantitydoc.textContent=translateQuantity(islandresources,0)
    var allnumislandresources=document.getElementsByClassName('numislandresources')
    for(var i=0;i<allnumislandresources.length;i++){if(allnumislandresources[i]){allnumislandresources[i].textContent=translateQuantity(islandresources)}}
}

function convertIslandResources1(){
    console.log('convertislandresources')
    convertIslandResources(displayTransactionMessage())
}

function liveUpdateIslandResources(){
    if(lastSecondsUntilFull>1 && lastNumIslandResources>=0 && lastNumIslandPower>0 && islandresourcestoconvert1>0){
        currentTime=new Date().getTime()
        if(currentTime/1000-lastConvertTime>islandresourcestoconvert1){return;}
        difference=(currentTime-lastUpdate)/1000
        additionalIslandResources=Math.floor(difference*lastNumIslandPower)
        updateResourceNumber((lastNumIslandResources+additionalIslandResources)/islandresourcestoconvert1)
    }
}

function updateSellPrice(){
    var islandresourcestoselldoc=document.getElementById('sellprice')
    getMyIslandResources(function(islandresources){
        calculateResourceSell(islandresources,function(sun){
            console.log('sellprice ',sun)
            islandresourcestoselldoc.textContent=formatTrxValue(tronWeb.fromSun(sun))
        });
   });
}

function updateBuyPrice(){
    var islandresourcestobuydoc=document.getElementById('islandresourcestobuy')
    var trxspenddoc=document.getElementById('trxtospend')
    suntospend = tronWeb.toSun(trxspenddoc.value)
    calculateResourceBuySimple(suntospend,function(islandresources){islandresourcestobuydoc.textContent=formatIslandResources(islandresources)});
}

function buyIslandResources2(){
    var trxspenddoc=document.getElementById('trxtospend')
    suntospend = tronWeb.toSun(trxspenddoc.value)
    buyIslandResources(suntospend,function(){displayTransactionMessage();});
}

function translateQuantity(quantity,precision){
    quantity=Number(quantity)
    finalquantity=quantity
    modifier=''

    if(quantity>1000000){
        modifier='M'
        finalquantity=quantity/1000000
    }
    if(quantity>1000000000){
        modifier='B'
        finalquantity=quantity/1000000000
    }
    if(quantity>1000000000000){
        modifier='T'
        finalquantity=quantity/1000000000000
    }
    if(precision == undefined){
        precision=0
        if(finalquantity<10000){precision=1}
        if(finalquantity<1000){precision=2}
        if(finalquantity<100){precision=3}
        if(finalquantity<10){precision=4}
    }
    if(precision==0){finalquantity=Math.floor(finalquantity)}
    return finalquantity.toFixed(precision)+modifier;
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return(false);
}

function secondsToString(seconds) {
    seconds=Math.max(seconds,0)
    var numdays = Math.floor(seconds / 86400);
    var numhours = Math.floor((seconds % 86400) / 3600);
    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    var numseconds = ((seconds % 86400) % 3600) % 60;
    var endstr=""
    return numhours + "h " + numminutes + "m "//+numseconds+"s";
}

function disableButtons(){
    var allnumislandpower=document.getElementsByClassName('btn-lg')
    for(var i=0;i<allnumislandpower.length;i++){if(allnumislandpower[i]){allnumislandpower[i].style.display="none"}}
    var allnumislandpower=document.getElementsByClassName('btn-md')
    for(var i=0;i<allnumislandpower.length;i++){if(allnumislandpower[i]){allnumislandpower[i].style.display="none"}}
}

function enableButtons(){
    var allnumislandpower=document.getElementsByClassName('btn-lg')
    for(var i=0;i<allnumislandpower.length;i++){if(allnumislandpower[i]){allnumislandpower[i].style.display="inline-block"}}
    var allnumislandpower=document.getElementsByClassName('btn-md')
    for(var i=0;i<allnumislandpower.length;i++){if(allnumislandpower[i]){allnumislandpower[i].style.display="inline-block"}}
}

function checkOnlyLetters(str){
    var pattern=new RegExp('^[0-9a-zA-Z\s\.!?,]*$')
    if(!pattern.test(str)) {return false;} else {return true;}
}

function validurlsimple(str){
    var pattern=new RegExp('^[a-z0-9\.?&\/\+#=\-_:]*$')
    if(!pattern.test(str)) {return false;} else {return true;}
}

// protocol, domain name OR ip (v4) address, port and path, query string, fragment locator.
function ValidURL(str) {
    var pattern = new RegExp('^(https?:\/\/)?' + '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|' + '((\d{1,3}\.){3}\d{1,3}))' + '(\:\d+)?(\/[-a-z\d%_.~+]*)*' + '(\?[;&a-z\d%_.~+=-]*)?' + '(\#[-a-z\d_]*)?$','i');
    if(!pattern.test(str)) {
        alert("Please enter a valid URL.");
        return false;
    } else {
        return true;
    }
}