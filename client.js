const server = io('http://localhost:3003/');
const list = document.getElementById('todo-list');

// NOTE: These are all our globally scoped functions for interacting with the server
// This function adds a new todo from the input
function add() {
    console.warn(event);
    const input = document.getElementById('todo-input');

    // Emit the new todo as some data to the server
    server.emit('make', {
        title: input.value
    });

    // Clear the input
    input.value = '';
    input.focus();
}

function markComplete(ev) {
    ev.target.labels[0].style.textDecoration = ev.target.checked ? 'line-through' : 'none';
}

function removeItem(ev) {
    const current = ev.target.offsetParent;
    list.removeChild(current);

    server.emit('delete', current.firstChild.textContent);
}

function render(todo) {
    console.log(todo);
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item';

    const checkboxLabel = document.createElement('label');
    checkboxLabel.className = 'form-check-label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input';
    checkbox.addEventListener('click', markComplete);
    checkboxLabel.appendChild(checkbox);

    const listItemText = document.createTextNode(todo.title);
    checkboxLabel.appendChild(listItemText);

    const deleteButton = document.createElement('button');
    deleteButton.className = 'close';
    deleteButton.setAttribute('aria-label', 'Close');
    deleteButton.innerHTML = '<span aria-hidden="true">&times;</span>';
    deleteButton.addEventListener('click', removeItem);

    listItem.appendChild(checkboxLabel);
    listItem.appendChild(deleteButton);
    list.append(listItem);
}

// NOTE: These are listeners for events from the server
// This event is for (re)loading the entire list of todos from the server
server.on('load', (todos) => {
    todos.forEach((todo) => render(todo));
});

server.on('add', (todo) => {
    render(todo);
});
