const server = require('socket.io')();
const firstTodos = require('./data');
const Todo = require('./todo');

// This is going to be our fake 'database' for this application
// Parse all default Todo's from db
const DB = firstTodos.map((t) => {
  // Form new Todo objects
  return new Todo((title = t.title));
});

server.on('connection', (client) => {
  // Sends a message to the client to reload all todos
  const reloadTodos = () => {
    server.emit('load', DB);
  };

  const addTodo = (todo) => {
    server.emit('add', todo);
  };

  // Accepts when a client makes a new todo
  client.on('make', (t) => {
    // Make a new todo
    const newTodo = new Todo((title = t.title));

    // Push this newly created todo to our database
    DB.push(newTodo);

    // Send the latest todos to the client
    addTodo(newTodo);
  });

  client.on('delete', title => {
    for (let i = 0; i < DB.length; i++) {
      if (DB[i].title === title) {
        DB.splice(i, 1);
        break;
      }
    }
    console.log(`Removing item "${title}"`);
  });

  // Send the DB downstream on connect
  reloadTodos();
});

console.log('Waiting for clients to connect');
server.listen(3003);
