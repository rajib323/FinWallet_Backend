const Transactions = require("../model/Transactions");
const Cards = require("../model/Cards");
const Share = require("../model/Share");
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const BitCoin=require('../model/BitCoin')
const ShareList = require("../model/ShareList");


const fs=require('fs')

exports.getNews=(req,res)=>{
    fs.readFile('./data/newsdata.json','utf-8',(err,data)=>{
        
        return res.status(200).json(JSON.parse(data));
    });
    

}
//Transactions
exports.addCredit=(req,res)=>{
    console.log(req.body)
    Transactions.create({
        userId:req.body.userId,
        type:"C",
        category:req.body.category,
        description:req.body.desc,
        amount:req.body.amount
    },(err,usr)=>{
        if(usr){
            return res.status(200).json({
                "message":"Added Successfully",
                'data':usr
            });
        }
        return res.status(404).json({"message":err});
    })
}
exports.addDebit=(req,res)=>{
    console.log(req.body)
    Transactions.create({
        userId:req.body.userId,
        type:"D",
        category:req.body.category,
        description:req.body.desc,
        amount:req.body.amount
    },(err,usr)=>{
        if(usr){
            return res.status(200).json({
                "message":"Added Successfully",
                'data':usr
            });
        }
        return res.status(404).json({"message":err});
    })
}
exports.modifytrans=(req,res)=>{
    console.log('modifytrans')
    console.log(req.body)
    Transactions.findByIdAndUpdate({
        _id:req.body.id},{
        type:req.body.type,
        category:req.body.category,
        description:req.body.desc,
        amount:req.body.amount
    },(err,usr)=>{
        if(usr){
            return res.status(200).json({
                "message":"Updated Successfully",
                'data':usr
            });
        }
        return res.status(404).json({"message":err});
    })
}
exports.delItem=(req,res)=>{
    console.log(req.body)
    Transactions.deleteOne({_id:req.body.id},(err,usr)=>{
        if(err){
            return res.status(404).json({"message":err});
        }
        return res.status(200).json({"message":'done'});
    })
}
exports.getAllTrans=(req,res)=>{
    console.log(req.body)
    Transactions.find({userId:req.query.userId},(err,usr)=>{
        if(err){
            return res.status(404).json({"message":err});
        }
        if(usr){
            var inc=0.0;
            var exp=0.0;
            var prevBalance=0.0;
            const curremtDate=new Date(Date.now());
            var datalist=[];
            var categSpending=new Map()
            var ctkeys=[]


            //heatmap daymap
            usr.forEach((user)=>{

                var dt=new Date(user.createdAt)

                if(dt.getMonth()==curremtDate.getMonth()&&dt.getFullYear()==curremtDate.getFullYear()){
                    datalist.push(user);
                    //categ analysis
                    if(categSpending[user.category]==null){
                        categSpending[user.category]=user.amount
                        ctkeys.push(user.category)
                    }
                    else{
                        categSpending[user.category]+=user.amount
                    }


                    //inc exp analysis
                    if(user.type=='C')
                        inc+=user.amount
                    else
                        exp+=user.amount
                }
                else{
                    if(user.type=='C')
                        prevBalance+=user.amount
                    else
                        prevBalance-=user.amount
                }

                
            })

            var finalcategSpending=[]

            ctkeys.forEach((e)=>{
                finalcategSpending.push({
                    'category':e,
                    'amount':categSpending[e]
                })
            })


            return res.status(200).json({
                'income':inc,
                'expense':exp,
                'categList':ctkeys,
                'categSpending':finalcategSpending,
                'balance':prevBalance+inc-exp,
                "data":datalist
            })

        }
    });
}

exports.analysis=(req,res)=>{
    //console.log(req.query.userId)
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    var days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    var data=[]
    var monthly=[]
    //var yearly=[]
    var body=new Map()
    Transactions.find({userId:req.query.userId},(err,usr)=>{
        if(usr){
            usr.forEach((user)=>{
                const date=new Date(user.createdAt)
                //console.log(`${monthNames[date.getMonth()]} ${date.getFullYear()}`)
                if(body[`${monthNames[date.getMonth()]} ${date.getFullYear()}`]==null){
                    data.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`)
                    body[`${monthNames[date.getMonth()]} ${date.getFullYear()}`]=[user]
                }
                else{
                    body[`${monthNames[date.getMonth()]} ${date.getFullYear()}`].push(user)
                }
                
            })


            var prevBalance=0.0
            data.reverse().forEach((e)=>{
                var inc=0.0;
                var exp=0.0;
                var categSpending=new Map()
                var ctkeys=[]
                
                var dayheatmap=[0,0,0,0,0,0,0]
                var timeamount={}
                var timekeys=[]


                body[e].forEach((e)=>{
                    const date=new Date(e.createdAt)
                    //dayheatmap
                    dayheatmap[date.getDay()]+=1

                    //timeheatmap
                    if(timeamount[`${date.getHours()}:${date.getMinutes()}`]==null){
                        timeamount[`${date.getHours()}:${date.getMinutes()}`]=e.amount
                        timekeys.push(`${date.getHours()}:${date.getMinutes()}`)
                    }
                    else{
                        timeamount[`${date.getHours()}:${date.getMinutes()}`]+=e.amount
                    }

                    //category
                    if(categSpending[e.category]==null){
                        categSpending[e.category]=e.amount
                        ctkeys.push(e.category)
                    }
                    else{
                        categSpending[e.category]+=e.amount
                    }

                    //type
                    if(e.type=='C')
                        inc+=e.amount
                    else
                        exp+=e.amount
                })

                //console.log(dayheatmap)
                var finalcategSpending=[]

                ctkeys.forEach((e)=>{
                    finalcategSpending.push({
                        'category':e,
                        'amount':categSpending[e]
                    })
                })

                var finaltimeHeatmap=[]
                timekeys.forEach((e)=>{
                    finaltimeHeatmap.push({
                        'time':e,
                        'amount':timeamount[e]
                    })
                })
                
                for(i=0;i<=6;i++){
                    var d=dayheatmap[i]
                    dayheatmap[i]={
                        'day':days[i],
                        'count':d
                    }
                }


                prevBalance+=inc-exp;

                var dt={
                    'month':e.split(' ')[0],
                    'year':e.split(' ')[1],
                    'categSpending':finalcategSpending,
                    'dayheatmap':dayheatmap,
                    'timeheatmap':finaltimeHeatmap,
                    'income':inc,
                    'expense':exp,
                    'currBalance':prevBalance,
                }
                monthly.push(dt)
                
            })


            return res.status(200).json({
                'listofmonth':data.reverse(),
                'monthly':monthly
            })
        }
        return res.status(404).json({
            'data':err
        })
    });
}





exports.getMonthData=(req,res)=>{
    //console.log(req.query.userId)
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
    var data=[]
    var finalData=[]
    var body=new Map()
    Transactions.find({userId:req.query.userId},(err,usr)=>{
        if(usr){
            usr.forEach((user)=>{
                const date=new Date(user.createdAt)
                //console.log(`${monthNames[date.getMonth()]} ${date.getFullYear()}`)
                if(body[`${monthNames[date.getMonth()]} ${date.getFullYear()}`]==null){
                    data.push(`${monthNames[date.getMonth()]} ${date.getFullYear()}`)
                    body[`${monthNames[date.getMonth()]} ${date.getFullYear()}`]=[user]
                }
                else{
                    body[`${monthNames[date.getMonth()]} ${date.getFullYear()}`].push(user)
                }
                
            })


            var prevBalance=0.0
            data.reverse().forEach((e)=>{
                var inc=0.0;
                var exp=0.0;
                var categSpending=new Map()
                var ctkeys=[]

                body[e].forEach((e)=>{

                    if(categSpending[e.category]==null){
                        categSpending[e.category]=e.amount
                        ctkeys.push(e.category)
                    }
                    else{
                        categSpending[e.category]+=e.amount
                    }

                    if(e.type=='C')
                        inc+=e.amount
                    else
                        exp+=e.amount
                })


                var finalcategSpending=[]

                ctkeys.forEach((e)=>{
                    finalcategSpending.push({
                        'category':e,
                        'amount':categSpending[e]
                    })
                })



                prevBalance+=inc-exp;

                var dt={
                    'month':e.split(' ')[0],
                    'year':e.split(' ')[1],
                    'categSpending':finalcategSpending,
                    'income':inc,
                    'expense':exp,
                    'currBalance':prevBalance,
                    'fulldata':body[e]
                }
                finalData.push(dt)
                
            })


            return res.status(200).json({
                'listofmonth':data,
                'mondata':finalData
            })
        }
        return res.status(404).json({
            'data':err
        })
    });
}


//card
exports.addCard=(req,res)=>{
    console.log(req.body)
    Cards.create({
        userId:req.body.userId,
        cardtype:req.body.type,
        uin:req.body.uin,
        company:req.body.company,
        validmonth:req.body.validmonth==null?0:req.body.validmonth,
        validyr:req.body.validyr==null?0:req.body.validyr,
        cvv:req.body.cvv==null?0:req.body.cvv,
        amount:req.body.amount==null?0.0:req.body.amount
        
    },(err,usr)=>{
        if(err){
            return res.status(404).json({"message":err});
        }
        return res.status(200).json({"message":'Card added','data':usr});
    });
}

exports.delCard=(req,res)=>{
    Cards.deleteOne({
        uin:req.body.uin
    },(err,usr)=>{
        if(err){
            return res.status(404).json({"message":err});
        }
        return res.status(200).json({"message":'done'});
    });
}
exports.getAllCard=(req,res)=>{
    Cards.find({userId:req.query.userId},(err,usr)=>{
        return res.status(200).json({
            "data":usr
        })
    });
}


//share
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

exports.addShare=(req,res)=>{
    Share.findOne({$and: [{userid:req.body.userId},
                            {uin:req.body.uin}]},(err,user)=>{

        if(user)
            return res.status(404).json({"message":'Already added'});

        if(user==null) {
            Share.create({
                userid:req.body.userId,
                uin:req.body.uin,
                quantity:req.body.quantity,
                price:req.body.price!=null?req.body.price:0
            },(err,usr)=>{
                if(err){
                    return res.status(404).json({"message":err});
                }
                return res.status(200).json({"message":'Share added','data':usr});
            })  
        }

        
    })
}
exports.modifyshare=(req,res)=>{
    console.log(req.body)
    Share.findOne({$and: [{userid:req.body.userId},
        {uin:req.body.uin}]},(err,usr)=>{
        if(usr){

            Share.findByIdAndUpdate(usr._id,{
                quantity:req.body.quantity
            },(err,usr)=>{
                if(usr){
                    return res.status(200).json({
                        "message":"Updated Successfully",
                        'data':usr
                    });
                }
                return res.status(404).json({
                    "message":err
                });
            })
            
        }
        if(usr==null){
            return res.status(404).json({
                "message":"Does not exist"
            });
        }
    })
}
exports.delshare=(req,res)=>{
    console.log(req.body)
    Share.deleteOne({_id:req.body.id},(err,usr)=>{
        if(err){
            return res.status(404).json({"message":'error'});
        }
        return res.status(200).json({"message":'done'});
    })
}
exports.search=(req,res)=>{
    ShareList.find({},(err,usr)=>{
        //console.log(usr)
        var data=[];
        usr.forEach((e)=>{
            data.push(e.uin)
        })

        return res.status(200).json({
            "data":data
        })
    });
}
exports.getAllShare=(req,res)=>{
    Share.find({userid:req.query.userId},(err,usr)=>{
        return res.status(200).json({
            "data":usr
        })
    });
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
                var res=await axios.get(`http://api.coinlayer.com/live?access_key=c1cd355c7dc3ac43e34679ea310e2312&symbols=${user.symbol}`)
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








