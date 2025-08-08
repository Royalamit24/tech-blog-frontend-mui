import AuthService from "./auth-service";
import {authToken} from './constant';

 export function checkAuthentication(){
    const token = new AuthService(authToken).getCookie();
    return token;
}
