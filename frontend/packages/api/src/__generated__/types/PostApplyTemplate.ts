import type { ProblemDetails } from './ProblemDetails'

export type PostApplyTemplatePathParams = {
  /**
   * @type string, uuid
   */
  stackId: string
  /**
   * @type string, uuid
   */
  templateId: string
}

export type PostApplyTemplateQueryParams = {
  /**
   * @default false
   * @type boolean | undefined
   */
  overrideExisting?: boolean
}

/**
 * @description OK
 */
export type PostApplyTemplate200 = any

/**
 * @description Bad Request
 */
export type PostApplyTemplate400 = ProblemDetails

export type PostApplyTemplateMutationResponse = PostApplyTemplate200

export type PostApplyTemplateMutation = {
  Response: PostApplyTemplate200
  PathParams: PostApplyTemplatePathParams
  QueryParams: PostApplyTemplateQueryParams
  Errors: PostApplyTemplate400
}