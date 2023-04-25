const { default: mongoose } = require("mongoose")
const crypto =require('crypto')
const userModel=mongoose.Schema({
    
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
},{timestamps:true});


userModel.methods.setPassword = function (password) {
 
    // Creating a unique salt for a particular user
    this.salt = 'finwalletbackend';
 
    // Hashing user's salt and password with 1000 iterations,
    //64 length and sha512 digest
    this.hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
    return this.hash;
};
userModel.methods.validPassword = function (password,originalPassword) {
    var hash = crypto.pbkdf2Sync(password,
        'finwalletbackend', 1000, 64, `sha512`).toString(`hex`);
    return originalPassword === hash;
};


module.exports=mongoose.model('UserModel',userModel);