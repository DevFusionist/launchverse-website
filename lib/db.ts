import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env",
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnecting: boolean;
}

const cache: MongooseCache = {
  conn: null,
  promise: null,
  isConnecting: false,
};

// Configure mongoose options
mongoose.set("strictQuery", true);

// Cleanup function to remove all listeners and reset cache
function cleanupConnection() {
  if (mongoose.connection) {
    mongoose.connection.removeAllListeners();
    cache.conn = null;
    cache.promise = null;
    cache.isConnecting = false;
  }
}

// Setup connection event handlers
function setupConnectionHandlers() {
  if (!mongoose.connection.listeners("connected").length) {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
      cache.isConnecting = false;
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      cleanupConnection();
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      cleanupConnection();
    });
  }
}

async function connectDB() {
  // If we have a cached connection, return it
  if (cache.conn) {
    return cache.conn;
  }

  // If we're already connecting, return the existing promise
  if (cache.isConnecting && cache.promise) {
    return cache.promise;
  }

  // Setup connection handlers
  setupConnectionHandlers();

  // Create new connection promise
  const opts = {
    bufferCommands: false,
    maxPoolSize: 5,
    minPoolSize: 1,
    socketTimeoutMS: 45000,
    family: 4,
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 10000,
    maxIdleTimeMS: 60000,
    waitQueueTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  };

  cache.isConnecting = true;
  cache.promise = mongoose
    .connect(MONGODB_URI, opts)
    .then((mongoose) => {
      cache.conn = mongoose;
      cache.promise = null;
      cache.isConnecting = false;

      return mongoose;
    })
    .catch((err) => {
      cleanupConnection();
      throw err;
    });

  try {
    return await cache.promise;
  } catch (e) {
    cleanupConnection();
    throw e;
  }
}

// Initial setup of connection handlers
setupConnectionHandlers();

// Export a function to close the connection when needed
export async function closeConnection() {
  if (mongoose.connection.readyState !== 0) {
    // 0 = disconnected
    await mongoose.connection.close();
    cleanupConnection();
  }
}

export default connectDB;
