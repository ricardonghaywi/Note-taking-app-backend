const express = require('express');

const{ body } = require('express-validator');

 categoriesController = require('../controllers/categories');


const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/categories' , isAuth,  categoriesController.getCategories);


router.put(
    '/category/:categoryId',
    isAuth,
    [
        body('title')
        .trim()
        .isLength({min: 2})
    ],

    categoriesController.updateCategory

);


router.post(
    '/Newcategory',
    isAuth,
    [
   body('title')
    .trim()
   .isLength({min: 2}),
],
categoriesController.createCategory
);

router.delete('/category/:categoryId' , isAuth, categoriesController.deleteCategory );


module.exports = router;







