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
    const valueInUSDFromWei = web3.utils.fromWei(String(valueInUSD))

    data.push({
      address:allTokenAddresses[i],
      balance,
      valueInUSD,
      valueInUSDFromWei
    })
  }

  const fundProfit = await fund.methods.calculateFundProfit().call()
  const fundProfitFromWei = web3.utils.fromWei(String(fundProfit))
  const fundValue = await fund.methods.calculateFundValue().call()
  const fundValueFromWei = web3.utils.fromWei(String(fundValue))
  const totalWeiDeposited = await fund.methods.totalWeiDeposited().call()
  const totalWeiWithdrawn = await fund.methods.totalWeiWithdrawn().call()

  return {
    date:Number(Date.now() / 1000).toFixed(),
    tokens:data,
    fundProfit,
    fundProfitFromWei,
    fundValue,
    fundValueFromWei,
    totalWeiDeposited,
    totalWeiWithdrawn
  }
}


async function getValueFromRouter(address, amount) {
  if(amount <= 0)
    return 0

  if(String(address).toLowerCase() === String(config.USDADDRESS).toLowerCase())
     return amount

  try{
    const router = new web3.eth.Contract(abi.ROUTER_ABI, config.UNIROUTER)
    const from = String(address).toLowerCase() === String(config.ETH).toLowerCase()
    ? config.WETH
    : address

    const result = await router.methods.getAmountsOut(amount, [from, config.USDADDRESS]).call()
    return result[1]
  }
  catch(e){
    // console.log("err")
    return 0
  }
}
