import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not defined");

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
  });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default async function connectDb() {
  const client = await clientPromise;
  const db = client.db("ar_online_shopbd_DB");

  return {
    client,
    db,
    usersCollection: db.collection("users"),
    slidersCollection: db.collection("sliders"),
    productsCollection: db.collection("products"),
    ordersCollection: db.collection("orders"),
  };
}