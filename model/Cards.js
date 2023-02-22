const { default: mongoose } = require("mongoose")
const Double = require('@mongoosejs/double');
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
        default:0
    },
    validyr:{
        type:Number,
        default:0
    },
    cvv:{
        type:Number,
        default:0
    },
    company:{
        type:String,
        required:true,
        default:0
    },
    amount:{
        type:Double,
        default:0
    }
},{timestamps:true});

module.exports=mongoose.model('Cards',Cards);