const { default: mongoose } = require("mongoose");
const Share=mongoose.Schema({
    uin:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    }
},{timestamps:true});

module.exports=mongoose.model('Share',Share);