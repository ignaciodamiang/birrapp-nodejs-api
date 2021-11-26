'use strict';
require('dotenv').config();
const Producto = require('@models/producto');
const fs = require('fs');
const UPLOAD_FOLDER = process.env.UPLOAD_FILE_FOLDER;
const UPLOAD_TYPES = process.env.UPLOAD_FILE_TYPES.split(',');
const UPLOAD_EXTENSION_TYPES = process.env.UPLOAD_FILE_EXTENSION_TYPES;
const UPLOAD_FILE_TYPES = UPLOAD_EXTENSION_TYPES ? UPLOAD_EXTENSION_TYPES.split(',') : ['jpg', 'png', 'svg', 'jpeg'];
const mongoose = require('mongoose');

function returnStatus(res, statusCode, message) {
    console.log('returnStatus');
    return res.status(statusCode).json({
        errorCode: statusCode,
        userMessage: message
    });
}

function checkIfExistsFile(req, res, next) {
    console.log('checkIfExistsFile');
    //console.log(req);
    console.log('req.files');
    if (Object.keys(req.files).length === 0) {
        return returnStatus(res, 400, 'missing_file');
    }
    return next();
}

function checkTypeFile(req, res, next) {
    console.log('checkTypeFile');
    const fileName = req.files.file.name;
    const typeFile = fileName.split('.')[1];
    console.log(fileName);
    console.log(typeFile);
    console.log(UPLOAD_FILE_TYPES.includes(typeFile));
    if (!UPLOAD_FILE_TYPES.includes(typeFile)) {
        return returnStatus(res, 400, 'invalid_file');
    }
    req.body.file = {
        name: fileName,
        type: typeFile,
        size: 'small',
        path: ''
    };
    return next();
}

function checkDataBody(req, res, next) {
    console.log('checkDataBody');
    console.log(req.body.type);
    console.log(UPLOAD_TYPES.includes(req.body.type));
    if (!req.body.type || !UPLOAD_TYPES.includes(req.body.type)) {
        return returnStatus(res, 400, 'invalid_type');
    }
    if (req.body._id && !mongoose.isValidObjectId(req.body._id)) {
        return returnStatus(res, 400, 'invalid_id');
    }
    return next();
}

function copyFile(req, res, next) {
    console.log('copyFile');
    const {type, _id, file} = req.body;
    let random = Math.random().toString(36).substring(7);
    const idOrRandom = _id ? _id : random;
    // FolderImages + FolderType + Name(idOrRandom + Type + randomString + . + FileType)
    const path = `${UPLOAD_FOLDER}${type}/${idOrRandom}-${type}-${random}.${file.type}`;
    const pathTmp = req.files.file.path;

    return fs.copyFile(pathTmp, path, (err) => {
        if (err) {
            console.error(`UPLOAD-FILE - COPY ERROR ${err.message}`);
            return returnStatus(res, 500, 'internal_error');
        }
        req.body.file.path = path;
        return next();
    });
}

function removeFile(file, res) {
    console.log('removeFile');
    return fs.unlink(file.path, () => {
        
        return returnStatus(res, 500, 'internal_error');

    });
}

function getModelByType(type) {
    console.log('getModelByType');
    switch (type) {
    case 'restaurant':
        return Restaurant;
    default:
        return Product;
    }
}

module.exports = {
    copyFile,
    checkDataBody,
    checkIfExistsFile,
    checkTypeFile,
    getModelByType,
    removeFile
};
