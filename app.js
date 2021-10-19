const getCurrentBalance = require('./utills/getCurrentBalance')

const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
const FUND_ADDRESS = "0xc3c41FD78d7C579C9cCd008B9dBCe55ba4CE337C"


async function app(){
  console.log(await getCurrentBalance(FUND_ADDRESS))
}

app()
