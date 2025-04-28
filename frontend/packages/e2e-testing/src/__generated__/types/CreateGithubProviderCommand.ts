export type CreateGithubProviderCommand = {
  /**
   * @type string
   */
  code: string
  /**
   * @type string, uuid
   */
  teamId?: string | null
}