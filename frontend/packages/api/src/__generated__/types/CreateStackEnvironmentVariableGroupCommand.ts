export type CreateStackEnvironmentVariableGroupCommand = {
  /**
   * @maxLength 100
   * @type string
   */
  name: string
  /**
   * @maxLength 500
   * @type string
   */
  description?: string | null
}