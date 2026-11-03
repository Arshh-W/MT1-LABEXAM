import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Arsh Rana",
        status: "Pending",
        priority: "High"
    },
    {
        id: 2,
        taskName: "Database Schema Design",
        assignedTo: "Ashwani Bhardwaj",
        status: "Completed",
        priority: "Critical"
    },
    {
        id: 3,
        taskName: "Create REST API",
        assignedTo: "Akarsh Bhardwaj",
        status: "In Progress",
        priority: "Medium"
    }
];

app.get('/tasks', (req, res) => {
    res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
    const { id, taskName, assignedTo, status, priority } = req.body;

    if (!id || !taskName || !assignedTo || !status || !priority) {
        return res.status(400).json({ error: "All fields are required (id, taskName, assignedTo, status, priority)" });
    }

    const newTask = { id, taskName, assignedTo, status, priority };
    tasks.push(newTask);

    res.status(201).json({
        message: "Task added successfully",
        task: newTask
    });
});

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    const { taskName, assignedTo, status, priority } = req.body;
    
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        taskName: taskName || tasks[taskIndex].taskName,
        assignedTo: assignedTo || tasks[taskIndex].assignedTo,
        status: status || tasks[taskIndex].status,
        priority: priority || tasks[taskIndex].priority
    };

    res.status(200).json({
        message: "Task updated successfully",
        task: tasks[taskIndex]
    });
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    const deletedTask = tasks.splice(taskIndex, 1);
    res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask[0]
    });
});

app.listen(PORT, () => {
    console.log(`Express Server running at http://localhost:${PORT}`);
});