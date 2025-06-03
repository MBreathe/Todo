import  express from 'express';
import { Document, ObjectId } from 'mongodb';
import bodyParser from 'body-parser';
import { connect, state } from "./db.js";

interface Todo {
    _id: string;
    title: string;
    completed: boolean;
}

const app = express();
app.use(bodyParser.json());

const collection: string = 'todo';

try {
    app.get('/', (req, res): void => {
        res.send(import.meta.url + 'index.html');
    });
    app.get('/getTodos', async (req, res): Promise<void> => {
        await connect();
        if (!state.db) {
            res.status(500).send('Database is not connected');
            return;
        }
        const todos: Document[] = await state.db.collection(collection).find().toArray();
        res.json(todos);
    })
    app.put('/:id', async (req, res) => {
        await connect();
        const { id } = req.params;
        const userInput: { title: string } = req.body;

        if (!state.db) {
            res.status(500).send('Database is not connected');
            return;
        }
        const result = await state.db.collection(collection).updateOne({ _id: new ObjectId(id) }, { $set: { title: userInput.title } });
        res.json(result);
    })

    app.listen(3000, (): void => {
        console.log('Server is running on port 3000');
    });
} catch (e) {
    console.error(e);
}