import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ObjectId } from 'mongodb';
import { connect, state } from "./db.js";
import { checkDb, checkID, checkPostRequest } from './middleware.js';
import { statusCode } from "./statusCodes.js";
import 'dotenv/config';
const PORT = Number(process.env.PORT) || 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, '../dist')));
const collection = 'todo';
try {
    await connect();
    app.get('/', (req, res) => {
        const path = join(__dirname, '../index.html');
        res.status(statusCode.ok).sendFile(path);
    });
    app.get('/getTodos', checkDb, async (req, res) => {
        const todos = await state.db.collection(collection).find().toArray();
        res.status(statusCode.ok).json(todos);
    });
    app.put('/:id', checkDb, checkID, async (req, res) => {
        const { id } = req.params;
        const userInput = req.body;
        await state.db.collection(collection).updateOne({ _id: new ObjectId(id) }, { $set: { title: userInput.title } });
        res.status(statusCode.ok).json(userInput);
    });
    app.post('/', checkDb, checkPostRequest, async (req, res) => {
        const userInput = req.body;
        await state.db.collection(collection).insertOne(userInput);
        res.status(statusCode.created).json(userInput);
    });
    app.delete('/:id', checkDb, checkID, async (req, res) => {
        const { id } = req.params;
        const result = await state.db.collection(collection).deleteOne({ _id: new ObjectId(id) });
        res.status(statusCode.ok).json(result);
    });
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
catch (e) {
    console.error(e);
}
