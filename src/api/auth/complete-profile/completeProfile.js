import { request } from "../../request";
import AuthService from "../../../utilities/auth-service";
import {authToken} from "../../../utilities/constant"

export async function completeProfile({firstName, lastName, dateOfBirth, bio, userId }) {
    const body = {
        userId,
        firstName,
        lastName,
        dateOfBirth,
        bio,
    };
    const accessToken = new AuthService(authToken).getCookie();
    const customHeaders = {
        'Content-Type': 'application/json',
        'accesstoken': `Bearer ${accessToken}`,
      };
    const response = await request({ url: 'http://localhost:4005/v1/auth/complete-profile', headers: customHeaders, init: { body, method: 'put' } })
    return response;
}