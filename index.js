const express=require('express')
const app=express();
const mongoose=require('mongoose')
const env=require('dotenv')
const cors=require('cors');

env.config();
const { checkServer, login, signUp, addCredit, addDebit, delItem, getAll, getUsrData } = require('./controller/controller');

app.use(cors());


var conn=mongoose.connect(
    `mongodb+srv://${process.env.USERID}:${process.env.PASSWORD}@cbot-backend.htcws.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(()=>{
    console.log("Database Connected");
})
app.use(express.json());

app.get('/',checkServer);
app.post('/login',login);
app.post('/signUp',signUp);
app.post('/addCredit',addCredit);
app.post('/addDebit',addDebit);
app.post('/delItem',delItem);
app.post('/getAll',getAll);
app.post('/getUsrData',getUsrData);


app.listen(process.env.PORT,()=>{
    console.log(`Server Started at ${process.env.PORT}`);
});