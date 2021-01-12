import { useContext, } from 'react';
import { useRouter, } from 'next/router';
import Layout from '../components/Layout';
import { Context, } from '../utils/store';
import Spinner from '../components/Spinner';

export default function Account() {
  const router = useRouter();
  const { logout, user, authenticated, loading } = useContext(Context);

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }
  
  if (!authenticated) {
    return (
      <Layout>
        Please log in
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='flex flex-col mt-4'>
        <div width='500px' align='center' margin='medium'>
          <img className='h-32 w-32 rounded-full' src={user.avatar} alt='avatar' />
          <h4 className='mt-2 text-3xl font-bold text-gray-200'>
            {user.username}
          </h4>
          <p className='mb-2 text-sm lowercase font-bold text-gray-500'>
            {user.email}
          </p>
          <button
            type='button'
            className='rounded-md uppercase text-sm text-gray-50 font-medium h-8 py-1 px-4 tracking-wide bg-teal-600'
            onClick={() => {
              logout();
              router.push('/');
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </Layout>
  );
}