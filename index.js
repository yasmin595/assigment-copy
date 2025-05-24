const express = require('express');
const cors = require('cors');
require('dotenv').config();
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzjqyca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


 const tasksCollection = client.db('taskDB').collection('tasks');


          app.post('/tasks', async(req, res) => {
            const newTask = req.body;
            console.log(newTask);
            const result = await tasksCollection.insertOne(newTask);
            res.send(result);
        })


           app.get('/tasks', async (req, res) => {
            // const cursor = tasksCollection.find();
            // const result = await cursor.toArray();
            const result = await tasksCollection.find().toArray();
            res.send(result);
        });

        
           app.get('/my-task', async (req, res) => {
            const result = await tasksCollection.find().sort({ deadline: 1 }).limit(6).toArray();
            res.send(result);
        });



        
             
        app.get('/tasks/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const result = await tasksCollection.find(query).toArray();
            res.send(result);
        })
           app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await tasksCollection.findOne(query);
            res.send(result);
        })
        
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await tasksCollection.deleteOne(query);
            res.send(result);
        })
          app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedTask = req.body;
            const updatedDoc = {
                $set: updatedTask
            }

         

            const result = await  tasksCollection.updateOne(filter, updatedDoc, options);

            res.send(result);
        })



app.get('/', (req, res) => {
    res.send('task server is getting ready.')
});

app.listen(port, () => {
    console.log(`task server is running on port ${port}`)
})