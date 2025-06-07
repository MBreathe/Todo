import  express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Document, ObjectId } from 'mongodb';
import { connect, state } from "./db.js";
import {checkDb, checkID, checkPostRequest} from './middleware.js'
import { statusCode } from "./statusCodes.js";
import 'dotenv/config';

const PORT: number = Number(process.env.PORT) || 3000;
const __dirname: string = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, '../dist')));

const collection: string = 'todo';

try {
    await connect();
    app.get('/', (req, res): void => {
        const path: string = join(__dirname, '../index.html');
        res.status(statusCode.ok).sendFile(path);
    });
    app.get('/getTodos', checkDb, async (req, res): Promise<void> => {
        const todos:Document[] = await state.db!.collection(collection).find().toArray();
        res.status(statusCode.ok).json(todos);
    });
    app.put('/:id', checkDb, checkID, async (req, res): Promise<void> => {
        const { id } = req.params;
        const userInput: { title: string } = req.body;

        await state.db!.collection(collection).updateOne({ _id: new ObjectId(id) }, { $set: { title: userInput.title } });
        res.status(statusCode.ok).json(userInput);
    });
    app.post('/', checkDb, checkPostRequest, async (req, res): Promise<void> => {
        const userInput: { title: string, completed?: boolean } = req.body;
        await state.db!.collection(collection).insertOne(userInput);
        res.status(statusCode.created).json(userInput);
    })
    app.delete('/:id', checkDb, checkID, async (req, res): Promise<void> => {
        const { id } = req.params;
        const result = await state.db!.collection(collection).deleteOne({ _id: new ObjectId(id) });
        res.status(statusCode.ok).json(result);
    });

    app.listen(PORT, (): void => {
        console.log(`Server is running on port ${PORT}`);
    });
} catch (e) {
    console.error(e);
}