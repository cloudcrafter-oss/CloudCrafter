export type CreateStackFromSourceProviderCommand = {
  /**
   * @minLength 3
   * @type string
   */
  name: string
  /**
   * @type string, uuid
   */
  providerId: string
  /**
   * @minLength 1
   * @type string
   */
  repositoryId: string
  /**
   * @minLength 1
   * @type string
   */
  branch: string
  /**
   * @type string
   */
  path: string
  /**
   * @type string, uuid
   */
  environmentId: string
  /**
   * @type string, uuid
   */
  serverId: string
  /**
   * @type string
   */
  repository: string
}