const { validationResult } = require('express-validator');


const Category = require('../models/category');
const Note = require('../models/note');





exports.updateCategory = (req,res,next) => {

    const categoryId = req.params.categoryId;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const error = new Error('title should be at least 2 characters . ');
        error.statusCode = 422;
        throw error;
    }


    const title = req.body.title;

    Category.findById(categoryId)
    .then(category => {
        if(!category) {
            const error = new Error('could not find category. ');
            error.statusCode = 404;
            throw error;
        }
    
        if (category.creator.toString() !== req.userId) {
            
            const error = new Error('not authorized. ');
            error.statusCode = 403;
            throw error;
    
        }

        category.title = title;
        return category.save();

    })

    .then(result => {
        res.status(200).json({message: 'category has been updated' , category: result});
    })
    .catch(err => {

        if(!err.statusCode) {
            err.statusCode = 500;
        }
        
        next(err);
        
        })

};




exports.createCategory = (req,res,next) => { 

  const errors = validationResult(req);
  if(!errors.isEmpty()) {
       const error = new Error('invalid input. ');
       error.statusCode = 422;
       throw error;
   
   }


     const title = req.body.title;
     let creator;


   const category = new Category({

    title: title,
    creator: req.userId
    

   });

category
.save()
.then(result => {
    res.status(201).json({
       message: 'category created successfully. ',
        category: category,
        
       
});
})

.catch(err => {

    if(!err.statusCode) {
        err.statusCode = 500;
    }
    
    next(err);
    
    })

};



exports.getCategories = (req,res,next) => {

    Category.find({creator: req.userId})
    .then(categories => {
        res
        .status(200)
        .json({message: 'categories of this user have been successfully fetched. ', categories: categories});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    });
};





exports.deleteCategory = (req,res,next) => {

    const categoryId = req.params.categoryId;

    Category.findById(categoryId)
    .then( category => {
        if(!category) {
            const error = new Error('could not find category. ');
            error.statusCode = 404;
            throw error;
        }

        if (category.creator.toString() !== req.userId) {
        
            const error = new Error('not authorized. ');
            error.statusCode = 403;
            throw error;
    
        }

        return Category.findByIdAndRemove(categoryId);
    })

    .then(result =>{

        return Note.deleteMany({category: categoryId});



    })

    .then(result => {
        res.status(200).json({message: 'category has been deleted with all its notes. ' });
    })

    .catch(err => {

        if(!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
 });


};


