const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');

const sendgridTransport = require('nodemailer-sendgrid-transport');



const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({

    auth: {
       api_key: ''
    }

}));



exports.signup = (req,res,next) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = new Error('validation failed. ');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const password = req.body.password;
    bcrypt
    .hash(password, 12)
    .then(hashedPw => {
        const user = new User({
            email: email,
            password: hashedPw


        });

        return user.save();
    })
      
    .then(result => {

        res.status(201).json({message: 'user has been created. ', userId: result._id});
          transporter.sendMail({
            to: email,
            from: '',
            subject: 'account created!',
            html: '<h1>welcome to note app!</h1>' 
           });
    })

        .catch(err => {

        if(!err.statusCode) {
            err.statusCode = 500;
        }

        next(err);
        

    });

};

exports.login = (req,res,next) => {

    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;

    User.findOne({email: email})
    .then(user => {

        if(!user) {
            const error = new Error('user with this email could not be found. ');
            error.statusCode = 401;
            throw error;
        }

        loadedUser = user;
        return bcrypt.compare(password, user.password);

    })
    .then(isEqual => {
        if(!isEqual) {
            const error = new Error('wrong password. ');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({
            email: loadedUser.email, 
            userId: loadedUser._id.toString()
        }, 
        'secret-token', 
        {expiresIn: '1h'}

        );
    
        res.status(200).json({token: token, userId: loadedUser._id.toString() });

})

    .catch(err => {

        if(!err.statusCode) {

            err.statusCode = 500;
        }

        next(err);


    });



};