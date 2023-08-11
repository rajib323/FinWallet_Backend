const express = require("express");
const mongoose = require("mongoose")
const cors = require("cors");
const env = require("dotenv");
const router = require("express").Router();
const fs=require('fs')


env.config();
const app=express();


app.use(cors());
app.use(router);
router.use(express.json());
app.use(express.urlencoded({ extended: false }));



mongoose.set('strictQuery', false);
var conn=mongoose.connect(
  `mongodb+srv://${process.env.USERID}:${process.env.PASSWORD}@finleafy.tclcz9a.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(()=>{
    console.log("Database Connected");
})


const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

//cronjob
async function watchme(){
    console.log(`--------------------------------`)
    ShareList.find({},(err,usr)=>{
      if(usr){
        var usrmap={}
        usr.forEach(async function(user) {
          const url = `https://www.google.com/search?q=${user.uin}+share+price`;
  
          const { data } = await axios.get(url);
          const dom = new JSDOM(data);
  
  
  
          var d=dom.window.document.querySelector('.BNeawe .iBp4i').textContent.replace(',','').split(' ')
  
          console.log(`${user.uin}  ${d[0]}`)
  
  
          Share.updateMany({uin:user.uin},{newprice:parseFloat(d[0])},(err,usr)=>{
            console.log(err,usr);
          });
        });
  
  
      }
      console.log(`--------------------------------`)
    })
}


async function getfeed(){
  console.log(`--------------------------------`)
  console.log('Data fetched');
  //780a9817c27042138d27cf450bef02ac
  const data = await axios.get(
    'https://newsapi.org/v2/top-headlines?country=in&apiKey=780a9817c27042138d27cf450bef02ac&pageSize=100',
  {headers: {
    "Content-Type":"application/json"
  }})
  console.log(data['data'])
  fs.writeFile('./data/newsdata.json',JSON.stringify(data['data']),()=>{console.log('File Appended')});

  console.log(`--------------------------------`)
}


const schedule = require("node-schedule");
schedule.scheduleJob("*/5 9-15 * * *", watchme);
schedule.scheduleJob("0 0,5,10,15,20 * * *", getfeed);


const { getNews,modifyshare,addShare, addCredit,getAllBTCDATA, addDebit, delItem, getAllTrans,getAllCard,getAllShare, modifytrans, delshare, analysis, search, updateToDo, completedToDo, addtodo, gettodo, login}= require('./controller/controller');
const {getMonthData,sharevalueupdate,addCard,delCard, getBTCDATA, saveLiveData } = require('./controller/controller');
const ShareList = require("./model/ShareList");
const Share = require("./model/Share");



//router
router.get('/',(req,res)=>{
    res.send('Hey Buddy working great')
});
router.post('/login', login)
//todo list
router.get('/gettodo', gettodo)////////////////////
router.post('/addtodo', addtodo)
router.get('/completed', completedToDo)
router.put('/updatetodo', updateToDo)



//newsdata
router.get('/getnews', getNews)

//transactions
router.post('/addcredit',addCredit);      //checked
router.post('/adddebit',addDebit);      //checked
router.put('/modifytrans',modifytrans);     //checked
router.delete('/deltrans',delItem);           //checked
router.get('/getalltrans',getAllTrans);    //checked//////////////////
router.get('/getmonthdata',getMonthData);  //checked
router.get('/chartanalysis',analysis); 


//card
router.post('/verify',addCard);     
router.delete('/delcard',delCard);
router.get('/getallcard',getAllCard);////////////

//share
router.get('/getallshare',getAllShare);////////
router.get('/search',search);
router.post('/addShare',addShare);
router.put('/modifyshare',modifyshare);
router.delete('/delShare',delshare);


//bitcoin
router.post('/btcdata',getBTCDATA);
router.get('/getallbtcdata',getAllBTCDATA);

//cron data
//router.put('/btclivedata',saveLiveData);//9-15 * * *


app.listen(process.env.PORT,()=>{
    console.log(`Server Started at ${process.env.PORT}`);
    
});