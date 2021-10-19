require('dotenv').config()
const Web3 = require('web3')
const web3 = new Web3(process.env.WEB3_PROVIDER)
const abi = require('../abi.js')
const config = require('../config.js')

module.exports = async () => {
  const allRegistries = config.REGISTRIES
  let data = []

  for(let i = 0; i<allRegistries.length; i++){
    const registry = new web3.eth.Contract(abi.REGISTRY_ABI, allRegistries[i])
    const funds = await registry.methods.getAllSmartFundAddresses().call()
    data = data.concat(funds)
  }

  return data
}
