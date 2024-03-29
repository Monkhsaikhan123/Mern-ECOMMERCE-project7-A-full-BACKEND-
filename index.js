const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()
const jwt = require('jsonwebtoken')
console.log(process.env.ACCESS_TOKEN_SECRET)
//middleware
app.use(cors())
app.use(express.json())

//connect mongoose
mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.api5kkz.mongodb.net/firstdatabase?retryWrites=true&w=majority&appName=Cluster0`)
.then(
    console.log("MongoDB Connected")
)
.catch((error)=>console.log("Error connecting to Mongodb", error))

//jwt authentication
app.post('/jwt' , async(req,res)=>{
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
    expiresIn: '1hr'
  })
  res.send({token})
})

//verify jwt token
//middleware
const verifyToken = (req,res,next)=>{
  /* console.log(req.headers.authorization) */
  if(!req.headers.authorization){
    return res.status(401).send({message:'No Token unauthorized access'})
  }
  const token = req.headers.authorization.split(' ')[1];
  console.log(token)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded)=>{
    if(error){
      return res.status(401).send({message:'Invalid Token'})
    }
    req.decoded = decoded;
    next();
  })
}

//import routes here
const menuRoutes = require('./api/routes/MenuRoutes')
app.use('/menu', menuRoutes)

const cartRoutes = require('./api/routes/CartRouter')
app.use('/carts', cartRoutes)


const userRoutes = require('./api/routes/UserRouter')
app.use('/users', userRoutes)

const payRoutes = require('./api/routes/PayRouter')
app.use('/pay', payRoutes)


//stripe payment routes
const stripe = require("stripe")('sk_test_51OvXuPRuPT5jtrc8ywEyCHIhbQdtxPKR5qYbdvoCnaPLKV31i9dOGejHNZy8gmGSYOyjQh1PLYr9FsbwH7VjoLsK00r7cvUwOO');


app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price*100
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",

    payment_method_types:[
      "card"
    ],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})