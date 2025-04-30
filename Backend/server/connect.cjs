const { MongoClient } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const client = new MongoClient(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function connectToDatabase() {
    try {
        console.log("🔄 Connecting to MongoDB...");
        await client.connect();
        console.log("✅ Successfully connected to MongoDB!");
        
        const db = client.db("CarVentory");
        console.log("📂 Connected to CarVentory Database");
        
        return db;
    } catch (e) {
        console.error("❌ Connection Error:", e.message);
        throw e;
    }
}

module.exports = { connectToDatabase, client };
