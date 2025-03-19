export type SimpleGithubProviderDto = {
  /**
   * @type string, uuid
   */
  id: string
  /**
   * @type string
   */
  name: string
  /**
   * @type boolean
   */
  isConnected: boolean | null
  /**
   * @type boolean
   */
  hasInstallation: boolean
  /**
   * @type string, date-time
   */
  createdAt: string
  /**
   * @type string
   */
  appUrl: string | null
}