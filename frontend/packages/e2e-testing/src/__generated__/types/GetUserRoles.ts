import type { RoleDto } from './RoleDto'

/**
 * @description OK
 */
export type GetUserRoles200 = RoleDto[]

export type GetUserRolesQueryResponse = GetUserRoles200

export type GetUserRolesQuery = {
  Response: GetUserRoles200
  Errors: any
}