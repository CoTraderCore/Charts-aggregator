const getCurrentBalance = require('./utills/getCurrentBalance')
const getAllFundsAddresses = require('./utills/getAllFundsAddresses')

const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'


async function updater(){
  const allFunds = await getAllFundsAddresses()

  for(let i=0; i<allFunds.length; i++){
    console.log(await getCurrentBalance(allFunds[i]))
  }
}

updater()
