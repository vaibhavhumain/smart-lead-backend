import cron from 'node-cron';
import Lead from '../models/Lead.js';

export function startSyncJob() {
  cron.schedule('*/5 * * * *', async () => {
    console.log('[SyncJob] Starting sync run at', new Date().toISOString());

    while (true) {
      const lead = await Lead.findOneAndUpdate(
        { status: 'Verified', synced: false },
        { $set: { synced: true } },
        { new: true }
      );
      if (!lead) break;
      console.log(`[CRM Sync] Sending verified lead ${lead.name} to Sales Team...`);
    }

    console.log('[SyncJob] Finished run at', new Date().toISOString());
  });
}
