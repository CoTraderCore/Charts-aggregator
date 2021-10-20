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
store.clearAll()
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
    const delay = Number(process.env.DELAY || 900)

    if(Number(currentTime) >= Number(storedTime + delay)){
      store.set('time', Number(Date.now() / 1000).toFixed())
      updater()
    }else{
      console.log("No need update")
    }

    // set new interval
    intervalID = setTimeout(run, 5000)
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
  const prevData = await mysql.getFundValue('balance', allFunds[i])

  for(let i=0; i<allFunds.length; i++){
    const balance = await getCurrentBalance(allFunds[i])
    const prevData = await mysql.getFundValue('balance', allFunds[i])
    const newData = prevData.push(balance)
    mysql.updateFundValue('balance', newData, allFunds[i], true)
  }
}
