import { PrismaClient } from "@prisma/client";
import { scheduleReminder } from "../services/scheduleCron.js";
import { cancelSchedule } from "../services/scheduleCron.js";
import { sendSMS } from "../services/smsService.js";

const prisma = new PrismaClient();

/**
 * @desc Create a schedule
 * @route POST /schedules
 * @access Private
 */
export const createSchedule = async (req, res) => {
  try {
    const { title, description, date, repeat } = req.body;

    // Save schedule
    const schedule = await prisma.schedule.create({
      data: {
        title,
        description,
        date: new Date(date),
        repeat,
        userId: req.user.id,
      },
      include: { user: { include: { profile: true } } },
    });

    // ✅ Immediately send confirmation SMS
    const phone = schedule.user?.profile?.phone;
    if (phone) {
      const repeatText =
        schedule.repeat === "DAILY"
          ? "daily"
          : schedule.repeat === "WEEKLY"
          ? "weekly"
          : "one-time";

      await sendSMS(
        phone,
        `✅ Your reminder "${schedule.title}" has been set successfully.\n` +
          `You will receive ${repeatText} reminders starting from ${new Date(
            schedule.date
          ).toLocaleString()}`
      );
    }

    // ⏰ Start cron job for future reminders
    scheduleReminder(schedule);

    res
      .status(201)
      .json({
        message: "Schedule created and confirmation SMS sent",
        schedule,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get logged-in user's schedules
 * @route GET /schedules
 * @access Private
 */
export const getSchedules = async (req, res) => {
  try {
    const schedules = await prisma.schedule.findMany({
      where: { userId: req.user.id },
      orderBy: { date: "asc" },
    });
    res.json(schedules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Update a schedule
 * @route PUT /schedules/:id
 * @access Private
 */
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, repeat } = req.body;

    const schedule = await prisma.schedule.update({
      where: { id: Number(id), userId: req.user.id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        repeat,
      },
      include: { user: { include: { profile: true } } },
    });

    scheduleReminder(schedule);

    res.json({ message: "✅ Schedule updated", schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Delete a schedule
 * @route DELETE /schedules/:id
 * @access Private
 */
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.schedule.delete({
      where: { id: Number(id), userId: req.user.id },
    });

    cancelSchedule(Number(id));

    res.json({ message: "🗑️ Schedule deleted and reminder stopped" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
