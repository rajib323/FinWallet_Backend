const { default: mongoose } = require("mongoose")
const Double = require('@mongoosejs/double');
const ToDoList=mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    isDone:{
        type:Boolean,
        default:false
    },
    progress:{
        type:Double,
        default:0.0,
        required:true
    },
},{timestamps:true});

module.exports=mongoose.model('ToDOLIst',ToDoList);