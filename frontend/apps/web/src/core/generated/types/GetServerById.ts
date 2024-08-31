import type { ServerDetailDto } from './ServerDetailDto'

export type GetServerByIdPathParams = {
	/**
	 * @type string, uuid
	 */
	id: string
}
/**
 * @description OK
 */
export type GetServerById200 = ServerDetailDto
/**
 * @description OK
 */
export type GetServerByIdQueryResponse = ServerDetailDto
export type GetServerByIdQuery = {
	Response: GetServerByIdQueryResponse
	PathParams: GetServerByIdPathParams
}
