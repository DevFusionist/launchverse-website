import { redirect } from 'next/navigation';

export default function NotFound() {
  // The middleware will handle all redirections
  // This is just a fallback that will never be reached
  redirect('/');
}
