import { Db, MongoClient, ServerApiVersion } from "mongodb";
import 'dotenv/config';

interface State {
    db: null | Db;
}

const dbname: string = 'crud_mongodb';
export const state: State = {
    db: null
};
const uri: string | undefined = process.env.MONGODB;
if (!uri) throw new Error('MONGODB is not defined');

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export async function connect(): Promise<void> {
    try {
        await client.connect();
        state.db = client.db(dbname);
    } catch (e) {
        console.error(e);
    }
}