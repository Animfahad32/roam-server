const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const cors = require('cors');
require('dotenv').config();




const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zdqqn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {

    try{
        
        await client.connect();
        // console.log('db connect')
        const database =  client.db("tourCollections")
        const servicesCollection = database.collection("services")
        const ordersCollection = database.collection("myOrderedServices")

        // GET ALL API 
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // GET SINGLE SERVICE

        app.get('/services/:id' , async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })

        // POST API 

        app.post('/services', async (req, res) => {

            const service = req.body;
             const result = await servicesCollection.insertOne(service)
            console.log('Hitting the post api!' , service)
            res.json(result)

        })

        // GET ALL ORDERS
        app.get('/myorders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // post my orders

        app.post('/myorders', async (req, res) => {

            const order = req.body;
             const result = await ordersCollection.insertOne(order)
            console.log('Hitting the post api!' , order)
            res.json(result)

        })

    }
    finally{
        // await client.close();

    }






}


run().catch(console.dir);








app.get('/', (req, res) => {
    res.send("Running Roam Server Assignment")
})

app.listen(port, ()=>{
    console.log("Running Roam Server on port " , port)
})