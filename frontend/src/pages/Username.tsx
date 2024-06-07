import SubmitBtn from "@/components/SubmitBtn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import useShowToast from "@/hooks/useShowToast";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Username: React.FC = () => {
  const { googleSignup } = useAuth();
  const { showToast } = useShowToast();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const handleSignUp = async () => {
    if (username.trim().length > 0) {
      const response = await googleSignup(username);

      if (response.success) {
        showToast({ description: response?.data.message });
        navigate("/", { replace: true });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const errors = response?.errors;
        errors.map((error) => {
          showToast({ variant: "destructive", description: error });
        });
      }
    } else {
      setUsernameError("Username is required.");
    }
  };
  return (
    <>
      <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px]">
        <CardHeader>
          <CardDescription>Please choose a username.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Label className="text-red-500">{usernameError}</Label>
          <SubmitBtn
            text="Continue"
            onClick={handleSignUp}
            className="w-full"
          />
        </CardContent>
      </Card>
    </>
  );
};

export default Username;
