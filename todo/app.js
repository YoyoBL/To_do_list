import { createTodoData } from "./data.js";
const $displayArea = document.getElementById("display-area");

let todos = [];

let html = ` 
<div class="col-md-8 mx-auto">
<div class="row">
   <div class="col">
      <button
         id="create-new-todos-btn"
         class="btn btn-info w-100"
      >
         Create a new Todos list
      </button>
   </div>
</div>
<div class="row">
   <div id="todo-list" class="col"></div>
</div>
</div>
`;

$displayArea.innerHTML = html;

const $createNewTodosBtn = document.getElementById("create-new-todos-btn");

function loadTodoHtml() {
   let html = ` 
   <div class="col-md-8 mx-auto">
      <div class="row">
         <div class="col">
            <div class="input-group mb-3">
               <label class="input-group-text" for="button-addon2">
                  I need to:
               </label>
               <input
                  type="text"
                  id="todo-input"
                  class="form-control"
                  placeholder="Buy milk..."
                  aria-label="Recipient's username"
                  aria-describedby="button-addon2"
               />
               <button
                  id="todo-add-btn"
                  class="btn btn-primary"
                  type="button"
                  id="button-addon2"
               >
                  Add
               </button>
               <div class="invalid-feedback"></div>
            </div>
         </div>
      </div>
      <div class="row">
         <div id="todo-list" class="col">
            
         </div>
      </div>

   
</div>`;

   $displayArea.innerHTML = html;
}

$createNewTodosBtn.addEventListener("click", () => {
   loadTodoHtml();
   renderTodoList();
});

// RENDER-----------------------------------------------------------------------------
// RENDER-----------------------------------------------------------------------------
// RENDER-----------------------------------------------------------------------------
// RENDER-----------------------------------------------------------------------------
// RENDER-----------------------------------------------------------------------------
function renderTodoList() {
   const { getTodos, changeTodoComplete, addTodo, removeAllTodos, removeTodo } =
      createTodoData(todos.length + 1);

   const $todoInput = document.getElementById("todo-input");
   const $todoAddBtn = document.getElementById("todo-add-btn");
   const $todoList = document.getElementById("todo-list");
   const $inputError = document.querySelector(".invalid-feedback");

   $todoList.addEventListener("change", (e) => {
      if (e.target.matches("input.input-checkbox")) {
         handleTodoComplete(
            Number(e.target.closest("li.todo-item").dataset.todoId)
         );
      }
   });

   $todoList.addEventListener("click", (e) => {
      if (e.target.matches("i.bi-trash")) {
         renderRemoveTodo(
            Number(e.target.closest("li.todo-item").dataset.todoId)
         );
      }
   });

   $todoAddBtn.addEventListener("click", handleNewTodo);
   $todoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
         handleNewTodo();
      }
   });

   // function listeners() {
   //    $todoList.addEventListener("change", (e) => {
   //       if (e.target.matches("input.input-checkbox")) {
   //          handleTodoComplete(
   //             Number(e.target.closest("li.todo-item").dataset.todoId)
   //          );
   //       }
   //    });

   //    $todoList.addEventListener("click", (e) => {
   //       if (e.target.matches("i.bi-trash")) {
   //          renderRemoveTodo(
   //             Number(e.target.closest("li.todo-item").dataset.todoId)
   //          );
   //       }
   //    });

   //    $todoAddBtn.addEventListener("click", handleNewTodo);
   //    $todoInput.addEventListener("keydown", (e) => {
   //       if (e.key === "Enter") {
   //          handleNewTodo();
   //       }
   //    });
   // }

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

   function renderTodoItem({ id, isActive: checked, title }) {
      // const id = todo.id
      // const title = todo.title
      // const checked = todo.isActive
      // onchange = "handleTodoComplete(${todo.id})"
      // id="Checkbox${todo.id}"
      return `
   <li 
   data-todo-id = "${id}"
   class="todo-item list-group-item position-relative">
   <input
      class="input-checkbox form-check-input me-1"
      type="checkbox"
      ${checked ? "checked" : ""}
   />
   <label class="form-check-label ${
      checked ? "text-black-50 text-decoration-line-through" : ""
   }" for="Checkbox${id}"
      >${title}</label
   >

   <i class="btn py-0 position-absolute end-0 text-danger bi bi-trash"></i>

   
</li>
   `;
   }

   function renderTodoList(todos = []) {
      let html = '<ul class="list-group">';

      for (let todo of getTodos()) {
         html += renderTodoItem(todo);
      }

      html += "</ul>";
      return html;
   }

   function handleNewTodo() {
      renderError();
      try {
         addTodo($todoInput.value);
         $todoInput.value = "";
         renderTodoApp();
      } catch (err) {
         renderError(err.message);
      }
   }

   function renderError(error) {
      if (!error) {
         $todoInput.classList.remove("is-invalid");
         $inputError.innerHTML = "";
         return;
      }
      $todoInput.classList.add("is-invalid");
      $inputError.innerHTML = error;
   }

   function renderTodoApp() {
      getTodos().sort((a, b) => (a.isActive > b.isActive ? 1 : -1));
      $todoList.innerHTML =
         getTodos().length > 0
            ? renderTodoList(...getTodos())
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
}
