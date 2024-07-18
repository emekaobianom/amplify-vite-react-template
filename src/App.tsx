import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
//----
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

// Generate a client for the Schema
const client = generateClient<Schema>();

function App() {
  // Define state for todos, typed as an array of Schema's Todo type
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  // useEffect to subscribe to the Todo model's observeQuery
  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data: any) => setTodos([...data.items]),
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  // Function to create a new Todo item
  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (

    <Authenticator>
      {({ signOut }) => (
        <main>
          <h1>My todos</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}
                onClick={() => deleteTodo(todo.id)}
              >{todo.content}</li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
            <br />
            <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
              Review next step of this tutorial.
            </a>
          </div>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
