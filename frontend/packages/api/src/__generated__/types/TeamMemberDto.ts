export type TeamMemberDto = {
  /**
   * @type string, uuid
   */
  id: string
  /**
   * @type string
   */
  email: string | null
  /**
   * @type string
   */
  fullName: string | null
}