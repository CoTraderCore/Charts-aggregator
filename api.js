const mysql = require('./mysql')


exports.getAllFunds = async function () {
 const result = await mysql.getAllFunds()
 return result
}

exports.getFund = async function (address) {
  const result = await mysql.getFund(address)
  return result
}
