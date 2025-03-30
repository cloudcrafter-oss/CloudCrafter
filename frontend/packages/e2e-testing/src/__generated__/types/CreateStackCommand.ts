export type CreateStackCommand = {
  /**
   * @minLength 3
   * @type string
   */
  name: string
  /**
   * @minLength 1
   * @type string
   */
  gitRepository: string
  /**
   * @type string, uuid
   */
  environmentId: string
  /**
   * @type string, uuid
   */
  serverId: string
}