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
  refreshTokenExpires: string
  /**
   * @type integer, int32
   */
  refreshTokenExpiresIn: number
}