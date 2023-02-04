const { default: mongoose } = require("mongoose");
const ShareList=mongoose.Schema({
    uin:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    }
},{timestamps:true});

module.exports=mongoose.model('ShareList',ShareList);