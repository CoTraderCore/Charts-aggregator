const mysql = require('mysql')
const _ = require('lodash')
const util = require('util')
require('dotenv').config()

const connection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_NAME
});

connection.connect((err) => {
    if (err) throw err;
});

const query = util.promisify(connection.query).bind(connection);

exports.getAllFunds = async () => {
  const q = "SELECT * FROM list"
  try {
    const rows = await query(q)
    return rows
  } catch(err) {
    throw err
  }
}

exports.getFund = async (address) => {
  const q = "SELECT * FROM list WHERE address = ?"
  try {
    const rows = await query(q, address)
    return rows[0]
  } catch(err) {
    throw err
  }
}

exports.insertFund = async (
  address,
  balance) => {
  const q = `INSERT IGNORE INTO funds (
    address,
    balance) VALUES (?)`
  const values = [
    address,
    JSON.stringify(balance)]
  try {
    await query(q, [values])
    return "Ok"
  } catch(err) {
    throw err
  }
}

// Update single column for a certain address
exports.updateFundValue = async (columnName, value, address, jsonTrue) => {
  const q = "UPDATE list SET " + columnName + " = ? WHERE address = ?"
  let _value = value
  if(jsonTrue){
    _value = JSON.stringify(value)
  }
  try {
    await query(q, [_value, address])
    return "Ok"
  } catch(err) {
    throw err
  }
}
