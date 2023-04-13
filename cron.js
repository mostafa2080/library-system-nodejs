const CronJob = require("cron").CronJob;
const borrowsCheckCycle =
  require("./Controllers/BorrowsController").bansCheckCycle;
const {
  checkingUnReturnedReadBooks,
} = require("./Controllers/ReadingBooksController");

exports.banAndUnbanMembers = () => {
  const job = new CronJob("0 */10 * * * *", function () {
    console.log("Starting ban/unban cycle...");
    const d = new Date();

    borrowsCheckCycle();
    console.log("Current time: ", d.toLocaleString());
  });

  const readingReturnJob = new CronJob("0 */10 * * * *", () => {
    console.log("Checking For The Return Of Books....");
    checkingUnReturnedReadBooks();
    console.log("End Of Checking");
  });

  job.start();
  readingReturnJob.start();
};
