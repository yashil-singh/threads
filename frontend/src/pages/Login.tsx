import React, { useState } from "react";
import LoginImage from "@/assets/login.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/Icon";
import Brand from "@/components/Brand";
import useAuth from "@/hooks/useAuth";
import useShowToast from "@/hooks/useShowToast";
import { Loader } from "@/components/Loader";
import { useSetRecoilState } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import { BASE_URL } from "@/helpers/constants";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const setUser = useSetRecoilState(userAtom);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useShowToast();

  const resetFields = () => {
    setUsername("");
    setPassword("");
  };

  const emptyFields = () => {
    if (username.trim().length === 0 || password.trim().length === 0) {
      return true;
    }

    return false;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    const response = await login({ username, password });

    if (response.success) {
      const data = response?.data;
      showToast({ title: data.message });
      setUser(data.data);
      resetFields();
    } else {
      const errors = response?.errors;

      errors.map((error: string) =>
        showToast({ title: error, variant: "destructive" })
      );
    }

    setIsSubmitting(false);
  };

  const handleGoogleSignin = () => {
    window.location.href = `${BASE_URL}/auth/google/callback`;
  };

  return (
    <>
      <div className="absolute top-0 hidden md:flex justify-center overflow-hidden max-w-full -z-10">
        <img
          src={LoginImage}
          alt="thread bands"
          style={{ aspectRatio: "auto 1785 / 510", minWidth: "1785px" }}
        />
      </div>
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col max-w-[350px] w-full gap-5 items-center p-2 md:p-0">
          <Link to="/">
            <Brand />
          </Link>
          <h1 className="font-bold text-lg text-center">
            Log in to your account
          </h1>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="flex flex-col space-y-2 w-full"
          >
            <Input
              placeholder="Username or email"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <Button
              className="h-[56px]"
              disabled={emptyFields() || isSubmitting}
            >
              {isSubmitting ? <Loader /> : <p>Log in</p>}
            </Button>
          </form>
          <Link
            to="/forgot-password"
            className="text-center text-muted-foreground"
          >
            Forgot Password?
          </Link>
          <div className="flex w-full justify-between items-center text-muted-foreground">
            <Separator className="max-w-[40%] bg-muted-foreground" />
            <p>or</p>
            <Separator className="max-w-[40%] bg-muted-foreground" />
          </div>
          <Button
            variant="outline"
            className="w-full h-[56px]"
            disabled={isSubmitting}
            onClick={handleGoogleSignin}
          >
            <Icon icon="google" className="mr-4" />
            Continue with Google
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
