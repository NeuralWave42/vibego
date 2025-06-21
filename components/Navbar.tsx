'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { currentUser, userProfile, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Vibego
        </Link>
        <div className="flex items-center space-x-4">
          {!loading && (
            <>
              {currentUser ? (
                <>
                  <span className="text-gray-700">
                    Welcome, {userProfile?.displayName || currentUser.email}
                  </span>
                  <Link href="/auth/profile">
                    <Button variant="ghost">Profile</Button>
                  </Link>
                  <Button onClick={handleLogout} variant="destructive">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline">Login</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 