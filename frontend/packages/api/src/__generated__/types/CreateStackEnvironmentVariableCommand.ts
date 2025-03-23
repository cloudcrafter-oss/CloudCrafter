import type { EnvironmentVariableType } from './EnvironmentVariableType'

export type CreateStackEnvironmentVariableCommand = {
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
}