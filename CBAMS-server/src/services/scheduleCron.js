import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { sendSMS } from "./smsService.js";

const prisma = new PrismaClient();
const jobs = new Map();

export const scheduleReminder = (schedule) => {
  const date = new Date(schedule.date);
  const phone = schedule.user?.profile?.phone;

  if (!phone) {
    console.log(`⚠️ No phone number for user ${schedule.userId}, skipping SMS`);
    return;
  }

  cancelSchedule(schedule.id);

  const newJobs = [];

  // One-time reminder
  const cronTime = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
    date.getMonth() + 1
  } *`;
  newJobs.push(
    cron.schedule(cronTime, async () => {
      await sendSMS(
        phone,
        `⏰ Reminder: ${schedule.title} - ${schedule.description || ""}`
      );
    })
  );

  // Daily
  if (schedule.repeat === "DAILY") {
    const dailyCron = `${date.getMinutes()} ${date.getHours()} * * *`;
    newJobs.push(
      cron.schedule(dailyCron, async () => {
        await sendSMS(phone, `📅 Daily Reminder: ${schedule.title}`);
      })
    );
  }

  // Weekly
  if (schedule.repeat === "WEEKLY") {
    const weeklyCron = `${date.getMinutes()} ${date.getHours()} * * ${date.getDay()}`;
    newJobs.push(
      cron.schedule(weeklyCron, async () => {
        await sendSMS(phone, `📅 Weekly Reminder: ${schedule.title}`);
      })
    );
  }
  jobs.set(schedule.id, newJobs);
};

// Cancel cron jobs for a schedule
export const cancelSchedule = (scheduleId) => {
  if (jobs.has(scheduleId)) {
    jobs.get(scheduleId).forEach((job) => job.stop());
    jobs.delete(scheduleId);
    console.log(`🛑 Cron jobs cleared for schedule ${scheduleId}`);
  }
};

// Initialize all schedules when server boots
export const initSchedules = async () => {
  const schedules = await prisma.schedule.findMany({
    include: { user: { include: { profile: true } } },
  });

  schedules.forEach(scheduleReminder);
};
