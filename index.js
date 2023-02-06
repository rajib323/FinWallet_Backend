const express=require('express')
const app=express();
const mongoose=require('mongoose')
const env=require('dotenv')
const cors=require('cors');

env.config();
app.use(cors());

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
app.use(express.json());



//share
const fs=require('fs')
const ShareList = require('./model/ShareList');
const schedule=require('node-schedule')
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


//const job = schedule.scheduleJob("",()=>{});
//8 30 9-15 * * *
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
        

        ShareList.updateOne({uin:user.uin},{price:parseFloat(d[0])},{returnOriginal:false},(err,usr)=>{})
      });
      
      
    }
    console.log(`--------------------------------`)
  })
  /*fs.readFile('./WatchList/watchlist.log','utf-8',(err,data)=>{
    var lst=data.split("\r\n")
    
  
  })
  console.log(`--------------------------------`)*/

}


watchme()
//const job = schedule.scheduleJob("* * * * *",watchme);



const { checkServer, addCredit,getAllBTCDATA, addDebit, delItem, getAll, getMonthData,addCard,delCard,addSharetoWatch, getBTCDATA, saveLiveData } = require('./controller/controller');
app.get('/',checkServer);
app.post('/addcredit',addCredit);
app.post('/adddebit',addDebit);
app.post('/delitem',delItem);
app.post('/addcard',addCard);
app.post('/delcard',delCard);
app.post('/addsharetowatch',addSharetoWatch);
app.post('/getall',getAll);
app.post('/getmonthdata',getMonthData);

//bitcoin
app.post('/btcdata',getBTCDATA);
app.get('/getallbtcdata',getAllBTCDATA);
app.get('/btclivedata',saveLiveData);


app.listen(process.env.PORT,()=>{
    console.log(`Server Started at ${process.env.PORT}`);
    
});