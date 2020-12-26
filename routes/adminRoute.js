const express = require('express')
const router = express.Router();
const { adminRegister, adminLogin, adminUploads, addmaterial, getmaterials } = require('../controllers/adminController')
const multerUploads = require('../middlewares/multerUpload')
router.post('/register', adminRegister)
router.post('/login', adminLogin)
router.post('/upload', multerUploads, adminUploads)
router.post('/addmaterial', addmaterial)

router.get('/getmaterials', getmaterials)

module.exports = router;