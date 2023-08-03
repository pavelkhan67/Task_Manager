const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'unauthorized access' });
    }
    // bearer token
    const token = authorization.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: true, message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
}


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hgvq2ef.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10,
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect(err => {
            if (err) {
                console.error(err);
                return;
            }
        });

        const usersCollection = client.db("taskManager").collection("users");
        const taskCollection = client.db("taskManager").collection("tasks");

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6h' })
            res.send({ token })
        })


        // user related api
        // get all users
        app.get('/users', verifyJWT, async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });

        // post a user
        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email }
            const existingUser = await usersCollection.findOne(query);
            // console.log(existingUser);
            if (existingUser) {
                return res.send({ message: 'User Already Exists!' })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        // Task related api
        //get all task
        app.get('/addedtask', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const result = await taskCollection.find(query).toArray();
            res.send(result);
        })

        // add a task
        app.post('/addedtask', verifyJWT, async (req, res) => {
            const newItem = req.body;
            const result = await taskCollection.insertOne(newItem)
            res.send(result);
        })

        // get a specific task
        app.get("/tasks/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await taskCollection.findOne(filter);
            res.send(result);
        });

        // edit a task
        app.patch("/edit/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const editValue = req.body;
            const options = { upsert: true };
            const editDoc = {
                $set: {
                    title: editValue.title,
                    info: editValue.info,
                },
            };
            const result = await taskCollection.updateOne(filter, editDoc, options);
            res.send(result);
        });

        //update a task status
        app.patch("/status/:id", async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updateStatus = {
                $set: {
                    status: user.status,
                },
            };
            const result = await taskCollection.updateOne(
                filter,
                updateStatus,
                option
            );
            res.send(result);
        });

        // delete a task
        app.delete('/addedtask/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
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


app.get('/', (req, res) => {
    res.send('Task is running')
})

app.listen(port, () => {
    console.log(`Task is running on port ${port}`);
})