const User = require("../model/User");
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const Transactions = require("../model/Transactions");

exports.checkServer=(req,res)=>{
    res.send('Hello World!')
}

exports.signUp=(req,res)=>{
    if(req.body.email==null||req.body.email==""){
        return res.status(400).json({
            "message":"Email missing"
        });
    }
    else if(req.body.full_name==null||req.body.full_name==""){
        return res.status(400).json({
            "message":"Name missing"
        });
    }
    else if(req.body.password==null||req.body.password==""){
        return res.status(400).json({
            "message":"Password missing"
        });
    }
    else{
        
        User.findOne({email:req.body.email},(err,prof)=>{
            if(prof)
            {
                return res.status(400).json({
                    "message":"Email already Used"
                });
            }
            else{
                const hash_pss=bcrypt.hashSync(req.body.password,10);
                User.create({
                    full_name:req.body.full_name,
                    email:req.body.email,
                    password:hash_pss,
                },(err,prof)=>{
                    if(prof){
                        res.status(200).json({
                            "message":"User Created",
                            "id":prof._id,
                            "email":prof.email,
                            "full_name":prof.full_name,
                            "balance":prof.balance,
                            "profile_img":prof.profile_img
                        });
                    }
                });
            }
        });
    }
}


exports.login=(req,res)=>{
    if(req.body.email==null||req.body.email==""){
        return res.status(400).json({
            "message":"Email missing"
        });
    }
    else if(req.body.password==null||req.body.password==""){
        return res.status(400).json({
            "message":"Password missing"
        });
    }
    else{
        User.findOne({email:req.body.email},(err,prof)=>{
            if(prof)
            {
                if(bcrypt.compareSync(req.body.password,prof.password)){
                    res.status(200).json({
                        "message":"Logged In",
                        "email":prof.email,
                        "id":prof._id,
                        "full_name":prof.full_name,
                        "balance":prof.balance,
                        "profile_img":prof.profile_img
                    });
                }
                else{
                    return res.status(400).json({
                        "message":"Invalid credentials"
                    });
                }
            }
            if(prof==null){
                return res.status(400).json({
                    "message":"User does not exist"
                });
            }
        });
    }
}

exports.addCredit=(req,res)=>{
    if(req.body.userId==null||req.body.userId==""){
        return res.status(400).json({
            "message":"UserId missing"
        });
    }
    else if(req.body.amount==null||req.body.amount==""){
        return res.status(400).json({
            "message":"Amount missing"
        });
    }
    else{
        User.findById(req.body.userId,(err,usr)=>{
            if(usr){
                User.findByIdAndUpdate(req.body.userId,{balance:usr.balance+parseInt(req.body.amount)},{returnOriginal:false},(err,usr)=>{
                });
            }
        });
        Transactions.create({
            userId:req.body.userId,
            type:"Credit",
            description:req.body.desc,
            amount:parseInt(req.body.amount)
        },(err,usr)=>{
            if(usr){
                return res.status(200).json({
                    "message":"Added Successfully"
                });
            }
        })
    }
}

exports.addDebit=(req,res)=>{
    if(req.body.userId==null||req.body.userId==""){
        return res.status(400).json({
            "message":"UserId missing"
        });
    }
    else if(req.body.amount==null||req.body.amount==""){
        return res.status(400).json({
            "message":"Amount missing"
        });
    }
    else{
        User.findById(req.body.userId,(err,usr)=>{
            if(usr){
                User.findByIdAndUpdate(req.body.userId,{balance:usr.balance-parseInt(req.body.amount)},{returnOriginal:false},(err,usr)=>{
                });
            }
        });
        Transactions.create({
            userId:req.body.userId,
            type:"Debit",
            description:req.body.desc,
            amount:parseInt(req.body.amount)
        },(err,usr)=>{
            if(usr){
                return res.status(200).json({
                    "message":"Added Successfully"
                });
            }
        })
    }
}


exports.delItem=(req,res)=>{
    if(req.body.id==null||req.body.id==""){
        return res.status(400).json({
            "message":"Id missing"
        });
    }
    else{
        Transactions.findById(req.body.id,(err,usr)=>{
            if(usr){
                User.findById(usr.userId,(err,user)=>{
                    if(user){
                        if(usr.type=="Debit")
                        User.findByIdAndUpdate(usr.userId,{balance:user.balance+parseInt(usr.amount)},{returnOriginal:false},(err,usr)=>{
                        });
                        else
                        User.findByIdAndUpdate(usr.userId,{balance:user.balance-parseInt(usr.amount)},{returnOriginal:false},(err,usr)=>{
                        });
                    }
                });

                Transactions.remove(usr,(err,usr)=>{

                });
                return res.status(200).json({
                    "message":"Deleted Succesfully"
                })
            }
        })
    }
}

exports.getAll=(req,res)=>{
    if(req.body.userId==null||req.body.userId==""){
        return res.status(400).json({
            "message":"UserId missing"
        });
    }
    else{
        const date = new Date()
        var firstday=new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay=new Date(date.getFullYear(), date.getMonth()+1, 0);
        Transactions.find({userId:req.body.userId,createdAt:{$gt:firstday,$lt:lastDay}},(err,usr)=>{
            User.findById(req.body.userId,(err,user)=>{
                return res.status(200).json({
                    "balance":user.balance,
                    "data":usr
                })
            });
        });
    }
}

exports.getUsrData=(req,res)=>{
    if(req.body.id==null||req.body.id==""){
        return res.status(400).json({
            "message":"User-Id missing"
        });
    }
    else{
        User.findById(req.body.id,(err,usr)=>{
            return res.status(200).json({
                "data":usr
            })
        });
    }
}

exports.getMonthData=(req,res)=>{
    if(req.body.id==null||req.body.id==""){
        return res.status(400).json({
            "message":"User-Id missing"
        });
    }
    else{
        Transactions.find({userId:req.body.id},(err,usr)=>{
            const date=new Date();
            var body={};
            var firstmonth=new Date(usr[0].createdAt);
            const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
            body[monthNames[firstmonth.getMonth()]]=[]
            usr.forEach((value)=>{
                var firstday=new Date(date.getFullYear(), firstmonth.getMonth(), 1);
                var lastDay=new Date(date.getFullYear(), firstmonth.getMonth()+1, 0);
                var nm=monthNames[firstmonth.getMonth()]
                if(value.createdAt>=firstday&&value.createdAt<=lastDay){
                    body[nm].push(value);
                }
                else if(value.createdAt>lastDay){
                    firstmonth=new Date(value.createdAt);
                    body[monthNames[firstmonth.getMonth()]]=[]
                    body[monthNames[firstmonth.getMonth()]].push(value)
                }
            })

            return res.status(200).json({
                'data':body
            })
        });
        
        /*console.log(firstday)
        Transactions.find({createdAt:{$gt:firstday,$lt:lastDay}},(err,usr)=>{
            return res.status(200).json({
                "data":usr
            })
        });*/
    }
}