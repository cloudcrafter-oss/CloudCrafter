import type { EnvironmentVariableType } from './EnvironmentVariableType'

export type StackEnvironmentVariableDto = {
  /**
   * @type string, uuid
   */
  id: string
  /**
   * @type string, uuid
   */
  stackId: string
  /**
   * @type string
   */
  key: string
  /**
   * @type string
   */
  value: string
  /**
   * @type boolean
   */
  isSecret: boolean
  /**
   * @type integer
   */
  type: EnvironmentVariableType
  /**
   * @type string, date-time
   */
  createdAt: string
  /**
   * @type string, date-time
   */
  lastModifiedAt?: string | null
  /**
   * @type string
   */
  groupName?: string | null
  /**
   * @type boolean
   */
  isInherited: boolean
}