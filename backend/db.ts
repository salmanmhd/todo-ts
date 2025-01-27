import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: './../.env' });
const mongoURI = process.env.MONGODB_URI as string;
console.log(mongoURI);
mongoose.connect(mongoURI);
const todoSchema = new mongoose.Schema({
  todo: String,
  completed: Boolean,
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
