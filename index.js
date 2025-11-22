require("dotenv").config();
const express = require("express");
const app = express();
var cors = require("cors");
const port = process.env.PORT;
app.use(express.json());
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ckmlm2z.mongodb.net/?appName=Cluster0`;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const itemsDatabase = client.db("ecommerce");
    const itemsCollection = itemsDatabase.collection("items");

    // fetching all products
    app.get("/items", async (req, res) => {
      const allitems = await itemsCollection.find().toArray();
      res.send(allitems);
    });

    // adding product
    app.post("/items", async (req, res) => {
      try {
        const data = req.body;
        const insert = await itemsCollection.insertOne(data);
        req.send(insert);
      } catch {
        res.send({ error: "error while adding items" });
      }
    });

    // deletind product
    app.delete("/items/:id", async (req, res) => {
      try {
        const remove = await itemsCollection.deleteOne({ id: new ObjectId(req.params.id) });
        res.send(remove);
      } catch {
        res.send({ error: "error while deleting items" });
      }
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
