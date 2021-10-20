require('dotenv').config()
const getCurrentBalance = require('../utills/getCurrentBalance')
const getAllFundsAddresses = require('../utills/getAllFundsAddresses')
const store = require('store')
const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

let intervalID = 0

module.exports = () => {
  run()
}

// set global time
store.set('time', Date.now() / 1000)
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
    const currentTime = Date.now() / 1000
    const storedTime = store.get('time')
    const delay = process.env.DELAY || 900

    if(currentTime >= storedTime + delay){
      console.log("Run updater")
      store.set('time', Date.now() / 1000)
      updater()
    }else{
      console.log("No need update")
    }

    // set new interval
    intervalID = setTimeout(run, 5000)
}

async function initFunds() {
  console.log("INIT funds")
  store.set('initialized', true)
}

async function updater(){
  const allFunds = await getAllFundsAddresses()

  for(let i=0; i<allFunds.length; i++){
    console.log(await getCurrentBalance(allFunds[i]))
  }
}
