const { default: mongoose} = require("mongoose")
const Double = require('@mongoosejs/double');


const Transactions=mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    amount:{
        type: Double,
        required:true,
    }
},{timestamps:true});

module.exports=mongoose.model('Transactions',Transactions);