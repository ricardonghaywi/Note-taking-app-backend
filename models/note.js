const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema ({

    category: {

    
     type: Schema.Types.ObjectId,
     ref:'Category',
     

    },
    
    content: {
        type: String,
        required: true

    },

    tags: [
        {
            type: String,
            required: true
        }
    ],


    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

},

 {timestamps: true}

);


module.exports = mongoose.model('Note', noteSchema);