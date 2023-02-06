const { default: mongoose } = require("mongoose");
const BitCoin=mongoose.Schema({
    symbol:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    name_full:{
        type:String,
        required:true,
    },
    maxsupply:{
        type:String,
        required:true,
    },
    iconurl:{
        required:true,
        type:String
    },
    price:{
        type:Number,
        required:true,
        default:0
    }
},{timestamps:true});

module.exports=mongoose.model('BitCoin',BitCoin);