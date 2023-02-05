const Transactions = require("../model/Transactions");
const Cards = require("../model/Cards");
const Share = require("../model/Share");
const ShareList = require("../model/ShareList");

exports.checkServer=(req,res)=>{
    res.send('Hey Buddy working great')
}
exports.addCredit=(req,res)=>{
    Transactions.create({
        userId:req.body.userId,
        type:"C",
        category:req.body.category,
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

exports.addDebit=(req,res)=>{
    Transactions.create({
        userId:req.body.userId,
        type:"D",
        category:req.body.category,
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


exports.delItem=(req,res)=>{
    Transactions.deleteOne(req.body.id,(err,usr)=>{
        if(err){
            return res.status(404).json({"message":'error'});
        }
        return res.status(200).json({"message":'done'});
    })
}

exports.getAll=(req,res)=>{
    Transactions.find({userId:req.body.userId},(err,usr)=>{
        return res.status(200).json({
            "data":usr
        })
    });
}


exports.getMonthData=(req,res)=>{
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
}


exports.addCard=(req,res)=>{
    Cards.create({
        userId:req.body.userId,
        cardtype:req.body.cardType,
        uin:req.body.uin,
        validmonth:req.body.validmonth,
        validyr:req.body.validyr,
        cvv:req.body.cvv,
        amount:parseInt(req.body.amount)
    },(err,usr)=>{
        if(err){
            return res.status(404).json({"message":'error'});
        }
        return res.status(404).json({"message":'done'});
    });
}
exports.delCard=(req,res)=>{
    Cards.delItem({
        uin:req.body.uin
    },(err,usr)=>{
        if(err){
            return res.status(404).json({"message":'error'});
        }
        return res.status(404).json({"message":'done'});
    });
}

exports.addSharetoWatch=async (req,res)=>{
    const axios = require("axios");
    const url = `https://www.google.com/search?q=${req.body.uin}+share+price`;
    const jsdom = require("jsdom");
    
    const { JSDOM } = jsdom;
    try {
      const { data } = await axios.get(url);
      const dom = new JSDOM(data);
      const d=dom.window.document.querySelector('.BNeawe .iBp4i').textContent.replace(',','').split(' ')
      
      
      console.log(`--------------------------------`)
      console.log(`New added : ${req.body.uin}  ${parseFloat(d[0])}`)
      console.log(`--------------------------------`)

      
      ShareList.create({uin:req.body.uin,price:parseFloat(d[0])},(err,usr)=>{
      })

      const fs=require('fs')
      
      fs.appendFile('./WatchList/watchlist.log', `\r\n${req.body.uin}`, err => {
        if (err) {
            return res.status(404).json({'message':'error'});
        }
        return res.status(200).json({'message':'added'});
      });


    }  catch (err) {
        if (e instanceof TypeError) {
            // statements to handle TypeError exceptions
            return res.status(404).json({'message':'error'});
          }
    }
}