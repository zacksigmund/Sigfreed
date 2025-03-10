import { Desktop } from "./desktop/desktop.js";
// import { Solitaire } from "./solitaire/solitaire.js";
import { Todo } from "./todo/todo.js";

addEventListener("DOMContentLoaded", () => {
    document.body.appendChild(Desktop());
    new Todo();
});
