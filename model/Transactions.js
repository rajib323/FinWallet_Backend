const { default: mongoose } = require("mongoose");
const Transactions=mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    amount:{
        type:Number,
        required:true,
    }
},{timestamps:true});

module.exports=mongoose.model('Transactions',Transactions);