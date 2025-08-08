import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { authToken } from "./constant";

class AuthService {
    constructor(TOKEN_COOKIES_KEY) {
        this.token = TOKEN_COOKIES_KEY;
    }
    
    getCookie() {
        return Cookie.get(this.token);
    }
    
    setCookie(value) {
        Cookie.set(this.token, value, { expires: 1 });
    }
    
    removeCookie() {
        Cookie.remove(this.token);
    }

    static getCurrentUserId() {
        const token = Cookie.get(authToken);
        if (!token) return null;
        
        try {
            const decoded = jwtDecode(token);
            return decoded.userId;
        } catch (e) {
            console.error('Error decoding token:', e);
            return null;
        }
    }
}

export default AuthService;