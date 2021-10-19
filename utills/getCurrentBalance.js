require('dotenv').config()
const Web3 = require('web3')
const web3 = new Web3(process.env.WEB3_PROVIDER)
const abi = require('../abi.js')


module.exports = async (fundAddress) => {
  const fund = new web3.eth.Contract(abi.FUND_ABI, fundAddress)
  const allTokenAddresses = await fund.methods.getAllTokenAddresses().call()
  const data = []

  for(let i = 0; i < allTokenAddresses.length; i++){
    const balance = await fund.methods.getFundTokenHolding(allTokenAddresses[i]).call()
    data.push({address:allTokenAddresses[i], balance})
  }

  return data
}
