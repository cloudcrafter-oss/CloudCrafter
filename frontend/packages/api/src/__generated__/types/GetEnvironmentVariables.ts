import type { StackEnvironmentVariableDto } from './StackEnvironmentVariableDto'

export type GetEnvironmentVariablesPathParams = {
  /**
   * @type string, uuid
   */
  stackId: string
}

export type GetEnvironmentVariablesQueryParams = {
  /**
   * @default false
   * @type boolean | undefined
   */
  includeInherited?: boolean
  /**
   * @default false
   * @type boolean | undefined
   */
  includeSecrets?: boolean
}

/**
 * @description OK
 */
export type GetEnvironmentVariables200 = StackEnvironmentVariableDto[]

export type GetEnvironmentVariablesQueryResponse = GetEnvironmentVariables200

export type GetEnvironmentVariablesQuery = {
  Response: GetEnvironmentVariables200
  PathParams: GetEnvironmentVariablesPathParams
  QueryParams: GetEnvironmentVariablesQueryParams
  Errors: any
}