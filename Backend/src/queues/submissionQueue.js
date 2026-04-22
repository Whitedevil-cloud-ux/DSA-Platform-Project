const { Queue } = require('bullmq');

const submissionQueue = new Queue('submission', {
  connection: {
    host: 'localhost',
    port: 6379,
  },
});

// Log queue events for debugging
submissionQueue.on('waiting', (job) => {
  console.log(`📦 Job ${job.id} is waiting in queue`);
});

submissionQueue.on('active', (job) => {
  console.log(`⚙️  Job ${job.id} started processing`);
});

submissionQueue.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

submissionQueue.on('failed', (job, err) => {
  console.log(`❌ Job ${job.id} failed: ${err.message}`);
});

module.exports = submissionQueue;