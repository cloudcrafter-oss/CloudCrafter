import type { ChannelOutputLogLineLevel } from './ChannelOutputLogLineLevel'

export type DeploymentLogDto = {
  /**
   * @type string
   */
  message: string
  level: ChannelOutputLogLineLevel
  /**
   * @type string, date-time
   */
  at: string
}