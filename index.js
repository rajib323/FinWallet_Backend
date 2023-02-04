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
transporter.verify().then(console.log).catch(console.error);




//setInterval(scrapeData, );
const schedule = require('node-schedule');
const rule = new schedule.RecurrenceRule();
rule.hour=9;
rule.minute=15;

const job = schedule.scheduleJob(rule, function(){
    transporter.sendMail({
        from: '"Finleafy" <noreply.finleafy@gmail.com>', // sender address
        to: "adityanandi550@gmail.com", // list of receivers
        subject: "Medium @edigleyssonsilva ✔", // Subject line
        text: "There is a new article. It's about sending emails, check it out!", // plain text body
        html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
      }).then(info => {
        console.log({info});
      }).catch(console.error);
});




app.get('/',checkServer);
app.get('/sendmail',(req,res)=>{
    transporter.sendMail({
        from: '"Finleafy" <noreply.finleafy@gmail.com>', // sender address
        to: "adityanandi550@gmail.com", // list of receivers
        subject: "Medium @edigleyssonsilva ✔", // Subject line
        text: "Hey buddy", // plain text body
        html: "<b>There is a new article. It's about sending emails, check it out!</b>", // html body
      }).then(info => {

        res.send('Hey Buddy sent you a mail')

        console.log({info});
      }).catch(console.error);
});
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