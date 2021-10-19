require('dotenv').config()
const Web3 = require('web3')
const web3 = new Web3(process.env.WEB3_PROVIDER)

const abi = require('./abi.js')
const getEvent = require('./getEvent.js')
const _ = require('lodash')
const BigNumber = require('bignumber.js')
const fs = require('fs')
const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
const FUND_ADDRESS = "0xdfC8066De0dA1392C264c1a26d3328f386652A21"
const localDB = []

const fund = new web3.eth.Contract(abi.FUND_ABI, FUND_ADDRESS)

let connectorsAddress
let connectorsAmount

// events parser
async function runEvensChecker(address, abi){
  let fundAsset
  try{
    fundAsset = await fund.methods.stableCoinAddress().call()
  }catch(e){
    fundAsset = ETH_ADDRESS
  }

  let eventsObj = await getEvent(address, abi, 0, 'allEvents', web3)

  // Check if some events in case happen for this fund address
  if(!_.isEmpty(eventsObj)){

  for(let i =0; i < eventsObj.length; i++){
  const EventName = eventsObj[i].event

  switch(EventName){
    case 'Deposit':
    console.log(
      `Deposit event,
       amount ${eventsObj[i].returnValues[1]}`
    )
    insertOrIncreaseTokenValue(fundAsset, eventsObj[i].returnValues[1])
    break

    case 'Withdraw':
    console.log(
      `Withdraw event,
       cut share ${eventsObj[i].returnValues[1]}
       total share ${eventsObj[i].returnValues[2]}`
    )

    subWithdraw(eventsObj[i].returnValues[1], eventsObj[i].returnValues[2])
    break

    case 'Trade':
    console.log(
      `Trade event,
       src address ${eventsObj[i].returnValues[0]},
       dest address: ${eventsObj[i].returnValues[2]},
       amountSent ${eventsObj[i].returnValues[1]},
       amountRecieve ${eventsObj[i].returnValues[3]}
       `
    )
    insertOrIncreaseTokenValue(eventsObj[i].returnValues[2], eventsObj[i].returnValues[3])
    reduceTokenValue(eventsObj[i].returnValues[0], eventsObj[i].returnValues[1])
    break
    }
   }
  }
}

// Add amount to a certain token address
function insertOrIncreaseTokenValue(address, amount) {
  const searchObj = localDB.filter((item) => {
    return item.address === address
  })

  if(searchObj.length > 0){
    // update amount
    let curAmount = new BigNumber(searchObj[0].amount)
    searchObj[0].amount = curAmount.plus(amount).toString(10)
  }else{
    // insert
    localDB.push(
      { address, amount }
    )
  }
}


// sub amount from a certain token address
function reduceTokenValue(address, amount) {
  const searchObj = localDB.filter((item) => {
    return item.address === address
  })

  if(searchObj.length > 0){
    // update amount
    let curAmount = new BigNumber(searchObj[0].amount)
    searchObj[0].amount = curAmount.minus(amount).toString(10)
  }
}



// sub withdrawed % from each token in DB
async function subWithdraw(cutShare, removedShare){
  let TOTAL_SHARES = new BigNumber(cutShare).plus(removedShare)

  localDB.forEach((item) => {
    let amount = new BigNumber(item.amount)
    item.amount = BigNumber(amount.minus(amount.multipliedBy(cutShare).dividedBy(TOTAL_SHARES))).toString(10)
  })
}


// TODO
function compareBalanceFromContractAndLocalDB(){
  return
}



// test call
(async function main(){
  await runEvensChecker(FUND_ADDRESS, abi.FUND_ABI)

  fs.writeFileSync('./data.json', JSON.stringify(localDB, null, 2) , 'utf-8');
}())
