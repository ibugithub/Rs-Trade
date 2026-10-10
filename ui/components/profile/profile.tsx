'use client';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, KeyRound, LoaderCircle, UserRound } from 'lucide-react';
import { AxiosReqInstance } from '../accounts/utils/axiosInstance';
import { useAppSelector } from '@/configs/redux/hooks';
import type { ProfileInterface } from '@/types/interface';

export function formatProfileDate(value?: string | null) {
  if (!value) return 'Not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const Profile = () => {
  const account = useAppSelector(state => state.auth.loogedInUser);
  const [profile, setProfile] = useState<ProfileInterface | null>(null);
  const [fetching, setFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchProfile = useCallback(async (signal?: AbortSignal) => {
    setFetching(true);
    setFetchError(null);
    setImageFailed(false);
    try {
      if (!localStorage.getItem('accessToken')) {
        setFetchError('Please sign in to view your profile.');
        return;
      }
      const response = await AxiosReqInstance().get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/profile/getProfile/`, { signal, timeout: 30000 });
      if (signal?.aborted) return;
      if (!response.data?.user?.email) throw new Error('Profile details unavailable');
      setProfile(response.data);
    } catch (error) {
      if (signal?.aborted || axios.isCancel(error)) return;
      const unauthorized = axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0);
      setFetchError(unauthorized ? 'Your session has expired. Please sign in again.' : 'We could not load your profile. Please try again.');
    } finally {
      if (!signal?.aborted) setFetching(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchProfile(controller.signal);
    return () => controller.abort();
  }, [fetchProfile]);

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (saving) return;
    setResult(null);
    if (newPassword !== confirmPassword) {
      setResult({ type: 'error', message: 'The new passwords do not match.' });
      return;
    }
    setSaving(true);
    try {
      await AxiosReqInstance().post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/profile/changePassword/`, { old_password: oldPassword, new_password: newPassword }, { timeout: 30000 });
      setResult({ type: 'success', message: 'Your password has been changed.' });
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (error) {
      const message = axios.isAxiosError<{ message?: string }>(error) ? error.response?.data?.message : undefined;
      setResult({ type: 'error', message: message || 'Could not change your password. Please try again.' });
    } finally { setSaving(false); }
  };

  const name = profile?.Display_name?.trim() || account?.name?.trim() || 'My Account';
  const method = profile?.user?.signUp_by?.toLowerCase();
  const provider = ({ google: 'Google', facebook: 'Facebook', microsoft: 'Microsoft', email: 'Email and password' } as Record<string, string>)[method ?? ''] || 'Not available';
  const inputClass = 'min-h-12 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50';

  return (
    <main className="min-h-[calc(100svh_-_64px)] bg-gray-50 px-4 py-8 text-gray-900 sm:py-12 lg:min-h-[calc(100svh_-_90px)]">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm text-gray-500 hover:text-blue-700 focus-visible:outline-blue-600"><ArrowLeft size={16} aria-hidden="true" />Back to website</Link>
        <section aria-labelledby="profile-title" className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="h-1 bg-blue-600" />
          <div className="p-6 sm:p-8">
            <h1 id="profile-title" className="text-2xl font-bold tracking-tight">My Profile</h1>
            <p className="mt-2 text-sm text-gray-500">Your RS Trade account details.</p>
            {fetching ? <div role="status" className="flex items-center justify-center gap-3 py-16 text-sm text-gray-600"><LoaderCircle size={22} className="text-blue-600 motion-safe:animate-spin" aria-hidden="true" />Loading your profile...</div> : fetchError ? <div className="mt-7 rounded-xl border border-gray-200 bg-gray-50 p-5"><p role="alert" className="text-sm leading-6 text-gray-700">{fetchError}</p><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => void fetchProfile()} className="min-h-11 rounded-lg bg-yellow-300 px-4 text-sm font-semibold hover:bg-yellow-500">Try Again</button><Link href="/accounts/signin" className="inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-semibold text-blue-700 hover:bg-blue-50">Sign In</Link></div></div> : profile && <>
              <div className="mt-7 flex items-center gap-4 border-b border-gray-200 pb-6">
                {profile.profile_picture && !imageFailed ? <Image src={profile.profile_picture} alt="Your profile photo" width={64} height={64} unoptimized onError={() => setImageFailed(true)} className="h-16 w-16 shrink-0 rounded-full object-cover" /> : <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700"><UserRound size={28} aria-hidden="true" /></span>}
                <div className="min-w-0"><h2 className="break-words text-xl font-semibold">{name}</h2><p className="mt-1 break-all text-sm text-gray-500">{profile.user.email}</p></div>
              </div>
              <dl className="mt-6 grid gap-6 sm:grid-cols-2">{[['Email address', profile.user.email], ['Sign-in method', provider], ['Joined', formatProfileDate(profile.created_at)], ['Last updated', formatProfileDate(profile.updated_at)]].map(([label, value]) => <div key={label}><dt className="text-xs font-medium text-gray-500">{label}</dt><dd className="mt-2 break-words text-sm font-medium text-gray-900">{value}</dd></div>)}</dl>
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h2 className="flex items-center gap-2 text-base font-semibold"><KeyRound size={18} className="text-blue-700" aria-hidden="true" />Account security</h2>
                {method === 'email' ? <>
                  <p className="mt-2 text-sm leading-6 text-gray-500">Update the password you use to sign in.</p>
                  {!showPasswordForm && <button type="button" onClick={() => { setShowPasswordForm(true); setResult(null); }} className="mt-4 min-h-11 rounded-lg border border-gray-300 px-4 text-sm font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-blue-600">Change Password</button>}
                  {showPasswordForm && <form onSubmit={handleChangePassword} aria-busy={saving} className="mt-5 space-y-4">
                    {[{ id: 'current-password', label: 'Current password', value: oldPassword, set: setOldPassword, autoComplete: 'current-password' }, { id: 'new-password', label: 'New password', value: newPassword, set: setNewPassword, autoComplete: 'new-password' }, { id: 'confirm-password', label: 'Confirm new password', value: confirmPassword, set: setConfirmPassword, autoComplete: 'new-password' }].map(field => <div key={field.id}><label htmlFor={field.id} className="mb-2 block text-sm font-medium">{field.label}</label><input id={field.id} type="password" value={field.value} onChange={event => field.set(event.target.value)} autoComplete={field.autoComplete} required minLength={field.id === 'current-password' ? undefined : 8} disabled={saving} aria-describedby={field.id === 'new-password' ? 'profile-password-hint' : undefined} className={inputClass} />{field.id === 'new-password' && <p id="profile-password-hint" className="mt-2 text-xs text-gray-500">Use at least 8 characters.</p>}</div>)}
                    <div className="flex flex-wrap gap-3"><button type="submit" disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-yellow-300 px-5 text-sm font-semibold hover:bg-yellow-500 disabled:cursor-wait disabled:opacity-60">{saving ? <><LoaderCircle size={16} className="motion-safe:animate-spin" aria-hidden="true" />Saving...</> : 'Save Password'}</button><button type="button" disabled={saving} onClick={() => { setShowPasswordForm(false); setOldPassword(''); setNewPassword(''); setConfirmPassword(''); setResult(null); }} className="min-h-11 rounded-lg px-4 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-60">Cancel</button></div>
                  </form>}
                </> : <p className="mt-2 text-sm leading-6 text-gray-500">{method && method !== 'email' ? `You sign in with ${provider}. Manage your password through that account.` : 'Password settings are unavailable until your sign-in method is confirmed.'}</p>}
                <div aria-live="polite">{result && <p role={result.type === 'error' ? 'alert' : undefined} className={`mt-4 rounded-lg border px-4 py-3 text-sm leading-6 ${result.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-700'}`}>{result.message}</p>}</div>
              </div>
            </>}
          </div>
        </section>
      </div>
    </main>
  );
};
