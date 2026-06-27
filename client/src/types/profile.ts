export interface ProfilePost {
  id: string;
  image: string;
}

export interface ProfileData {
  name: string;
  username: string;
  bio: string;
  website: string;
isVerified:boolean;
  followers: string;
  following: string;

  avatar: string;
  cover: string;

  posts: ProfilePost[];
}