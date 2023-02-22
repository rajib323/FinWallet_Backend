const { default: mongoose } = require("mongoose");
const ShareList=mongoose.Schema({
    uin:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Double,
        required:true
    },
},{timestamps:true});

module.exports=mongoose.model('ShareList',ShareList);