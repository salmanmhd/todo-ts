import axios from "axios";
import { useEffect, useState } from "react";

interface TodoObject {
  _id: string;
  todo: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<TodoObject[]>([]);
  const url = "http://localhost:3000";
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(url);
        setTodos(res.data.todo);
      } catch (error) {
        console.error("error fetching data", error);
      }
    }

    fetchData();
  }, []);

  async function handleComplete(id: string, completed: boolean) {
    try {
      const response = await axios.post(`${url}/update/${id}`, {
        status: !completed,
      });
      if (response.status === 200) {
        setTodos((prevtodo) =>
          prevtodo.map((todo) =>
            todo._id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        );
      }
    } catch (error) {
      console.error("error while marking complete", error);
    }
  }

  async function handleDelete(id: string) {
    const response = await axios.delete(`${url}/delete/${id}`);

    if (response.status === 200) {
      const newTodo = todos.filter((todo) => todo._id !== id);
      setTodos(newTodo);
    }
  }

  async function handleAddTodo(todo: AddtodoObj) {
    try {
      const respose = await axios.post(`${url}/add-todo`, todo);
      if (respose.status === 200) {
        setTodos((prevTodo) => [...prevTodo, respose.data.todo]);
      }
    } catch (error) {
      console.error("error while adding todo", error);
    }
  }

  return (
    <div className="flex flex-col justify-center pt-4 text-white">
      <h1 className="text mb-8 py-4 pl-10 text-4xl font-bold shadow-sm shadow-slate-950">
        Todo List
      </h1>
      <AddTodo addTodo={handleAddTodo} />
      <div className="ml-12 mt-16 h-110 w-128 overflow-y-auto bg-slate-950 px-4 py-6 shadow-sm shadow-slate-950">
        {todos.map((todo, index) => (
          <TodoItems
            key={index}
            todo={todo}
            handleComplete={handleComplete}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

interface AddtodoObj {
  todo: string;
  completed: boolean;
}

interface AddTodoProps {
  addTodo: (todo: AddtodoObj) => void;
}
function AddTodo({ addTodo }: AddTodoProps) {
  const [todo, setTodo] = useState("");

  return (
    <form
      className="ml-12 flex w-128 items-center justify-between"
      onSubmit={(e) => {
        e.preventDefault();
        if (!todo) return;
        addTodo({
          todo,
          completed: false,
        });
        setTodo("");
      }}
    >
      <input
        type="text"
        value={todo}
        onChange={(e) => {
          e.preventDefault();

          setTodo(e.target.value);
        }}
        placeholder="Todo..."
        className="w-96 border-b border-slate-300 bg-transparent py-2 text-xl text-slate-100 transition duration-200 ease-in-out placeholder:text-slate-500 focus:border-slate-500 focus:outline-none focus:ring focus:ring-transparent"
      />
      <button className="rounded-md border border-slate-950 bg-slate-950 px-6 py-2 text-slate-100 hover:bg-slate-800">
        Add Todo
      </button>
    </form>
  );
}
interface TodoItemsProps {
  todo: TodoObject;
  handleComplete: (id: string, completed: boolean) => void;
  handleDelete: (id: string) => void;
}
function TodoItems({ todo, handleComplete, handleDelete }: TodoItemsProps) {
  return (
    <div className="my-4 flex justify-between">
      <h1 className="text-xl">{todo.todo}</h1>
      <div className="flex space-x-5">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => handleComplete(todo._id, todo.completed)}
        />
        <p className="cursor-pointer" onClick={() => handleDelete(todo._id)}>
          ❌
        </p>
      </div>
    </div>
  );
}

export default App;
