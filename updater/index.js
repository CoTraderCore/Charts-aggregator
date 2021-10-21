require('dotenv').config()
const getCurrentBalance = require('../utills/getCurrentBalance')
const getAllFundsAddresses = require('../utills/getAllFundsAddresses')
const store = require('store')
const mysql = require('../mysql')

let intervalID = 0

module.exports = () => {
  run()
}

// set global time
store.set('time', Number(Date.now() / 1000).toFixed())
store.set('initialized', false)

// check if Trade open each 3 seconds
async function run() {
    // clear prev interval
    if(intervalID !== 0)
       clearTimeout(intervalID)

    // check if need init funds
    if(!store.get('initialized'))
      initFunds()

    // define time period for update
    const currentTime = Number(Date.now() / 1000).toFixed()
    const storedTime = store.get('time')
    const delay = Number(process.env.DELAY || 86400) // delay 24 hours

    if(Number(currentTime) >= Number(storedTime) + Number(delay)){
      store.set('time', Number(Date.now() / 1000).toFixed())
      updater()
    }else{
      console.log("Next update in :", Number(storedTime) + Number(delay) - Number(currentTime), "sec")
    }

    // set new interval
    intervalID = setTimeout(run, 60000)
}

async function initFunds() {
  console.log("INIT funds")
  const allFunds = await getAllFundsAddresses()

  for(let i=0; i<allFunds.length; i++){
    const balance = await getCurrentBalance(allFunds[i])
    mysql.insertFund(allFunds[i], [balance])
  }

  store.set('initialized', true)
}

async function updater(){
  console.log("Run updater")
  const allFunds = await getAllFundsAddresses()

  for(let i=0; i<allFunds.length; i++){
    const balance = await getCurrentBalance(allFunds[i])
    const prevData = await mysql.getFundValue('balance', allFunds[i])
    const parsedData = JSON.parse(JSON.parse(JSON.stringify(prevData)).balance)
    parsedData.push(balance)
    mysql.updateFundValue('balance', parsedData, allFunds[i], true)
  }
}
