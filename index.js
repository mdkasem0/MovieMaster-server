require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
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
   // 🗃️ Database and Collections
    const db = client.db("MovieMasterDB");
    const moviesCollection = db.collection("movies");
    const watchlistCollection = db.collection("watchlist");
    const usersCollection = db.collection("users");
    // ✅ Root Route
    app.get("/", (req, res) => {
      res.send("🎬 MovieMaster Pro Backend is running with Users Collection!");
    });


     // ✅Create and  Update User
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const userData = req.body;

      const filter = { email };
      const updateDoc = { $set: userData };
      const options = { upsert: true };

      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
 
     // ✅ Get Single User
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({ email });
      res.send(user);
    });


    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
