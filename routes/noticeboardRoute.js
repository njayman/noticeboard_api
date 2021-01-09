const express = require('express')
const router = express.Router();
const { checkNotice, confirmUpdate } = require('../controllers/noticeController')
router.post('/checknotice/:id', checkNotice)
router.post('/confirmUpdate/:id', confirmUpdate)
router.get('/update', (req, res) => {
    try {
        res.json('ok')
    } catch (error) {
        res.json(error.message)
    }
})
module.exports = router;