import { useState } from "react";

export function useConnectHome() {

    const [isOpenToLogin, setIsOpenToLogin] = useState(false);
    const handleLogin = () => {
        setIsOpenToLogin(true)
    }

    return {
        isOpenToLogin,
        setIsOpenToLogin,
        handleLogin
    }
}