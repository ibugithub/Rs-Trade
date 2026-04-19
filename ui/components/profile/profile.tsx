'use client';
import React, { useEffect, useState } from 'react';
import { AxiosReqInstance } from '../accounts/utils/axiosInstance';
import { AxiosError } from 'axios';
import { ProfileInterface } from '@/types/interface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';


export const Profile = () => {
  const protectedRoute = AxiosReqInstance();
  const [profile, setProfile] = useState<ProfileInterface | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchProfile = async () => {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
      const url = `${backendUrl}/api/profile/getProfile/`;
      try {
        const response = await protectedRoute.get(url);
        setProfile(response.data);
        console.log('the response data is', response.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChangePassword = async () => {
    setLoading(true);
    setMessage('');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const url = `${backendUrl}/api/profile/changePassword/`;
    try {
      const response = await protectedRoute.post(url, {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setMessage(response.data.message);
      setOldPassword('');
      setNewPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setMessage(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-6 px-8 text-center">
          <h1 className="text-3xl font-bold text-white">Profile</h1>
        </div>

        {/* Profile Content */}
        <div className="p-8 flex flex-col items-center space-y-6">
          {profile?.profile_picture && (
            <Image
              src={profile.profile_picture}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
          )}

          <h2 className="text-2xl font-semibold text-gray-800">
            {profile?.Display_name || 'No Display Name'}
          </h2>

          <p className="text-gray-600 text-lg">
            <span className="font-medium">Email:</span> {profile?.user.email}
          </p>

          <p className="text-gray-600 text-lg">
            <span className="font-medium">Joined:</span>{' '}
            {new Date(profile?.created_at).toLocaleDateString()}
          </p>

          <p className="text-gray-600 text-lg">
            <span className="font-medium">Last Updated:</span>{' '}
            {new Date(profile?.updated_at).toLocaleDateString()}
          </p>
        </div>

        {/* Buttons Section */}
        <div className="px-8 py-6 bg-gray-50 flex flex-col sm:flex-row items-center gap-4">
          <Button
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300"
          >
            Edit Profile
          </Button>
          {profile?.user.signUp_by === 'email' && (
            <Button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition duration-300"
            >
              Change Password
            </Button>
          )}
        </div>

        {profile?.user.signUp_by === 'email' && (
          showPasswordForm && (
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Change Password</h2>

              <Input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="mb-3"
              />

              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mb-3"
              />

              <Button
                onClick={handleChangePassword}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300 w-full"
              >
                {loading ? 'Changing...' : 'Submit'}
              </Button>
              {message && <p className="text-red-500 mt-2">{message}</p>}
            </div>
          )
        )
        }
      </div>
    </div>
  );
};
