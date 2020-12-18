const resUtil = require('../module/responseUtil');
const resMsg = require('../module/resMsg');
const statCode = require('../module/statusCode');
const encrypt = require('../module/encryption')
const jwt = require('../module/jwt');
var moment = require('moment');
const models = require('../models');


module.exports = {
  addItem: async (req, res) => {
    const { body, files } = req
    console.log('addItem')
    console.log(body.formData._parts)
    console.log(files)
  },
  getItem: async (req, res) => {
    console.log("getItem")
    res.json({ "hi": "test" })
  }
}