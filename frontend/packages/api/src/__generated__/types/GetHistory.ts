import type { StackEnvironmentVariableHistoryDto } from './StackEnvironmentVariableHistoryDto'

export type GetHistoryPathParams = {
  /**
   * @type string, uuid
   */
  stackId: string
}

export type GetHistoryQueryParams = {
  /**
   * @default null
   * @type string | undefined, date-time
   */
  startDate?: string
  /**
   * @default null
   * @type string | undefined, date-time
   */
  endDate?: string
}

/**
 * @description OK
 */
export type GetHistory200 = StackEnvironmentVariableHistoryDto[]

export type GetHistoryQueryResponse = GetHistory200

export type GetHistoryQuery = {
  Response: GetHistory200
  PathParams: GetHistoryPathParams
  QueryParams: GetHistoryQueryParams
  Errors: any
}