const express = require('express');

const filteringController = require('../controllers/filtering');


const isAuth = require('../middleware/is-auth');



const router = express.Router();


router.get('/Tag', isAuth, filteringController.byTag );

router.get('/category' , isAuth,  filteringController.byCategory );

router.get('/UpdateDate' , isAuth,  filteringController.byUpdateDate);

module.exports = router;







