import express from 'express';
import bodyParser from 'body-parser';
import { connect } from "./db.js";
const app = express();
app.use(bodyParser.json());
const collection = 'todo';
try {
    await connect();
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}
catch (e) {
    console.error(e);
}
