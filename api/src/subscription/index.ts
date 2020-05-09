import { PubSub } from 'apollo-server'

import * as SESSION_EVENTS from './session'

export const EVENTS = {
  SESSION: SESSION_EVENTS,
}

export default new PubSub()
