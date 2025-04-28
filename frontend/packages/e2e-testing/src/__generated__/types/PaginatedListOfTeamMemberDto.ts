import type { TeamMemberDto } from './TeamMemberDto'

export type PaginatedListOfTeamMemberDto = {
  /**
   * @type integer, int32
   */
  page: number
  /**
   * @type integer, int32
   */
  totalPages: number
  /**
   * @type integer, int32
   */
  totalItems: number
  /**
   * @type array
   */
  result: TeamMemberDto[]
}