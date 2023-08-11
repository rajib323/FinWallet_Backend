const { default: mongoose } = require("mongoose")
const Double = require('@mongoosejs/double');
const ShareList=mongoose.Schema({
    uin:{
        type:String,
        required:true,
        unique:true
    }
},{timestamps:true});

module.exports=mongoose.model('ShareList',ShareList);