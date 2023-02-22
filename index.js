const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const env = require("dotenv");
const router = require("express").Router();



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





const { checkServer,modifyshare,addShare, addCredit,getAllBTCDATA, addDebit, delItem, getAllTrans,getAllCard,getAllShare, modifytrans, delshare}= require('./controller/controller');
const {getMonthData,sharevalueupdate,addCard,delCard,addSharetoWatch, getBTCDATA, saveLiveData } = require('./controller/controller');


//router
router.get('/',(req,res)=>{
    res.send('Hey Buddy working great')
});

//transactions
router.post('/addcredit',addCredit);      //checked
router.post('/adddebit',addDebit);      //checked
router.put('/modifytrans',modifytrans);     //checked
router.delete('/deltrans',delItem);           //checked
router.get('/getalltrans',getAllTrans);    //checked
router.get('/getmonthdata',getMonthData);  //checked


//card
router.post('/verify',addCard);     
router.delete('/delcard',delCard);
router.get('/getallcard',getAllCard);

//share
router.post('/addsharetowatch',addSharetoWatch);
router.get('/getallshare',getAllShare);
router.post('/addShare',addShare);
router.put('/modifyshare',modifyshare);
router.delete('/delShare',delshare);


//bitcoin
router.post('/btcdata',getBTCDATA);
router.get('/getallbtcdata',getAllBTCDATA);

//cron data
router.put('/updatesharevalue',sharevalueupdate);//* 9-15 * * *
//router.put('/btclivedata',saveLiveData);//9-15 * * *


app.listen(process.env.PORT,()=>{
    console.log(`Server Started at ${process.env.PORT}`);
    
});