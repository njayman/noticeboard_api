const express = require('express')
const router = express.Router()

const { createAdmin, createBoard, createOrg } = require('../controllers/masterController');

router.post('/createOrg', createOrg)
router.post('/createAdmin/:id', createAdmin)
router.post('/createBoard/:id', createBoard)

module.exports = router;