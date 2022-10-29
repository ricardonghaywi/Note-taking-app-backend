const Note = require('../models/note');



exports.byCategory = (req,res,next) => {

// enter the id of the category to filter notes
const category = req.body.category;

Note.find({creator: req.userId, category: category}) 

.then(notes => {
    res
    .status(200)
    .json({message: 'notes with this category have been fetched. ', notes: notes});
})
.catch(err => {
    if(!err.statusCode) {
        err.statusCode = 500;
    }

    next(err);
});


};





exports.byTag = (req,res,next) => {

//enter the tag to search the notes accordingly

const tag = req.body.tag;

Note.find({creator: req.userId , tags: tag })
    .then(notes => {
        res
        .status(200)
        .json({message:'notes with this tag have been fetched. ', notes: notes});
    })

    .catch(err => {

        if(!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);

    });

};





exports.byUpdateDate = (req,res,next) => {

    Note.find({creator: req.userId}).sort({updatedAt: -1})
    .then(notes => {
        res.
        status(200)
        .json({message: 'notes have been sorted by update date. ', notes: notes});



    })
    .catch(err => {

        if(!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);

    });
};












