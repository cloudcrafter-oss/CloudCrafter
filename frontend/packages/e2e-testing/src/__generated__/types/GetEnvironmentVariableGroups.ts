import type { StackEnvironmentVariableGroupDto } from './StackEnvironmentVariableGroupDto'

export type GetEnvironmentVariableGroupsPathParams = {
  /**
   * @type string, uuid
   */
  stackId: string
}

/**
 * @description OK
 */
export type GetEnvironmentVariableGroups200 = StackEnvironmentVariableGroupDto[]

export type GetEnvironmentVariableGroupsQueryResponse = GetEnvironmentVariableGroups200

export type GetEnvironmentVariableGroupsQuery = {
  Response: GetEnvironmentVariableGroups200
  PathParams: GetEnvironmentVariableGroupsPathParams
  Errors: any
}