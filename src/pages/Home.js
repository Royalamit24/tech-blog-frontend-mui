import { Stack } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import RightBar from "../components/Rightbar";
import Add from "../components/Add";
import LoginModal from "./Auth/Login";
import Navbar from "../components/Navbar";
import { useConnectHome } from './Hook';
import {UserHomeHook} from './Main/Hook'

const Home = () => {

    const {searchTerm, setSearchTerm} = UserHomeHook();
    const {
        isOpenToLogin,
        setIsOpenToLogin,
        handleLogin
    } = useConnectHome();

    return (
        <>
            <Navbar handleLogin={handleLogin}  setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>
            <Stack direction="row" spacing={2} justifyContent="space-between" >
                <Sidebar />
                <Feed searchTerm={searchTerm} />
                <RightBar />
            </Stack>
            {/* <Add /> */}
            <LoginModal isOpenToLogin={isOpenToLogin} setIsOpenToLogin={setIsOpenToLogin} handleLogin={handleLogin} />
        </>
    )
}

export default Home;