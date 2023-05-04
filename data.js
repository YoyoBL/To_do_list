const TODO_CURRENT_ID = "todo_current_id";

const savedTodos = localStorage.getItem("todos");
const savedId = localStorage.getItem(TODO_CURRENT_ID);

export const todos = savedTodos
   ? JSON.parse(savedTodos, (key, value) => {
        if (key === "createdAt") {
           return new Date(value);
        }
        return value;
     })
   : [];

let id = savedId ? Number(savedId) : 1;

function save() {
   localStorage.setItem("todos", JSON.stringify(todos));
   localStorage.setItem(TODO_CURRENT_ID, id);
}

export function getTodos() {
   return todos;
}

export function addTodo(title) {
   const newTodo = {
      title,
      id: id++,
      isActive: false,
      createdAt: new Date(),
   };

   todos.push(newTodo);

   save();
   return newTodo;
}

function findTodoIndex(id) {
   const index = todos.findIndex((todo) => todo.id === id);
   return index === -1 ? null : index;
}

export function removeTodo(id) {
   const index = findTodoIndex(id);
   if (typeof index !== "number") {
      return null;
   }
   const removed = todos.splice(index, 1)[0];

   save();

   return removed ? removed : null;
}

export function changeTodoComplete(id) {
   const index = findTodoIndex(id);

   if (typeof index !== "number") {
      return null;
   }

   todos[index].isActive = !todos[index].isActive;

   save();

   return todos[index];
}

export function removeAllTodos() {
   todos.splice(0, todos.length);
   save();

   return getTodos();
}
