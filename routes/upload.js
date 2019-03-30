const express = require('express');

const router = express.Router();
const upload = require('../middleware/upload');
const uploadController = require('../controllers/upload');

router.post('/', upload.single('image'), uploadController.post);

module.exports = router;
