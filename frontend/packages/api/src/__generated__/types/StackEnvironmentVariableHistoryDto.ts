import type { EnvironmentVariableType } from './EnvironmentVariableType'

export type StackEnvironmentVariableHistoryDto = {
  /**
   * @type string, uuid
   */
  id: string
  /**
   * @type string, uuid
   */
  stackId: string
  /**
   * @type string, uuid
   */
  environmentVariableId: string
  /**
   * @type string
   */
  key: string
  /**
   * @type string
   */
  oldValue?: string | null
  /**
   * @type string
   */
  newValue?: string | null
  /**
   * @type boolean
   */
  isSecret: boolean
  /**
   * @type integer
   */
  type: EnvironmentVariableType
  /**
   * @type string
   */
  changeType: string
  /**
   * @type string
   */
  groupName?: string | null
  /**
   * @type string, date-time
   */
  timestamp: string
  /**
   * @type string
   */
  userId?: string | null
  /**
   * @type string
   */
  userName?: string | null
}