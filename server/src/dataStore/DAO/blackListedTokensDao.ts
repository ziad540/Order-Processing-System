import { BlackListedToken } from "../../../../shared/types.js";

export interface BlackListedTokensDao {
    isTokenBlackListed(token: string): Promise<boolean>;
    blackListToken(token: string): Promise<BlackListedToken>;

}