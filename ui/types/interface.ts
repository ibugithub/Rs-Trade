interface User {
  is_staff?: boolean;
  admin_url?: string | null;
  name?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  signUp_by: 'email' | 'google' | 'facebook' | 'microsoft';
}
export interface ProfileInterface {
  is_staff?: boolean;
  admin_url?: string | null;
  first_name?: string;
  last_name?: string;
  email?: string;
  user: User;
  name: string;
  Display_name: string | null;
  profile_picture: string | null;
  created_at: string;
  updated_at: string;
}
