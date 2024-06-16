export interface UserType {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePic: string;
  followers: string[];
  following: string[];
  requestSent: string[];
  requestReceived: string[];
  bio: string;
  isPrivate: boolean;
  isFrozen: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PostType {
  _id: string;
  content: string;
  userId: string;
  createdAt: string;
  likes: string[];
  reposts: string[];
  replies: [];
  media: {
    _id: string;
    mediaUrl: string;
    type: string;
  }[];
  updatedAt: string;
}
