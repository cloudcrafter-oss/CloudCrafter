export type GitApplicationSourceDto = {
  /**
   * @type string
   */
  repository: string
  /**
   * @type string
   */
  path?: string | null
  /**
   * @type string
   */
  branch?: string | null
}