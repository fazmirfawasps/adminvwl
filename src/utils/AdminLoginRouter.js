import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAdmin } from "../services/adminservices";
import { Outlet } from "react-router-dom";
import AdminLogin from "../pages/adminLogin/AdminLogin";
import { setAdmin } from "../redux/ducks/adminSlice";
const AdminLoginRouter = () => {
  const dispatch = useDispatch();
  const [isLoggedIn, setIsloggedIn] = useState(true);
  const [isLoad, setIsload] = useState(false);
  // useEffect(() => {
  //   setIsload(true);
  //   const adminId = true;
  //   const adminToken = true;                                                                                                                                                                                                                                                                                                    
  //   const verifyAdmin = async () => {
  //     try {
  //       const { data } = await getAdmin();
  //       if (data?.data?._id === adminId) {
  //         setIsload(false);                                                                                                                                                                                                                                                                                                                                   
  //         setIsloggedIn(true);
  //         data.data.isLoggedIn = true;
  //         dispatch(setAdmin(data.data));
  //       } else {
  //         setIsload(false);
  //         setIsloggedIn(false);
  //         localStorage.clear();
  //       }                                                                                                                                                                                                               
  //     } catch (error) {                                                                                                                                                                                                                                                                                                                                                            
  //       setIsload(false);
  //       setIsloggedIn(false);
  //       localStorage.clear();
  //       console.log(error);
  //     }
  //   };
  //   if (adminToken) {
  //     setIsload(true);
  //     verifyAdmin();
  //   } else {
  //     setIsload(false);
  //   }
  // }, []);

  return (
    <>
      {isLoad ? <h1>Loading...</h1> : isLoggedIn ? <Outlet /> : <AdminLogin />}
    </>
  );
};

export default AdminLoginRouter;
