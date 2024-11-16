export type TokenDto2 = {
    /**
     * @type string
    */
    accessToken: string;
    /**
     * @type string
    */
    refreshToken: string;
    /**
     * @type string, date-time
    */
    validTo: string;
    /**
     * @type integer, int32
    */
    expiresIn: number;
};