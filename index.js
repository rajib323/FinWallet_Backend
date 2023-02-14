const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const env = require("dotenv");
const router = require("express").Router();;


env.config();
const app=express();


app.use(cors());
app.use(router);
app.use(express.json());
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





const { checkServer, addCredit,getAllBTCDATA, addDebit, delItem, getAllTrans,getAllCard,getAllShare}= require('./controller/controller');
const {getMonthData,sharevalueupdate,addCard,delCard,addSharetoWatch, getBTCDATA, saveLiveData } = require('./controller/controller');



//router
router.get('/',(req,res)=>{
    res.send('Hey Buddy working great')
});

//transactions
router.post('/addcredit',addCredit);
router.post('/adddebit',addDebit);
router.post('/modifytrans',(req,res)=>{});
router.post('/deltrans',delItem);
router.post('/getalltrans',getAllTrans);
router.post('/getmonthdata',getMonthData);


//card
router.post('/verify',addCard);
router.post('/delcard',delCard);
router.post('/getallcard',getAllCard);

//share
router.post('/addsharetowatch',addSharetoWatch);
router.post('/getallshare',getAllShare);
router.post('/addShare',(req,res)=>{});
router.post('/modifyshare',(req,res)=>{});
router.post('/delShare',(req,res)=>{});


//bitcoin
router.post('/btcdata',getBTCDATA);
router.get('/getallbtcdata',getAllBTCDATA);

//cron data
router.put('/updatesharevalue',sharevalueupdate);//* 9-15 * * *
//router.put('/btclivedata',saveLiveData);//9-15 * * *


app.listen(process.env.PORT,()=>{
    console.log(`Server Started at ${process.env.PORT}`);
    
});