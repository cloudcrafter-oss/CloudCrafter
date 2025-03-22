export type UpdateStackEnvironmentVariableCommand = {
  /**
   * @type string, uuid
   */
  stackId: string
  /**
   * @type string, uuid
   */
  id: string
  /**
   * @type string
   */
  key: string
  /**
   * @type string
   */
  value: string
}