import type { PaginatedListOfUserDto } from './PaginatedListOfUserDto'

export type GetUsersQueryParams = {
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
export type GetUsers200 = PaginatedListOfUserDto

export type GetUsersQueryResponse = GetUsers200

export type GetUsersQuery = {
  Response: GetUsers200
  QueryParams: GetUsersQueryParams
  Errors: any
}