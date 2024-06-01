import React, { useState } from "react";
import LoginImage from "@/assets/login.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/Icon";
import Brand from "@/components/Brand";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const emptyFields = () => {
    if (username.trim().length === 0 || password.trim().length === 0) {
      return true;
    }

    return false;
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    console.log("SUBMITTED");
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
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button className="h-[56px]" disabled={emptyFields()}>
              Log in
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
          <Button variant="outline" className="w-full h-[56px]">
            <Icon icon="google" className="mr-4" />
            Continue with Google
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
