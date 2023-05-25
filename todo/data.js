export function createTodoData(todoId = 1) {
   const TODO_CURRENT_ID = `${todoId}todo_current_id`;

   const savedTodos = localStorage.getItem(`todos_${todoId}`);
   const savedId = localStorage.getItem(TODO_CURRENT_ID);

   let todos = savedTodos
      ? JSON.parse(savedTodos, (key, value) => {
           if (key === "createdAt") {
              return new Date(value);
           }
           return value;
        })
      : [];

   let id = savedId ? Number(savedId) : 1;

   function save(todoId) {
      localStorage.setItem(`todos_${todoId}`, JSON.stringify(todos));
      localStorage.setItem(TODO_CURRENT_ID, id);
   }

   function getTodos() {
      return todos;
   }

   function addTodo(title) {
      if (title.length < 2) {
         throw new Error("2 characters at least");
      }

      const newTodo = {
         title,
         id: id++,
         isActive: false,
         createdAt: new Date(),
      };

      todos = [...todos, newTodo];

      save(todoId);
      return newTodo;
   }

   function removeTodo(id) {
      const removed = todos.find((todo) => todo.id === id);
      todos = todos.filter((todo) => todo.id !== id);

      save(todoId);

      return removed;
   }

   function changeTodoComplete(id) {
      todos = todos.map((todo) => {
         if (todo.id === id) {
            return { ...todo, isActive: !todo.isActive };
         }
         return { ...todo };
      });

      save(todoId);
   }

   function removeAllTodos() {
      todos = [];
      save(todoId);

      return getTodos();
   }

   return {
      getTodos,
      changeTodoComplete,
      addTodo,
      removeAllTodos,
      removeTodo,
   };
}
