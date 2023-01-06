const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const app = new express();

const PORT = process.env.PORT || 5000;

require('./middlewares/mongoDB')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(logger('dev'))


const loginApi = require('./routes/loginApi')
app.use('/login', loginApi)

const signupApi = require('./routes/signupApi')
app.use('/signup', signupApi)


app.listen(PORT, ()=>{
    console.log("Server is running on PORT",PORT);
})  