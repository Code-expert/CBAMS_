// import cron from "node-cron";
// import { PrismaClient } from "@prisma/client";
// import { sendSMS } from "./smsService.js";

// const prisma = new PrismaClient();
// const taskJobs = new Map();

// export const scheduleTaskReminder = (task) => {
//   const dueDate = new Date(task.dueDate);
//   const [hours, minutes] = task.time.split(':');
//   dueDate.setHours(Number(hours), Number(minutes), 0, 0);
  
//   const phone = task.user?.profile?.phone;
//   if (!phone) {
//     console.log(`⚠️ No phone number for user ${task.userId}, skipping SMS`);
//     return;
//   }

//   cancelTaskReminder(task.id);

//   // Schedule reminder 30 minutes before
//   const reminderTime = new Date(dueDate.getTime() - 30 * 60 * 1000);
  
//   if (reminderTime > new Date()) {
//     const cronTime = `${reminderTime.getMinutes()} ${reminderTime.getHours()} ${reminderTime.getDate()} ${reminderTime.getMonth() + 1} *`;
    
//     const job = cron.schedule(cronTime, async () => {
//       try {
//         const currentTask = await prisma.task.findUnique({ where: { id: task.id } });

//         if (currentTask && currentTask.status !== 'COMPLETED') {
//           await sendSMS(
//             phone,
//             `⏰ Task Reminder: "${task.title}" is due at ${task.time}. Priority: ${task.priority}.`
//           );

//           await prisma.task.update({
//             where: { id: task.id },
//             data: { reminderSent: true }
//           });

//           console.log(`✅ Task reminder sent for: ${task.title}`);
//         }
//       } catch (error) {
//         console.error(`❌ Error sending task reminder:`, error.message);
//       }
//     });

//     taskJobs.set(task.id, job);
//     console.log(`📅 Task reminder scheduled for: ${task.title}`);
//   }
// };

// export const cancelTaskReminder = (taskId) => {
//   if (taskJobs.has(taskId)) {
//     taskJobs.get(taskId).stop();
//     taskJobs.delete(taskId);
//     console.log(`🛑 Task reminder cancelled for task ${taskId}`);
//   }
// };

// export const initTaskReminders = async () => {
//   console.log('🔄 Initializing task reminders...');
  
//   const tasks = await prisma.task.findMany({
//     where: {
//       status: { not: 'COMPLETED' },
//       reminderEnabled: true,
//       reminderSent: false
//     },
//     include: {
//       user: { include: { profile: true } }
//     }
//   });

//   tasks.forEach(scheduleTaskReminder);
//   console.log(`✅ Initialized ${tasks.length} task reminders`);
// };
