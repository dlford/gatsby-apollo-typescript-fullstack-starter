import { CronJob } from 'cron'
import models from './models'
import { scrubSessionsCron } from './constants'

export const sessionScrubber = new CronJob(scrubSessionsCron, () => {
  models.Session.deleteMany({
    exp: { $gte: Math.floor(Date.now() / 1000) },
  })
})
