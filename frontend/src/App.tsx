import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import { useRecoilState } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import { useEffect, useState } from "react";
import useAuth from "./hooks/useAuth";
import { Loader } from "./components/Loader";
import NotFound from "./pages/NotFound";
import Username from "./pages/Username";
import Post from "./pages/Post";

function App() {
  const [user, setUser] = useRecoilState(userAtom);
  const [isLoading, setisLoading] = useState(true);

  const { checkSession } = useAuth();

  const checkUserSession = async () => {
    const response = await checkSession();

    if (response.success) {
      setUser(response.data.data);
    }

    setisLoading(false);
  };

  useEffect(() => {
    checkUserSession();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full h-screen">
        <Loader size={32} stroke={2} />
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="/post/:postId" element={<Post />} />
          <Route path="activity" element={<Activity />} />
          <Route path="/:username" element={<Profile />} />
          <Route
            path="/google-signup/:username"
            element={user ? <Navigate to="/" /> : <Username />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="login" element={user ? <Navigate to="/" /> : <Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
