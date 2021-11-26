'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
    name: String,
    type: String,
    path: {
        type: String,
        unique: true
    },
    size: {
        type: 'String',
        enum: ['small', 'medium', 'large']
    }
},
{
    timestamps: true
});

fileSchema.pre('save', function(next) {
    const file = this;
    if (file.isModified('path')) {
        file.path = file.path.replace('/public', '');
    }
    return next();
});

module.exports = mongoose.model('File', fileSchema);
