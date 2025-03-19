import type { StackDetailDto } from './StackDetailDto'

export type GetStackDetailPathParams = {
  /**
   * @type string, uuid
   */
  id: string
}

/**
 * @description OK
 */
export type GetStackDetail200 = StackDetailDto

/**
 * @description Not Found
 */
export type GetStackDetail404 = any

export type GetStackDetailQueryResponse = GetStackDetail200

export type GetStackDetailQuery = {
  Response: GetStackDetail200
  PathParams: GetStackDetailPathParams
  Errors: GetStackDetail404
}