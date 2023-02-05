const express=require('express')
const app=express();
const mongoose=require('mongoose')
const env=require('dotenv')
const cors=require('cors');

env.config();
const { checkServer, addCredit, addDebit, delItem, getAll, getMonthData,addCard,delCard,addSharetoWatch } = require('./controller/controller');

app.use(cors());

mongoose.set('strictQuery', false);
var conn=mongoose.connect(
    `mongodb+srv://${process.env.USERID}:${process.env.PASSWORD}@bms.bb2ybgv.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(()=>{
    console.log("Database Connected");
})
app.use(express.json());



//share


const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'noreply.finleafy@gmail.com',
    pass: 'yyzhnwfeamcfskxn',
  },
});
transporter.verify();



//nodemailer
/**/
//setInterval(scrapeData, );
/*const cron=require('node-cron');
cron.schedule(
  '* * * * *',
  () => {
    const date = new Date();

    transporter.sendMail({
      from: '"Finleafy" <noreply.finleafy@gmail.com>', // sender address
      to: "adityanandi550@gmail.com", // list of receivers
      subject: `${date.getHours()}+${date.getMinutes()}`, // Subject line
      text: "There is a new article. It's about sending emails, check it out!", // plain text body
      html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
    }).then(info => {
      console.log({info});
    }).catch(console.error);
  },
  {
    scheduled: true,
    timezone: 'Asia/Kolkata',
    name: 'simple-task',
    recoverMissedExecutions: false,
  },
);*/


const schedule = require('node-schedule');
const fs=require('fs')
const ShareList = require('./model/ShareList');
const e = require('express');
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
//*/8 * 9.30-3:30 * * 1-5
const job = schedule.scheduleJob("*/8 30 10-15 * * 1-5", watchme);

async function watchme(){
  fs.readFile('./WatchList/watchlist.log','utf-8',(err,data)=>{
    var lst=data.split("\r\n")
    console.log(`--------------------------------`)
    
    lst.forEach(async element => {
      
      const url = `https://www.google.com/search?q=${element}+share+price`;

      const { data } = await axios.get(url);
      const dom = new JSDOM(data);

      const d=dom.window.document.querySelector('.BNeawe .iBp4i').textContent.replace(',','').split(' ')
      

      ShareList.findOneAndUpdate({uin:element},{price:parseFloat(d[0])},{returnOriginal:false},(err,usr)=>{})
    });
  
  })
  console.log(`--------------------------------`)

}

const job2 = schedule.scheduleJob("30 9 * * 1-5", watchme2);

async function watchme2(){
  const date = new Date();
  transporter.sendMail({
    from: '"Finleafy Notify" <noreply.finleafy@gmail.com>', // sender address
    to: "adityanandi550@gmail.com", // list of receivers
    subject: `SERVER MAIL CRON @ ${date.getHours()}:${date.getMinutes()}`, // Subject line
    text: "There is a new article. It's about sending emails, check it out!", // plain text body
    html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
  }).then(info => {
    console.log({info});
  }).catch(console.error);

}


app.get('/',checkServer);
app.post('/addCredit',addCredit);
app.post('/addDebit',addDebit);
app.post('/delItem',delItem);
app.post('/addCard',addCard);
app.post('/delCard',delCard);
app.post('/addSharetoWatch',addSharetoWatch);
app.post('/getAll',getAll);
app.post('/getMonthData',getMonthData);


app.listen(process.env.PORT,()=>{
    console.log(`Server Started at ${process.env.PORT}`);
});