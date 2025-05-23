import mongoose from "mongoose";
import { config } from "dotenv";

// Load environment variables if not in Next.js context
if (process.env.NODE_ENV !== "production" && !process.env.NEXT_RUNTIME) {
  config({ path: ".env.local" });
}

class MongoDBConnection {
  private static instance: MongoDBConnection;
  private conn: typeof mongoose | null = null;
  private promise: Promise<typeof mongoose> | null = null;
  private isConnecting: boolean = false;

  private constructor() {}

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  public async connect(): Promise<typeof mongoose> {
    // If we already have a connection, return it
    if (this.conn) {
      return this.conn;
    }

    // If we're already connecting, return the existing promise
    if (this.isConnecting) {
      return this.promise!;
    }

    // If we have a pending promise, return it
    if (this.promise) {
      return this.promise;
    }

    this.isConnecting = true;

    try {
      const opts = {
        bufferCommands: false,
      };

      // Check if there's an existing connection
      if (mongoose.connection.readyState === 1) {
        this.conn = mongoose;
        this.promise = Promise.resolve(mongoose);
        return mongoose;
      }

      // If there's a connection in progress, wait for it
      if (mongoose.connection.readyState === 2) {
        await new Promise((resolve) => {
          mongoose.connection.once("connected", resolve);
        });
        this.conn = mongoose;
        this.promise = Promise.resolve(mongoose);
        return mongoose;
      }

      // Create new connection
      this.promise = mongoose.connect(process.env.MONGODB_URI!, opts);
      const mongooseInstance = await this.promise;
      this.conn = mongooseInstance;
      return mongooseInstance;
    } catch (e) {
      this.promise = null;
      throw e;
    } finally {
      this.isConnecting = false;
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

async function connectDB() {
  return MongoDBConnection.getInstance().connect();
}

export default connectDB;
