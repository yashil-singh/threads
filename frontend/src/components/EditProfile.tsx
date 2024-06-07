import React, { useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/atoms/userAtom";
import ProfileImg from "./ProfileImg";
import { Camera } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import useUsers from "@/hooks/useUsers";
import useShowToast from "@/hooks/useShowToast";
import SubmitBtn from "./SubmitBtn";
import { useNavigate } from "react-router-dom";

const userSchema = z.object({
  name: z.string().min(1, "Name is required."),
  username: z.string().min(5, "Username must be at least 5 characters long"),
  bio: z.string(),
  isPrivate: z.boolean(),
});

const EditProfile: React.FC = () => {
  const user = useRecoilValue(userAtom);

  const navigate = useNavigate();

  const { updateProfile } = useUsers();
  const { showToast } = useShowToast();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
      isPrivate: user?.isPrivate || false,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [profileUrl, setProfileUrl] = useState<string>(user?.profilePic || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setProfileUrl(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const onEditProfile = async (formData: z.infer<typeof userSchema>) => {
    setIsSubmitting(true);
    const { name, username, bio, isPrivate } = formData;

    const response = await updateProfile({
      name,
      username,
      bio,
      isPrivate,
      profilePic: profileUrl,
    });

    if (response.success) {
      const data = response.data;

      showToast({
        description: data.message,
      });

      setTimeout(() => {
        navigate("/@" + username);
        window.location.reload();
      }, 1000);
    } else {
      setIsSubmitting(false);
      const errors = response.errors;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errors.map((error: any) => {
        showToast({
          description: error,
          variant: "destructive",
        });
      });
    }
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onEditProfile)}
            className="space-y-2"
          >
            <Input
              type="file"
              accept="image"
              placeholder="Name"
              className="hidden"
              ref={fileRef}
              onChange={handleFileChange}
            />
            <div className="max-w-[100px] m-auto flex flex-col items-center gap-2">
              {profileUrl === "" ? (
                <>
                  <button
                    className="rounded-full bg-accent size-[100px] flex items-center justify-center"
                    type="button"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Camera />
                  </button>
                </>
              ) : (
                <div onClick={() => fileRef.current?.click()}>
                  <ProfileImg
                    height={100}
                    width={100}
                    url={profileUrl}
                    fallBackText={user?.username.charAt(0) || ""}
                    font={38}
                  />
                </div>
              )}
              <Label
                onClick={() => fileRef.current?.click()}
                className="text-center"
              >
                Choose Image
              </Label>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Bio"
                      {...field}
                      className="h-[150px] max-h-[150px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel htmlFor="private-profile">
                      Private Profile
                    </FormLabel>
                    <Switch
                      id="private-profile"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <SubmitBtn
          text="Done"
          onClick={form.handleSubmit(onEditProfile)}
          className="w-full p-6"
          isSubmitting={isSubmitting}
        />
      </CardFooter>
    </Card>
  );
};

export default EditProfile;
