const express = require('express');

const{ body } = require('express-validator');

const notesController = require('../controllers/notes');
const isAuth = require('../middleware/is-auth');



const router = express.Router();


router.get('/notes', isAuth,  notesController.getNotes);



router.post(
    '/Newnote',
    isAuth,
    [
    body('content')
    .trim()
    .isLength({min: 2}),



], notesController.createNote

);


router.get('/note/:noteId', isAuth,  notesController.getNote);

router.put(
'/note/:noteId',
 isAuth,
 [
    body('content')
    .trim()
    .isLength({min: 2})
 ],

 notesController.updateNote);

router.delete('/note/:noteId' ,isAuth, notesController.deleteNote);


module.exports = router;