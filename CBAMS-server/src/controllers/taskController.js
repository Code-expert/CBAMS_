import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @desc Get all tasks for logged-in user
 * @route GET /tasks
 * @access Private
 */
export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: [
        { dueDate: "asc" },
        { createdAt: "desc" }
      ]
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get task statistics
 * @route GET /tasks/stats
 * @access Private
 */
export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [pending, inProgress, completed, total] = await Promise.all([
      prisma.task.count({ where: { userId, status: "PENDING" } }),
      prisma.task.count({ where: { userId, status: "IN_PROGRESS" } }),
      prisma.task.count({ where: { userId, status: "COMPLETED" } }),
      prisma.task.count({ where: { userId } })
    ]);

    res.json({ pending, inProgress, completed, total });
  } catch (error) {
    console.error("Error fetching task stats:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Create a task
 * @route POST /tasks
 * @access Private
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, time, dueDate, priority, icon, reminderEnabled } = req.body;

    if (!title || !time) {
      return res.status(400).json({ message: "Title and time are required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description ?? null,
        time,
        dueDate: dueDate ? new Date(dueDate) : new Date(),
        priority: priority || "MEDIUM",
        icon: icon || "Sprout",
        reminderEnabled: reminderEnabled !== false,
        userId: req.user.id
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update a task
 * @route PUT /tasks/:id
 * @access Private
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, time, dueDate, priority, status, icon, reminderEnabled } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: { id: Number(id), userId: req.user.id }
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (time !== undefined) data.time = time;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : existingTask.dueDate;
    if (priority !== undefined) data.priority = priority;
    if (status !== undefined) data.status = status;
    if (icon !== undefined) data.icon = icon;
    if (reminderEnabled !== undefined) data.reminderEnabled = reminderEnabled;

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data
    });

    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update task status
 * @route PUT /tasks/:id/status
 * @access Private
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingTask = await prisma.task.findFirst({
      where: { id: Number(id), userId: req.user.id }
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: { status }
    });

    res.json(task);
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Delete a task
 * @route DELETE /tasks/:id
 * @access Private
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTask = await prisma.task.findFirst({
      where: { id: Number(id), userId: req.user.id }
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
