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

        // ============================
        // 👤 USER ROUTES
        // ============================


        // Create User
        app.post("creat-User", async (req, res) => {
            const userData = req.body;
            const result = await usersCollection.insertOne(userData);
            res.send(result);
        });

        // ✅  Update User
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

        // ✅ Get All Users (Admin)
        app.get("/users", async (req, res) => {
            const users = await usersCollection.find().toArray();
            res.send(users);
        });

        // ✅ Delete User (optional)
        app.delete("/users/:email", async (req, res) => {
            const email = req.params.email;
            const result = await usersCollection.deleteOne({ email });
            res.send(result);
        });

        // ============================
        // 🎬 MOVIE ROUTES
        // ============================

        // Add Movie
        app.post("/movies", async (req, res) => {
            const movie = req.body;
            const result = await moviesCollection.insertOne(movie);
            res.send(result);
        });

        // Get All Movies with Filters
        app.get("/movies", async (req, res) => {
            const { genre, minRating, maxRating } = req.query;
            const filter = {};

            if (genre) filter.genre = { $in: genre.split(",") };
            if (minRating || maxRating)
                filter.rating = {
                    ...(minRating ? { $gte: parseFloat(minRating) } : {}),
                    ...(maxRating ? { $lte: parseFloat(maxRating) } : {}),
                };

            const result = await moviesCollection.find(filter).toArray();
            res.send(result);
        });

        // Get Single Movie
        app.get("/movies/:id", async (req, res) => {
            const id = req.params.id;
            const movie = await moviesCollection.findOne({ _id: new ObjectId(id) });
            res.send(movie);
        });

        // Update Movie
        app.put("/movies/:id", async (req, res) => {
            const id = req.params.id;
            const updatedMovie = req.body;
            const result = await moviesCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: updatedMovie }
            );
            res.send(result);
        });

        // Delete Movie
        app.delete("/movies/:id", async (req, res) => {
            const id = req.params.id;
            const result = await moviesCollection.deleteOne({
                _id: new ObjectId(id),
            });
            res.send(result);
        });

        // Top Rated Movies (6)
        app.get("/top-rated", async (req, res) => {
            const result = await moviesCollection
                .find()
                .sort({ rating: -1 })
                .limit(6)
                .toArray();
            res.send(result);
        });

        // My Collection (Movies added by a specific user)
        app.get("/my-collection/:email", async (req, res) => {
            const email = req.params.email;
            const result = await moviesCollection.find({ addedBy: email }).toArray();
            res.send(result);
        });

        // ============================
        // 🎞️ WATCHLIST ROUTES
        // ============================

        // Add to Watchlist
        app.post("/watchlist", async (req, res) => {
            const item = req.body;
            const result = await watchlistCollection.insertOne(item);
            res.send(result);
        });

        // Get User's Watchlist
        app.get("/watchlist/:email", async (req, res) => {
            const email = req.params.email;
            const result = await watchlistCollection
                .find({ userEmail: email })
                .toArray();
            res.send(result);
        });

        // Remove from Watchlist
        app.delete("/watchlist/:id", async (req, res) => {
            const id = req.params.id;
            const result = await watchlistCollection.deleteOne({
                _id: new ObjectId(id),
            });
            res.send(result);
        });

        // 📊 Statistics API
        app.get("/api/stats", async (req, res) => {
            try {
                // Count total movies
                const totalMovies = await moviesCollection.countDocuments();

                // Count total users
                const totalUsers = await usersCollection.countDocuments();

                // Get top-rated movie
                const topRatedMovie = await moviesCollection
                    .find({})
                    .sort({ rating: -1 })
                    .limit(1)
                    .toArray();

                const highestRating =
                    topRatedMovie.length > 0 ? topRatedMovie[0].rating : 0;

                // Dummy awards count (can replace with real logic later)
                const awardsWon = 12;

                res.status(200).json({
                    totalMovies,
                    totalUsers,
                    topRatedMovie: highestRating,
                    awardsWon,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
                res.status(500).json({ message: "Internal server error" });
            }
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
