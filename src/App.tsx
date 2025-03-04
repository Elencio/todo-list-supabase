import { TodoProvider } from "./context/TodoContext";
import Home from "./pages/Home";


export default function App() {


  return (
    <TodoProvider>
      <Home />
    </TodoProvider>
  )
}

