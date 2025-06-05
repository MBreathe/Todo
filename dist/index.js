import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ObjectId } from 'mongodb';
import bodyParser from 'body-parser';
import { connect, state } from "./db.js";
import { checkDb } from './middleware.js';
import { statusCode } from "./statusCodes.js";
const app = express();
app.use(bodyParser.json());
const collection = 'todo';
try {
    await connect();
    app.get('/', (req, res) => {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const path = join(__dirname, '../index.html');
        res.status(statusCode.ok).sendFile(path);
    });
    app.get('/getTodos', checkDb, async (req, res) => {
        const todos = await state.db.collection(collection).find().toArray();
        res.status(statusCode.ok).json(todos);
    });
    app.put('/:id', checkDb, async (req, res) => {
        const { id } = req.params;
        const userInput = req.body;
        const result = await state.db.collection(collection).updateOne({ _id: new ObjectId(id) }, { $set: { title: userInput.title } });
        res.status(statusCode.ok).json(result);
    });
    app.post('/', checkDb, async (req, res) => {
        const userInput = req.body;
        const result = await state.db.collection(collection).insertOne(userInput);
        res.status(statusCode.created).json(result);
    });
    app.delete('/:id', checkDb, async (req, res) => {
        const { id } = req.params;
        const result = await state.db.collection(collection).deleteOne({ _id: new ObjectId(id) });
        res.status(statusCode.ok).json(result);
    });
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}
catch (e) {
    console.error(e);
}
