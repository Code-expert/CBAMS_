import { PrismaClient } from "@prisma/client";
import { scheduleTaskReminder, cancelTaskReminder } from "../services/taskCron.js";

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
        { dueDate: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
      prisma.task.count({ where: { userId, status: 'PENDING' } }),
      prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.task.count({ where: { userId } })
    ]);

    res.json({ pending, inProgress, completed, total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
        description,
        time,
        dueDate: dueDate ? new Date(dueDate) : new Date(),
        priority: priority || 'MEDIUM',
        icon: icon || 'Sprout',
        reminderEnabled: reminderEnabled !== false,
        userId: req.user.id
      },
      include: {
        user: {
          include: { profile: true }
        }
      }
    });

    // Schedule SMS reminder if enabled
    if (task.reminderEnabled && task.user.profile?.phone) {
      scheduleTaskReminder(task);
    }

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(time && { time }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(priority && { priority }),
        ...(status && { status }),
        ...(icon && { icon }),
        ...(reminderEnabled !== undefined && { reminderEnabled })
      },
      include: {
        user: { include: { profile: true } }
      }
    });

    // Reschedule reminder if time/date changed
    if (time || dueDate) {
      cancelTaskReminder(task.id);
      if (task.reminderEnabled && task.user.profile?.phone) {
        scheduleTaskReminder(task);
      }
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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

    // Cancel reminder if task completed
    if (status === 'COMPLETED') {
      cancelTaskReminder(task.id);
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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

    cancelTaskReminder(Number(id));

    await prisma.task.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
