const CronJob = require("cron").CronJob;
const borrowsCheckCycle =
    require("./Controllers/BorrowsController").bansCheckCycle;

exports.checkDeadlines = () => {
    const job = new CronJob("*/10 * * * *", function () {
        console.log("Checking to ban members...");
        const d = new Date();

        borrowsCheckCycle();
        console.log("Every tenth minute:", d.toLocaleString());
        // console.log(count[0]);
        // console.log(count[1]);
        console.log("Check done!");
    });

    job.start();
};
