import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required");
}

let db: MongoClient;

declare global {
  var __db: MongoClient | undefined;
}

if (process.env.NODE_ENV === "production") {
  db = new MongoClient(process.env.MONGODB_URI);
} else {
  if (!global.__db) {
    global.__db = new MongoClient(process.env.MONGODB_URI);
  }
  db = global.__db;
}

export { db };