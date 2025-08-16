'use client';

import { getUser, updateUser } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function Profile() {
  const { data, status } = useSession();
  const router = useRouter();
  const [userFireData, setUserFireData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const email = data?.user?.email;

  useEffect(() => {
    if (status === 'loading') return;

    if (!email) {
      router.push('/login');
      return;
    }

    getUser(email).then((userData) => {
      if (userData) {
        setUserFireData(userData);
      } else {
        router.push('/profile/edit');
      }
    });
  }, [email, status, router]);

  const handleChange = (field, value) => {
    setUserFireData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (email && userFireData) {
      await updateUser(email, userFireData);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading' || !userFireData) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex flex-row items-center gap-4 mb-4">
        <img
          src={data?.user?.image || ''}
          alt="Profile Picture"
          className="h-14 w-14 rounded-full ring-2 ring-pink-400"
        />
        <div>
          <h1 className="text-2xl font-semibold">{data?.user?.name}</h1>
          <p className="text-sm text-gray-500">{data?.user?.email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className="bg-gradient-to-tr from-pink-400 to-pink-300 text-white font-semibold block p-2 text-center w-full rounded-md"
        >
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white font-semibold p-2 rounded-md w-full"
        >
          Logout
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {['phone', 'age', 'city', 'country', 'occupation', 'mentoring'].map((field) => (
          <div key={field}>
            <label htmlFor={field} className="text-sm capitalize">
              {field === 'mentoring' ? 'Are you enrolled in mentoring?' : field}
            </label>
            <input
              type="text"
              id={field}
              placeholder={`Enter your ${field}`}
              value={userFireData?.[field] || ''}
              onChange={(e) => handleChange(field, e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border-2 border-gray-200 rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
