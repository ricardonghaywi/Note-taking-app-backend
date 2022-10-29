const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema ({

   title: {
        type: String,
        required: true
    },


    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note'

     }
    ],

   creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }



    
});

module.exports = mongoose.model('Category', categorySchema);