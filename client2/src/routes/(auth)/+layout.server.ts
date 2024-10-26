import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
  const res = await fetch('http://localhost:3000/api/users/me');
  if (!res.ok) return {}
  redirect(301, '/')
};