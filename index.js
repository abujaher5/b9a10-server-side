require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(
  cors({ origin: ["http://localhost:5173", "https://go-for-visit.web.app"] })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7rs8zhc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const spotCollection = client.db("SpotDB").collection("spots");

    // read

    app.get("/addTouristSpot", async (req, res) => {
      const result = await spotCollection.find().toArray();
      res.send(result);
    });

    // get for update
    app.get("/addTouristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.findOne(query);
      res.send(result);
    });

    app.put("/addTouristSpot/:id", async (req, res) => {
      console.log(req.params.id);
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          spot_name: req.body.spotName,
          country_name: req.body.countryName,
          location: req.body.location,
          short_description: req.body.description,
          average_cost: req.body.cost,
          seasonality: req.body.seasonality,
          travel_time: req.body.time,
          totalVisitors: req.body.totalVisitor,
          user_email: req.body.email,
          user_name: req.body.name,
          image: req.body.image,
        },
      };
      const result = await spotCollection.updateOne(query, data);
      console.log(result);
      res.send(result);
    });

    // create

    app.post("/addTouristSpot", async (req, res) => {
      const newSpot = req.body;

      console.log(newSpot);
      const result = await spotCollection.insertOne(newSpot);
      // console.log(result);
      res.send(result);
    });
    // delete

    app.delete("/addTouristSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Connect Tourist Spot Making Server");
});
app.listen(port, () => {
  console.log(`Tourist server is running on ${port}`);
});
