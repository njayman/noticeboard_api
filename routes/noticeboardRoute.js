const express = require('express')
const router = express.Router();
const { checkNotice, confirmUpdate } = require('../controllers/noticeController')

router.post('/checknotice/:id', checkNotice)
router.post('/confirmUpdate/:id', confirmUpdate)

module.exports = router;