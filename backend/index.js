import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import typeDefs from "./schema.js";
import resolvers from "./resolver.js";

// Read MongoDB URI from env, fallback to localhost for local dev
const MONGODB_URI = "mongodb://mongo:27017/realestate" ; //|| "mongodb://mongo:27017/realestate";

// Maximum number of connection attempts
const MAX_RETRIES = 5;
// Delay between retries (ms)
const RETRY_DELAY = 2000;

let attempts = 0;

// Connect to MongoDB with proper logging and retry logic
async function connectWithRetry() {
  attempts += 1;
  console.log(`Attempt ${attempts} to connect to MongoDB at ${MONGODB_URI}`);
  
  try {
    // Note: no more useNewUrlParser / useUnifiedTopology options needed
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Setup Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Start Apollo Server once DB connection is established
    const { url } = await startStandaloneServer(server, {
      listen: { port: process.env.PORT || 4000 },
    });

    console.log(`🚀 Server ready at ${url}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);

    if (attempts < MAX_RETRIES) {
      console.log(`Waiting ${RETRY_DELAY}ms before retrying...`);
      setTimeout(connectWithRetry, RETRY_DELAY);
    } else {
      console.error("🔴 Exceeded max MongoDB connection retries. Exiting.");
      process.exit(1); // Exit if DB connection fails after retries
    }
  }
}

// Kick off the connection attempts
connectWithRetry();
