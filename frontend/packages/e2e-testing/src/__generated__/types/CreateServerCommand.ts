export type CreateServerCommand = {
  /**
   * @type string
   */
  name: string
  /**
   * @type string, uuid
   */
  teamId?: string | null
}