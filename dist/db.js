import { MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config';
const dbname = 'crud_mongodb';
export const state = {
    db: null
};
const uri = process.env.MONGODB;
if (!uri)
    throw new Error('MONGODB is not defined');
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
}
