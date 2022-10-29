const { validationResult } = require('express-validator');

const Note = require('../models/note');
const User = require('../models/user');
const Category = require('../models/category');



exports.getNotes =  (req,res,next) => {

    
    Note.find({creator: req.userId})
    .then(notes => {
        res
        .status(200)
        .json({message: 'notes of this user have been successfully fetched. ', notes: notes});
    })
    .catch(err => {
        if(!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    });

};


exports.createNote = (req,res,next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('invalid input. ');
        error.statusCode = 422;
        throw error;
    
    }

    

    
    const content = req.body.content;
    const tags = req.body.tags;
    //user needs to enter an existing category
    const category = req.body.category;
    
    let creator;


    
    const note = new Note({
       
        
        content: content,
        tags: tags,
        category: category,
        

        creator: req.userId

    });

    note
    .save()
    .then(result =>{
        return User.findById(req.userId);
    })
    .then(user => {
        creator = user;
        user.notes.push(note);
        return user.save();
        
    })

    .then(result => {
        
        return Category.findById(req.body.category);
           
    })
    
    .then(category => {
        if(category && category.creator == req.userId) {
           

        category.notes.push(note);
        return category.save();
        }
    })



    .then(result => {
        res.status(201).json({
            message: 'Note created successfully',
            note: note
            
           
        });

    })
    
    .catch(err => {
        if(!err.statusCode) {

            err.status.Code = 500;

        }

        next(err);
      
    });

};

exports.getNote = (req,res,next) => {

    const noteId = req.params.noteId;
    Note.findById(noteId)
    .then(note => {
        if(!note) {
            const error = new Error('could not find note. ');
            error.statusCode = 404;
            throw error;

        }

        if (note.creator.toString() !== req.userId) {
        
            const error = new Error('not authorized. ');
            error.statusCode = 403;
            throw error;
    
        }





        res.status(200).json({ message: 'note fetched. ', note: note})
    })
    .catch(err =>{

        if(!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
    });


};


exports.updateNote = (req,res,next) => {

const noteId = req.params.noteId;
const errors = validationResult(req);

if(!errors.isEmpty()){
    const error = new Error('invalid data. ');
    error.statusCode = 422;
    throw error;
}
const content = req.body.content;
const tags = req.body.tags;
const category = req.body.category;


Note.findById(noteId)
.then(note => {
    if(!note) {
        const error = new Error('could not find note. ');
        error.statusCode = 404;
        throw error;
    }

    if (note.creator.toString() !== req.userId) {
        
        const error = new Error('not authorized. ');
        error.statusCode = 403;
        throw error;

    }

    note.content = content;
    note.tags = tags;
    note.category = category;
    return note.save();
})
.then(result => {
    res.status(200).json({message: 'note has been updated' , note: result});
})

.catch(err => {

if(!err.statusCode) {
    err.statusCode = 500;
}

next(err);

})



};


exports.deleteNote = (req, res, next) => {

    const noteId = req.params.noteId;

    Note.findById(noteId)
    .then( note => {
        if(!note) {
            const error = new Error('could not find note. ');
            error.statusCode = 404;
            throw error;
        }

        if (note.creator.toString() !== req.userId) {
        
            const error = new Error('not authorized. ');
            error.statusCode = 403;
            throw error;
    
        }
        

        return Note.findByIdAndRemove(noteId);

        
    })

    .then(result => {
        return User.findById(req.userId);

        
    })
    .then(user => {

        user.notes.pull(noteId);
        return user.save();
        
    })
    .then(result => {
        res.status(200).json({message: 'note has been deleted. ' });
    })

    .catch(err => {

        if(!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
 });
};



