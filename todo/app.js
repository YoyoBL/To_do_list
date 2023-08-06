import { createTodoData } from "./data.js";
const $displayArea = document.getElementById("display-area");

let todoListId = 1;

let todos = localStorage.getItem("todos-collection")
   ? JSON.parse(localStorage.getItem("todos-collection"), (key, value) => {
        if (key === "createdAt") {
           return new Date(value);
        }
        return value;
     })
   : [];

let html = ` 
<div class="col-8 mx-auto">
<nav aria-label="breadcrumb">
   <ol class="breadcrumb">
     <li class="breadcrumb-item active" aria-current="page">Home</li>
   </ol>
 </nav>
</div>
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
<div id="todo-collection" class="row mt-2 g-3">

</div>
`;

$displayArea.innerHTML = html;

const $todoCollection = document.getElementById("todo-collection");

function renderTodoItems({ id, isActive: checked, title }) {
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

function renderTodoLists(todos = []) {
   let html = `<ul data-todo-list-id="${todoListId++}" class="list-group">`;

   for (let todo of todos) {
      html += renderTodoItems(todo);
   }

   html += "</ul>";
   return html;
}

function previewTodos() {
   if (todos) {
      let html = "";
      for (let i in todos) {
         let todoListHtml = renderTodoLists(todos[i]);
         html += `
         <div class="col-6">
            <div class="p-3 bg-light">
               <div id="todo-list" class="col">
                  ${todoListHtml}
               </div>
            </div>
         </div>
         `;
      }
      $todoCollection.innerHTML = html;
   }
}

const $createNewTodosBtn = document.getElementById("create-new-todos-btn");

function saveTodosCollections() {
   localStorage.setItem("todos-collection", JSON.stringify(todos));
}

function loadTodoHtml(isForPreview) {
   let html = ` 
   <div class="col-8 mx-auto">
<nav aria-label="breadcrumb">
   <ol class="breadcrumb">
     <li class="breadcrumb-item"><a href="./index.html">Home</a></li>
     <li class="breadcrumb-item active" aria-current="page">Todos</li>
   </ol>
 </nav>
</div>
   <div class="col-md-8 mx-auto">
  ${
     isForPreview
        ? ""
        : ` <div class="row">
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
      </div>`
  }
      <div class="row">
         <div id="todo-list" class="col">
           
         </div>
      </div>

   
</div>`;

   return html;
}

$createNewTodosBtn.addEventListener("click", () => {
   $displayArea.innerHTML = loadTodoHtml();

   renderAppTodoLists(todos.length + 1);
});

previewTodos();

window.addEventListener("click", (e) => {
   if (e.target.closest(".list-group")) {
      $displayArea.innerHTML = loadTodoHtml();
      let datasetId = e.target.closest(".list-group").dataset.todoListId;
      renderAppTodoLists(datasetId);
   }
});

// RENDER-----------------------------------------------------------------------------
// RENDER-----------------------------------------------------------------------------
// RENDER-----------------------------------------------------------------------------
// RENDER-----------------------------------------------------------------------------
// RENDER-----------------------------------------------------------------------------
function renderAppTodoLists(todoId) {
   const { getTodos, changeTodoComplete, addTodo, removeAllTodos, removeTodo } =
      createTodoData(todoId);

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

   function renderTodoList(todos = [], todoArray) {
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

      if (getTodos().length > 0) {
         todos[todoId - 1] = getTodos();
         saveTodosCollections();
      }
   }

   function handleTodoComplete(id) {
      changeTodoComplete(id);
      renderTodoApp();
   }

   function renderRemoveTodo(id) {
      removeTodo(id);
      renderTodoApp();
   }
   renderTodoApp();
}
