import { MongoClient, ServerApiVersion } from "mongodb";
const dbname = 'crud_mongodb';
const state = {
    db: null
};
const uri = process.env.MONGODB_URI;
if (!uri)
    throw new Error('MONGODB_URI is not defined');
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
export async function connect() {
    try {
        await client.connect();
        state.db = client.db(dbname);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        await client.close();
    }
}
export function getDb() {
    return state.db;
}
