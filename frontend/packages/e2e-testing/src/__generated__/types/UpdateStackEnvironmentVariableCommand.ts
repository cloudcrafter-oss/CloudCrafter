import type { EnvironmentVariableType } from './EnvironmentVariableType'

export type UpdateStackEnvironmentVariableCommand = {
  /**
   * @type string
   */
  key: string
  /**
   * @type string
   */
  value: string
  /**
   * @type integer
   */
  type: EnvironmentVariableType
  /**
   * @type boolean
   */
  isSecret: boolean
  /**
   * @type string, uuid
   */
  groupId?: string | null
}