export type CreateStackEnvironmentVariableGroupCommand = {
  /**
   * @minLength 1
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