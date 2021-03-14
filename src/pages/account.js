import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import { useSession, signOut } from 'next-auth/client'

export default function Account() {
  const [session, loading] = useSession();

  if (loading) {
    return <Layout><Spinner /></Layout>
  }

  return (
    <Layout>
      <h1>Your Profile</h1>
      <pre>{JSON.stringify(session.user, null, 2)}</pre>
      <button
        type='button'
        className='rounded-md uppercase text-sm text-gray-50 font-medium h-8 py-1 px-4 tracking-wide bg-teal-600'
        onClick={() => signOut()}>
        Log out
      </button>
    </Layout>
  )

  // return (
  //   <Layout>
  //     <div className='flex flex-col mt-4'>
  //       <div width='500px' align='center' margin='medium'>
  //         <img className='h-32 w-32 rounded-full' src={user.avatar} alt='avatar' />
  //         <h4 className='mt-2 text-3xl font-bold text-gray-200'>
  //           {user.username}
  //         </h4>
  //         <pre>{JSON.stringify(user, null, 2)}</pre>
  //         <p className='mb-2 text-sm lowercase font-bold text-gray-500'>
  //           {user.email}
  //         </p>

  //       </div>
  //     </div>
  //   </Layout>
  // );
}