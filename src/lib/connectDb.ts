import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("MONGODB_URI is not defined in .env");

let client: MongoClient | null = null;
let mitraMartDb: any = null;
let usersCollection: any = null;
let cakesCollection: any = null;
let ordersCollection: any = null;

export default async function connectDb() {
  if (!client) {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    try {
      await client.connect();
      console.log("Connected to MongoDB successfully!");

      if (!mitraMartDb) {
        mitraMartDb = client.db("mitraCakeShop_db");
      }

      if (!usersCollection) {
        usersCollection = mitraMartDb.collection("usersCollection")
      }
      if (!cakesCollection) {
        cakesCollection = mitraMartDb.collection("cakes")
      }
      if (!ordersCollection) {
        ordersCollection = mitraMartDb.collection("orders")
      }


    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  return { client, mitraMartDb, usersCollection, cakesCollection, ordersCollection };
}
