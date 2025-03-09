import { Desktop } from "./desktop/desktop.js";
// import { Solitaire } from "./solitaire/solitaire.js";
import { initTodo } from "./todo/todo.js";

addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(Desktop());
    initTodo();
});
