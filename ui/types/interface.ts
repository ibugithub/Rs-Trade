interface User {
  email: string;
  signUp_by: "email" | "google" | "facebook" | "microsoft";
}
export interface ProfileInterface {
  user: User;
  name: string;
  Display_name: string | null;
  profile_picture: string | null;
  created_at: string; 
  updated_at: string;
}