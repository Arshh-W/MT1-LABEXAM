import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tasks = [];//In Array memory

const renderPage = (title, content) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | Employee Task Management</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <main class="page-card">
        <p class="eyebrow">Employee Task Management</p>
        ${content}
    </main>
</body>
</html>`;

const server = http.createServer((req, res) => {
    const method = req.method;
    const url = req.url;

    // GET / : Welcome message in HTML format
    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderPage('Welcome', `
        <h1>Welcome to Employee Task Management.</h1>
        <p>A simple place to organize employee tasks and keep track of what needs to get done.</p>
        <a class="button" href="/home">Visit the home page</a>`));
    } 
    // GET : List of employee tasks in JSON format
    else if (url === '/tasks' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    } 
    // GET: Employee task management application information
    else if (url === '/about' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(renderPage('About', `
        <h1>About this app</h1>
        <p>This lightweight Node.js application helps teams manage employee tasks. Tasks are stored in memory, so no database is needed.</p>
        <a class="text-link" href="/home">Back to the home page</a>`));
    }
    // GET: Serve the shared stylesheet
    else if (url === '/styles.css' && method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'styles.css');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Server Error while reading the stylesheet.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
    } 
    // GET: Serve HTML page using the FS module
    else if (url === '/home' && method === 'GET') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 - Internal Server Error while reading the file.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } 
    // POST:  Add a new task record
    else if (url === '/add-task' && method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const newTask = JSON.parse(body);
                
      
                if (!newTask.id || !newTask.taskName || !newTask.assignedTo || !newTask.status) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: "Missing required fields: id, taskName, assignedTo, status" }));
                }

                tasks.push(newTask);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Task added successfully", task: newTask }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Invalid JSON format" }));
            }
        });
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "404 - Route Not Found" }));
    }
});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});