const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('toyis runing');
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lgfbklm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const ToydataCollaction = client.db("toyworld").collection("toydata");
        const Sendtoydatacallocation = client.db("Sendtoyworlddata").collection("sendtoydata");


        app.get('/Toydata', async (req, res) => {
            const cursor = ToydataCollaction.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post("/Adddata", async (req, res) => {
            const toydata = req.body
            const result = await Sendtoydatacallocation.insertOne(toydata);
            res.send(result);
        })

        app.get('/Alltoydata', async (req, res) => {
            const cursor = Sendtoydatacallocation.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/Alltoydata/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await Sendtoydatacallocation.findOne(query)
            res.send(result)
        })

        app.get('/Mytoy/:email', async (req, res) => {
            const result = await Sendtoydatacallocation.find({ selleremail: req.params.email }).toArray()
            res.send(result)
        })

        app.delete('/Mytoy/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await Sendtoydatacallocation.deleteOne(query)
            res.send(result)
        })

        app.get('/Mytoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await Sendtoydatacallocation.findOne(query)
            res.send(result)
        })
        app.put("/Mytoy/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const toydata=req.body;
            const updatetoydata ={
                $set:{
                     sellername:toydata.sellername,
                     Price:toydata.Price,
                     Availablequantity:toydata.Availablequantity,
                     Detaildescription:toydata.Detaildescription

                }
            }
            const result = await Sendtoydatacallocation.updateOne(filter,updatetoydata,option)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







app.listen(port, () => {
    console.log(`Toy server is run port ${port}`);
})