export type GetExportEnvironmentVariablesPathParams = {
  /**
   * @type string, uuid
   */
  stackId: string
}

export type GetExportEnvironmentVariablesQueryParams = {
  /**
   * @default false
   * @type boolean | undefined
   */
  includeSecrets?: boolean
}

/**
 * @description OK
 */
export type GetExportEnvironmentVariables200 = any

export type GetExportEnvironmentVariablesQueryResponse = GetExportEnvironmentVariables200

export type GetExportEnvironmentVariablesQuery = {
  Response: GetExportEnvironmentVariables200
  PathParams: GetExportEnvironmentVariablesPathParams
  QueryParams: GetExportEnvironmentVariablesQueryParams
  Errors: any
}