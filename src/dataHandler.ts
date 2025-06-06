interface Todo {
    _id?: string;
    title: string;
    completed?: boolean;
}
interface IDs {
    editID: string;
    deleteID: string;
    listItemID: string;
    todoID: string;
}
interface FetchOptions {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
}

const todoList = document.querySelector('#todoList');
const form = document.querySelector('#form');
const todoUserInput = document.querySelector('#todoUserInput') as HTMLInputElement;

if (!form) throw new Error('No form selected');
if (!todoUserInput) throw new Error('No user input');

async function fetcher(url: string, options?: FetchOptions): Promise<any> {
    const response: Response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return await response.json();
}

async function getTodos(): Promise<void> {
    try {
        const data: Todo[] = await fetcher('/getTodos', { method: 'GET' });
        displayTodoList(data);
    } catch (e) {
        console.error(e);
    }
}
function resetTodosInput(): void {
    if (!todoUserInput) throw new Error('No user input');
    todoUserInput.innerHTML = '';
}
function deleteTodo(todo: Todo, listItemID: string, deleteID: string): void {
    const deleteButton = document.querySelector(`#${deleteID}`);
    const listItem = document.querySelector(`#${listItemID}`);

    if (!deleteButton) throw new Error('No delete button');
    deleteButton.addEventListener('click', async (): Promise<void> => {
        await fetcher(`/${todo._id}`, { method: 'DELETE' });
        if (!listItem) throw new Error('No list item');
        console.log(`${todo.title} deleted`);
        listItem.remove();
    })
}
function editTodo(todo: Todo, todoID: string, editID: string): void {
    const editButton = document.querySelector(`#${editID}`);

    if (!editButton) throw new Error('No edit button');
    editButton.addEventListener('click', async (): Promise<void> => {
        const options: FetchOptions = {
            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title: todoUserInput.value})
        }
        console.log(options);
        const data: Todo = await fetcher(`/${todo._id}`, options);
        const todoIndex = document.querySelector(`#${todoID}`);
        if (!todoIndex) throw new Error('No list item');
        todoIndex.innerHTML = '';
        todoIndex.insertAdjacentHTML('beforeend', data.title);
        resetTodosInput();
    });
}
function buildIds(todo: Todo): IDs {
    return {
        editID: 'edit_' + todo._id,
        deleteID: 'delete_' + todo._id,
        listItemID: 'listItem_' + todo._id,
        todoID: 'todo_' + todo._id
    }
}
function buildTemplate(todo: Todo, ids: IDs): string {
    return `<li class="list-group-item" id="${ids.listItemID}">
                <div class="row">
                    <div class="col-md-4" id="${ids.todoID}">${todo.title}</div>
                    <div class="col-md-4"></div>
                    <div class="col-md-4 text-right">
                        <button type="button" class="btn btn-secondary" id="${ids.editID}">Edit</button>
                        <button type="button" class="btn btn-danger" id="${ids.deleteID}">Delete</button>
                    </div>
                </div>
            </li>`
}
function displayTodoList(data: Todo[]): void {
    data.forEach((todo: Todo): void => {
        let ids: IDs = buildIds(todo);
        if (!todoList) throw new Error('No list item');
        todoList.insertAdjacentHTML('beforeend', buildTemplate(todo, ids));
        editTodo(todo,ids.todoID, ids.editID);
        deleteTodo(todo, ids.listItemID, ids.deleteID);
    });
}
form.addEventListener('submit', async (event: Event): Promise<void> => {
    event.preventDefault();
    const fetchOptions: FetchOptions = {
        method: 'POST',
        body: JSON.stringify({ title: todoUserInput.value}),
        headers: { 'Content-Type': 'application/json' }
    }
    try {
        const todo: Todo = await fetcher('/', fetchOptions);
        let ids: IDs = buildIds(todo);
        console.log(todo, ids);
        if (!todoList) throw new Error('No list item');
        console.log('Data: ' + todo.title + 'Ids: ' + ids.listItemID);
        todoList.insertAdjacentHTML('beforeend', buildTemplate(todo, ids));
        editTodo(todo,ids.todoID, ids.editID);
        deleteTodo(todo, ids.listItemID, ids.deleteID);
        resetTodosInput();
    } catch (e) {
        console.error(e);
    }
})

getTodos();