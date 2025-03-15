import { Button } from "../../system/ui/button.js";
import { Checkbox } from "../../system/ui/checkbox.js";
import { Element } from "../../system/ui/element.js";
import { Select } from "../../system/ui/select.js";
import { Textbox } from "../../system/ui/textbox.js";
import { Window } from "../../system/ui/window.js";

export class Todo {
    constructor() {
        const todos = JSON.parse(localStorage.getItem("todos"));
        this.listName = (todos && Object.keys(todos)?.[0]) || "Todo";
        this.listNames = todos && Object.keys(todos)?.length ? Object.keys(todos) : ["Todo"];
        this.container = Element("div", { class: "sf-todo" }, ...this.render());
        const windowEl = Window(
            "Todo",
            {
                "Clear checked": this.clearChecked,
                "Uncheck all": this.uncheckAll,
                "Delete List": this.deleteList,
            },
            this.container
        );
        if (!windowEl) return;
        document.body.appendChild(windowEl);
        todos?.[this.listName]?.forEach((todo) => {
            this.addListItem(todo.text, todo.checked);
        });
    }

    render = () => {
        const form = Element(
            "form",
            {},
            Textbox({
                name: "add",
                "aria-label": "New todo item",
                autocomplete: "off",
            }),
            Button({ type: "submit" }, null, "Add")
        );
        form.addEventListener("submit", this.addTodoItem);

        return [
            Select(
                this.listName,
                {
                    ...this.listNames.reduce((acc, curr) => ({ ...acc, [curr]: curr }), {}),
                    "+add": "+ Add new list",
                },
                this.changeList
            ),
            form,
            Element("ul", { class: "todo-list" }),
        ];
    };

    changeList = (value) => {
        if (value === "+add") {
            const newList = prompt("List name");
            if (!newList) return;
            this.listName = newList;
            this.listNames.push(this.listName);
            this.container.innerHTML = "";
            this.render().map((child) => this.container.appendChild(child));
            this.saveList();
        } else {
            this.listName = value;
        }
        document.querySelector(".todo-list").innerHTML = "";
        const todos = JSON.parse(localStorage.getItem("todos"));
        todos?.[this.listName]?.forEach((todo) => {
            this.addListItem(todo.text, todo.checked);
        });
    };

    deleteList = () => {
        if (this.listNames.length === 1) {
            alert("You can't delete your final list.");
            return;
        }
        if (!confirm(`Are you sure you want to delete "${this.listName}"?`)) return;
        const allTodos = JSON.parse(localStorage.getItem("todos"));
        delete allTodos[this.listName];
        localStorage.setItem("todos", JSON.stringify(allTodos));
        this.listNames.splice(this.listNames.indexOf(this.listName), 1);
        this.listName = this.listNames[0];
        this.container.innerHTML = "";
        this.render().map((child) => this.container.appendChild(child));
    };

    addTodoItem = (formEvent) => {
        formEvent.preventDefault();
        const todoText = new FormData(formEvent.srcElement).get("add");
        if (!todoText) return;
        this.addListItem(todoText);
        formEvent.target.reset();
        this.saveList();
    };

    addListItem = (todoText, checked = false) => {
        const todoList = document.querySelector(".todo-list");
        const li = Element("li", {}, Checkbox({ name: todoText, checked }, todoText));
        li.firstElementChild.firstElementChild.addEventListener("change", this.saveList);
        todoList.appendChild(li);
    };

    clearChecked = () => {
        document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
            if (checkbox.checked) {
                const li = checkbox.parentElement.parentElement;
                li.parentElement.removeChild(li);
            }
        });
        this.saveList();
    };

    uncheckAll = () => {
        document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = false;
        });
        this.saveList();
    };

    saveList = () => {
        let allTodos = JSON.parse(localStorage.getItem("todos"));
        const todos = Array.from(document.querySelectorAll("input[type='checkbox']")).map(
            (todoItem) => ({ text: todoItem.name, checked: todoItem.checked })
        );
        allTodos = { ...allTodos, [this.listName]: todos };
        localStorage.setItem("todos", JSON.stringify(allTodos));
    };
}
