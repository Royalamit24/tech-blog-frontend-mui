
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useConnectHome } from '../Hook';
import { useNavigate } from 'react-router-dom'
import { checkAuthentication } from "../../utilities/common"
import Sidebar from "../../components/Sidebar";
import { Stack } from "@mui/material";
import Feed from "../../components/Feed";
import RightBar from "../../components/Rightbar";
import { UserHomeHook } from "./Hook";
import { useDebounce } from "react-use";
import { toast } from "react-toastify";

const UserHome = () => {

  const {searchTerm, setSearchTerm} = UserHomeHook();
  const [searchKey, setSearchkey] = useState('');

 const handleSearchTerm = (key)=> {
  setSearchkey(key)
 }

  useDebounce(() => {
    if (searchTerm.length >= 2 || searchTerm.length === 0) {
        const reg = /^[A-Za-z\s]*$/
        const str = reg.test(searchTerm);
        if (str) {
          handleSearchTerm(searchTerm.trim());
        } else {
            toast.error("Please use only alphabetical character ")
        }
    }
},
    500,
    [searchTerm]
)


  const navigate = useNavigate();
  useEffect(() => {
    const token = checkAuthentication()
    if (!token) {
      navigate(`/`)
    }
  })

  

  const { handleLogin } = useConnectHome();

  return (
    <>
      <Navbar handleLogin={handleLogin} setSearchTerm={setSearchTerm} searchKey={searchKey} searchTerm={searchTerm} />
      <Stack direction="row" spacing={2} justifyContent="space-between" >
        <Sidebar />
        <Feed searchKey={searchKey} />
        <RightBar />
      </Stack>
    </>
  )
}

export default UserHome;