export type TokenDto = {
	/**
	 * @type string
	 */
	accessToken: string
	/**
	 * @type string
	 */
	refreshToken: string
	/**
	 * @type string, date-time
	 */
	validTo: string
	/**
	 * @type integer, int32
	 */
	readonly expiresIn: number
}
