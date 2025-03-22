export type CreateStackEnvironmentVariableCommand = {
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
}