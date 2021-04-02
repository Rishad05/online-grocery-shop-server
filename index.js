const express = require('express')

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json());
const port =process.env.PORT ||5000;

app.get('/', (req, res) =>{
  res.send("Welcome to My grocery Server")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j70me.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("onlineGroceryStore").collection("products");
  const ordersCollection = client.db("onlineGroceryStore").collection("orders");



  app.get('/products',(req, res)=>{
    productCollection.find()
    .toArray((err, products) =>{
      res.send(products)
    })
  })


  app.get('/products/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    productCollection.find({ _id: id })
      .toArray((err, products) => {
        res.send(products[0]);
      })
  })



  app.get('/orderPreview', (req, res) => {
    ordersCollection.find({ email: req.query.email })
      .toArray((err, orders) => {
        res.send(orders);
      })
  })




  app.post('/addProduct',(req,res)=>{
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
    .then(result=>[
        res.send(result.insertedCount > 0)
    ])
})


app.post('/buyProduct', (req, res) => {
  const newProduct = req.body;
  ordersCollection.insertOne(newProduct)
    .then(result => {
      res.send(result.insertedCount > 0);
    })

})



app.get('/checkOut/:id', (req,res)=>{
  const id = ObjectID (req.params.id)
  productCollection.find({_id: id})
  .toArray((err, documents))
  res.send(documents)
})


app.delete('/deleteProduct/:id', (req, res) => {
  const id = ObjectID(req.params.id)
  productCollection.deleteOne({ _id: id })
    .then(result => {
      res.send(result.deletedCount > 0)
    })
})




});

app.listen(port)