import type { User } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
  const res = await fetch('http://localhost:3000/api/users/me');
  if (!res.ok) return redirect(301, '/login');
  const { payload }: { payload: User } = await res.json();
  return {
    authenticatedUser: payload
  };
};