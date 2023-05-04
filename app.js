// RENDER

import {
   getTodos,
   changeTodoComplete,
   addTodo,
   removeAllTodos,
   removeTodo,
} from "./data.js";

const $todoInput = document.getElementById("todo-input");
const $todoAddBtn = document.getElementById("todo-add-btn");
const $todoList = document.getElementById("todo-list");

$todoList.addEventListener("change", (e) => {
   if (e.target.matches("input.input-checkbox")) {
      handleTodoComplete(
         Number(e.target.closest("li.todo-item").dataset.todoId)
      );
   }
});

$todoList.addEventListener("click", (e) => {
   if (e.target.matches("i.bi-trash")) {
      renderRemoveTodo(Number(e.target.closest("li.todo-item").dataset.todoId));
   }
});

function renderEmptyListNotification() {
   return `
   <div class="text-center bg-light">
   <h1>Well Done!</h1>
   <p>
      You are all done for today, go titfanen on the beach!
   </p>
</div>
   `;
}

function renderTodoItem(todo) {
   // onchange = "handleTodoComplete(${todo.id})"
   // id="Checkbox${todo.id}"
   return `
   <li 
   data-todo-id = "${todo.id}"
   class="todo-item list-group-item position-relative">
   <input
      class="input-checkbox form-check-input me-1"
      type="checkbox"
      ${todo.isActive ? "checked" : ""}
   />
   <label class="form-check-label ${
      todo.isActive ? "text-black-50 text-decoration-line-through" : ""
   }" for="Checkbox${todo.id}"
      >${todo.title}</label
   >

   <i class="btn py-0 position-absolute end-0 text-danger bi bi-trash"></i>

   
</li>
   `;
}

function renderTodoList(todos = []) {
   let html = '<ul class="list-group">';

   for (let todo of todos) {
      html += renderTodoItem(todo);
   }

   html += "</ul>";
   return html;
}

$todoAddBtn.addEventListener("click", handleNewTodo);
$todoInput.addEventListener("keydown", (e) => {
   if (e.key === "Enter") {
      handleNewTodo();
   }
});

function handleNewTodo() {
   if ($todoInput.value.length < 2) {
      alert("Must have at least 2 characters");
      return;
   }
   addTodo($todoInput.value);
   $todoInput.value = "";
   renderTodoApp();
}

function renderTodoApp() {
   getTodos().sort((a, b) => (a.isActive > b.isActive ? 1 : -1));
   $todoList.innerHTML =
      getTodos().length > 0
         ? renderTodoList(getTodos())
         : renderEmptyListNotification();
}

function handleTodoComplete(id) {
   changeTodoComplete(id);
   renderTodoApp();
}

function renderRemoveTodo(id) {
   // debugger;
   removeTodo(id);
   renderTodoApp();
}

renderTodoApp();
