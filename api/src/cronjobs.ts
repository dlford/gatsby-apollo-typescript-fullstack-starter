import { CronJob } from 'cron'
import models from './models'

const sessionScrubInterval =
  process.env.SCRUB_SESSIONS_CRON || '0 * * * *'

export const sessionScrubber = new CronJob(
  sessionScrubInterval,
  () => {
    models.Session.deleteMany({
      exp: { $gte: Math.floor(Date.now() / 1000) },
    })
  },
)
