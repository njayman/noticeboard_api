const express = require('express')
const router = express.Router();
const { adminRegister, adminLogin, adminUploads, addmaterial, getmaterials, getmaterial, addnotice, getnotices } = require('../controllers/adminController')
const multerUploads = require('../middlewares/multerUpload')
router.post('/register', adminRegister)
router.post('/login', adminLogin)
router.post('/upload', multerUploads, adminUploads)
router.post('/addmaterial', addmaterial)
router.post('/addnotice/:id', addnotice)

router.get('/getmaterials', getmaterials)
router.get('/getmaterial/:id', getmaterial)
router.get('/getnotices', getnotices)
module.exports = router;