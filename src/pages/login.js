import { providers as getProviders, signIn, } from 'next-auth/client';

export default function Login({ providers }) {
  return (
    <div className='mt-32 flex items-center justify-center bg-gray-800 pb-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-sm w-full space-y-8'>
        <div>
          <img className='mx-auto h-20 w-auto' src='/favicon.ico' alt='logo' />
          <h2 className='mt-2 text-center text-5xl font-extrabold text-gray-200'>
            Dive into bken
          </h2>
        </div>
        {Object.values(providers).map(provider => (
          <div key={provider.name}>
            <button
              className='group relative w-full flex justify-center py-2 px-4 text-sm font-semibold  rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 bg-teal-500 uppercase'
              onClick={() => signIn(provider.id)}>
              Log in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  return { props: { providers: await getProviders(ctx) } };
}