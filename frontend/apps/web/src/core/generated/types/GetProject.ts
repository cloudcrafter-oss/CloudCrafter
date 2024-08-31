import type { ProjectDto } from './ProjectDto'

export type GetProjectPathParams = {
	/**
	 * @type string, uuid
	 */
	id: string
}
/**
 * @description OK
 */
export type GetProject200 = ProjectDto
/**
 * @description Not Found
 */
export type GetProject404 = any
/**
 * @description OK
 */
export type GetProjectQueryResponse = ProjectDto
export type GetProjectQuery = {
	Response: GetProjectQueryResponse
	PathParams: GetProjectPathParams
	Errors: GetProject404
}
