import type { FilterCriterea } from './FilterCriterea'
import type { PaginatedListOfTeamMemberDto } from './PaginatedListOfTeamMemberDto'

export type GetTeamMembersPathParams = {
  /**
   * @type string, uuid
   */
  teamId: string
}

export type GetTeamMembersQueryParams = {
  /**
   * @type array | undefined
   */
  Filters?: FilterCriterea[]
  /**
   * @type integer | undefined, int32
   */
  Page?: number
  /**
   * @type integer | undefined, int32
   */
  PageSize?: number
}

/**
 * @description OK
 */
export type GetTeamMembers200 = PaginatedListOfTeamMemberDto

export type GetTeamMembersQueryResponse = GetTeamMembers200

export type GetTeamMembersQuery = {
  Response: GetTeamMembers200
  PathParams: GetTeamMembersPathParams
  QueryParams: GetTeamMembersQueryParams
  Errors: any
}