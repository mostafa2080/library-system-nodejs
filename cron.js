const CronJob = require("cron").CronJob;
const borrowsCheckCycle =
    require("./Controllers/BorrowsController").bansCheckCycle;

exports.banAndUnbanMembers = () => {
    const job = new CronJob("0 */10 * * * *", function () {
        console.log("Starting ban/unban cycle...");
        const d = new Date();

        borrowsCheckCycle();
        console.log("Current time: ", d.toLocaleString());
    });

    job.start();
};
