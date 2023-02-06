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




const { checkServer, addCredit,getAllBTCDATA, addDebit, delItem, getAll, getMonthData,sharevalueupdate,addCard,delCard,addSharetoWatch, getBTCDATA, saveLiveData } = require('./controller/controller');
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

//cron data
app.get('/updatesharevalue',sharevalueupdate);//* 9-15 * * *
app.get('/btclivedata',saveLiveData);//9-15 * * *


app.listen(process.env.PORT,()=>{
    console.log(`Server Started at ${process.env.PORT}`);
    
});