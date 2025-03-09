import { Button } from "../ui/button.js";
import { Checkbox } from "../ui/checkbox.js";
import { Element } from "../ui/element.js";
import { Select } from "../ui/select.js";
import { Textbox } from "../ui/textbox.js";
import { Window } from "../ui/window.js";

let listName;
let listNames;
let container;

export const initTodo = () => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    listName = (todos && Object.keys(todos)?.[0]) || "Todo";
    listNames = todos && Object.keys(todos)?.length ? Object.keys(todos) : ["Todo"];
    const ui = render(listNames);
    if (!ui) return;
    container = Element("div", { class: "sf-todo" }, ...ui);
    document.body.appendChild(
        Window(
            "Todo",
            {
                "Clear checked": clearChecked,
                "Uncheck all": uncheckAll,
                "Delete List": deleteList,
            },
            container
        )
    );
    todos?.[listName]?.forEach((todo) => {
        addListItem(todo.text, todo.checked);
    });
};

const render = (listNames) => {
    const form = Element(
        "form",
        {},
        Textbox({
            name: "add",
            "aria-label": "New todo item",
            autocomplete: "off",
        }),
        Button({ type: "submit" }, "Add")
    );
    form.addEventListener("submit", addTodoItem);

    return [
        Select(
            listName,
            {
                ...listNames.reduce((acc, curr) => ({ ...acc, [curr]: curr }), {}),
                "+add": "+ Add new list",
            },
            changeList
        ),
        form,
        Element("ul", { class: "todo-list" }),
    ];
};

const changeList = (value) => {
    if (value === "+add") {
        const newList = prompt("List name");
        if (!newList) return;
        listName = newList;
        listNames.push(listName);
        container.innerHTML = "";
        render(listNames).map((child) => container.appendChild(child));
        saveList();
    } else {
        listName = value;
    }
    document.querySelector(".todo-list").innerHTML = "";
    const todos = JSON.parse(localStorage.getItem("todos"));
    todos?.[listName]?.forEach((todo) => {
        addListItem(todo.text, todo.checked);
    });
};

const deleteList = () => {
    if (!confirm(`Are you sure you want to delete "${listName}"?`)) return;
    const allTodos = JSON.parse(localStorage.getItem("todos"));
    delete allTodos[listName];
    localStorage.setItem("todos", JSON.stringify(allTodos));
    listNames.splice(listNames.indexOf(listName), 1);
    listName = listNames[0];
    container.innerHTML = "";
    render(listNames).map((child) => container.appendChild(child));
};

const addTodoItem = (formEvent) => {
    formEvent.preventDefault();
    const todoText = new FormData(formEvent.srcElement).get("add");
    if (!todoText) return;
    addListItem(todoText);
    formEvent.target.reset();
    saveList();
};

const addListItem = (todoText, checked = false) => {
    const todoList = document.querySelector(".todo-list");
    const li = Element("li", {}, Checkbox({ name: todoText, checked }, todoText));
    li.firstElementChild.firstElementChild.addEventListener("change", saveList);
    todoList.appendChild(li);
};

const clearChecked = () => {
    document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        if (checkbox.checked) {
            const li = checkbox.parentElement.parentElement;
            li.parentElement.removeChild(li);
        }
    });
    saveList();
};

const uncheckAll = () => {
    document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
        checkbox.checked = false;
    });
    saveList();
};

const saveList = () => {
    let allTodos = JSON.parse(localStorage.getItem("todos"));
    const todos = Array.from(document.querySelectorAll("input[type='checkbox']")).map(
        (todoItem) => ({ text: todoItem.name, checked: todoItem.checked })
    );
    allTodos = { ...allTodos, [listName]: todos };
    localStorage.setItem("todos", JSON.stringify(allTodos));
};
