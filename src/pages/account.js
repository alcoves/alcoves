import { useSession, signOut, } from 'next-auth/client';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';

export default function Account() {
  const [session, loading] = useSession();

  if (loading) {
    return <Layout><Spinner /></Layout>;
  }

  if (session) {
    return (
      <Layout>
        <div className='flex flex-col mt-4'>
          <div width='500px' align='center' margin='medium'>
            <img className='h-32 w-32 rounded-full' src={session.user.image} alt='image' />
            <h4 className='mt-2 text-3xl font-bold text-gray-200'>
              {session.user.name}
            </h4>
            <p className='mb-2 text-sm lowercase font-bold text-gray-500'>
              {session.user.email}
            </p>
            <p className='mb-2 text-sm lowercase font-bold text-gray-500'>
              {session.id}
            </p>
            <button
              type='button'
              className='rounded-md uppercase text-sm text-gray-50 font-medium h-8 py-1 px-4 tracking-wide bg-teal-600'
              onClick={() => signOut()}>
              Log out
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return null;
}