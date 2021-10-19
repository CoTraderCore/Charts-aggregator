const express = require('express')
// const api = require('./api')

const router = express.Router()

router.get('/', function(req, res) {
    res.json({ message: 'API is Online!' })
})

// router.route('/smartfunds/').get(async (req, res) => {
//   const result = await api.getSmartFundsList()
//   res.json({ result })
// })
//
// router.route('/smartfund/:address').get(async (req, res) => {
//   const result = await api.getSmartFund(req.params.address)
//   res.json({ result })
// })

module.exports = router
