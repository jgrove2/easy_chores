import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session) {
      router.push('/login');
    }
  }, [session, status, router]);

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: !!session,
  };
}
