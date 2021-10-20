require('dotenv').config()
const Web3 = require('web3')
const web3 = new Web3(process.env.WEB3_PROVIDER)
const abi = require('../abi.js')
const config = require('../config')


module.exports = async (fundAddress) => {
  const fund = new web3.eth.Contract(abi.FUND_ABI, fundAddress)

  const allTokenAddresses = await fund.methods.getAllTokenAddresses().call()
  const data = []

  for(let i = 0; i < allTokenAddresses.length; i++){
    const balance = await fund.methods.getFundTokenHolding(allTokenAddresses[i]).call()
    const valueInUSD = await getValueFromRouter(allTokenAddresses[i], balance)
    data.push({address:allTokenAddresses[i], balance, valueInUSD})
  }

  return { date:Number(Date.now() / 1000).toFixed(), data }
}


async function getValueFromRouter(address, amount) {
  const router = new web3.eth.Contract(abi.ROUTER_ABI, config.UNIROUTER)

  if(String(config.USDADDRESS).toLowerCase() === String(config.USDADDRESS).toLowerCase(address))
     return amount

  try{
    const result = router.getAmountOut([address, config.USDADDRESS], amount)
    return result[1]
  }catch(e){
    return 0
  }
}
