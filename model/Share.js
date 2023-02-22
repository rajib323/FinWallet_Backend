const { default: mongoose } = require("mongoose");
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
    price:{
        type:Double,
        required:true,
        default:0
    }
},{timestamps:true});

module.exports=mongoose.model('Share',Share);