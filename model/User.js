const { default: mongoose } = require("mongoose");

const User=new mongoose.Schema({
    full_name:{
        required:true,
        type:String
    },
    email:{
        type:String,
        required:true,
    },
    balance:{
        type:Number,
        default:0
    },
    password:{
        type:String,
        required:true,
    },
    profile_img:{
        type:String,
        default:"default"
    }
},{timestamps:true});

module.exports=mongoose.model('UserDatabase',User);