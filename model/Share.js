const { default: mongoose } = require("mongoose")
const Double = require('@mongoosejs/double');
const Share=mongoose.Schema({
    userid:{
        type:String,
        required:true,
    },
    uin:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true
    },
    oldprice:{
        type:Double,
        required:true,
        default:0
    },
    newprice:{
        type:Double,
        required:true,
        default:0
    }
},{timestamps:true});

module.exports=mongoose.model('Share',Share);