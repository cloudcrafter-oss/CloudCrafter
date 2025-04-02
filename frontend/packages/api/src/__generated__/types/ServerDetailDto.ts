export type ServerDetailDto = {
  /**
   * @type string, uuid
   */
  id: string
  /**
   * @type string
   */
  name: string
  /**
   * @type string
   */
  ipAddress: string
  /**
   * @type string
   */
  agentKey?: string | null
  /**
   * @type string
   */
  dockerNetworkName: string
}