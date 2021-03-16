export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context)
    }
  }
}