const Transactions = require("../model/Transactions");
const Cards = require("../model/Cards");
const Share = require("../model/Share");
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const BitCoin=require('../model/BitCoin')
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

exports.getAllTrans=(req,res)=>{
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

      
      ShareList.create({uin:req.body.uin,price:parseFloat(d[0])},(err,usr)=>{
        if(usr){
            console.log(`--------------------------------`)
            console.log(`New added : ${req.body.uin}  ${parseFloat(d[0])}`)
            console.log(`--------------------------------`)
            return res.status(200).json({'message':'added'});
        }
        if(err){
            return res.status(404).json({'message':err});
        }
      })

    }  catch (err) {
        if (e instanceof TypeError) {
            // statements to handle TypeError exceptions
            return res.status(404).json({'message':'error'});
          }
    }
}


exports.getBTCDATA=async (req,res)=>{
    req.body.crypto.forEach(async(e)=>{
        var res=await axios.get(`http://api.coinlayer.com/live?access_key=fb8757651eb1ffb522235b6d346a2675&symbols=${e.symbol}`)
        var resData=JSON.parse(JSON.stringify(res.data))
        var price=parseFloat(JSON.stringify(resData.rates).replace('{','').replace('}','').split(':')[1])
        BitCoin.create({
            'symbol':e.symbol,
            'name':e.name,
            'name_full':e.name_full,
            'maxsupply':e.symbol,
            'iconurl':e.icon_url,
            'price':price

        },(err,usr)=>{
            console.log(e)
        });
    })
    return res.status(200).json({"message":"added"});
}


exports.getAllBTCDATA=async (req,res)=>{
    BitCoin.find({},(err,usr)=>{
        return res.status(200).json(
            {
                "data":usr
            }
        )
    })
}


exports.saveLiveData=async (req,resp)=>{
    
    BitCoin.find({},(err,usr)=>{
        if(usr){

            usr.forEach(async function(user) {
                var res=await axios.get(`http://api.coinlayer.com/live?access_key=fb8757651eb1ffb522235b6d346a2675&symbols=${user.symbol}`)
                var resData=JSON.parse(JSON.stringify(res.data))
                var price=parseFloat(JSON.stringify(resData.rates).replace('{','').replace('}','').split(':')[1])

                BitCoin.updateOne({_id:user._id},{price:price},{returnOriginal:false},(err,usr)=>{
                    if(err){
                        return resp.status(404).json({"message":err});
                    }
                })
            });
            //BitCoin.updateOne({})
        }
    })

    return resp.status(200).json({"message":"updated"});
    
}


exports.sharevalueupdate=(req,res)=>{
    console.log(`--------------------------------`)
    ShareList.find({},(err,usr)=>{
        if(usr){
        var usrmap={}
        usr.forEach(async function(user) {
            try{
                const url = `https://www.google.com/search?q=${user.uin}+share+price`;
            
                const { data } = await axios.get(url);
                const dom = new JSDOM(data);



                var d=dom.window.document.querySelector('.BNeawe .iBp4i').textContent.replace(',','').split(' ')
                
                console.log(`${user.uin}  ${d[0]}`)
                

                ShareList.updateOne({uin:user.uin},{price:parseFloat(d[0])},{returnOriginal:false},(err,usr)=>{
                    if(err){
                        return res.status(404).json({"message":err});
                    }
                })
            }catch (err){
                if(err)
                return res.status(404).json({"message":err});
            }
        });
        
        
        }
        console.log(`--------------------------------`)
        return res.status(200).json({"message":"updated"});
    })
    
}


exports.getAllCard=(req,res)=>{
    Cards.find({userId:req.body.userId},(err,usr)=>{
        return res.status(200).json({
            "data":usr
        })
    });
}


exports.getAllShare=(req,res)=>{
    Share.find({userId:req.body.userId},(err,usr)=>{
        return res.status(200).json({
            "data":usr
        })
    });
}