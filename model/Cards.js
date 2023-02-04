const { default: mongoose } = require("mongoose");
const Cards=mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    
    cardtype:{
        type:String,
        required:true
    },
    uin:{
        type:Number,
        unique:true,
        required:true,
    },
    validmonth:{
        type:Number,
        required:true
    },
    validyr:{
        type:Number,
        required:true
    },
    cvv:{
        type:Number,
        required:true
    },
    amount:{
        type:Number,
    }
},{timestamps:true});

module.exports=mongoose.model('Cards',Cards);