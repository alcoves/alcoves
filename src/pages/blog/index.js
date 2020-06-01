import React from 'react';
import Layout from '../../components/Layout';
import Navigation from '../../components/Navigation';

function BlogWrapper() {
  return (
    <Layout>
      <Navigation />
      <div> Welcome to the blog </div>
    </Layout>
  );
}

export default BlogWrapper;

const Index = props => {
  return (
    <Layout pathname='/' siteTitle={props.title} siteDescription={props.description}>
      <section>
        <BlogList />
      </section>
    </Layout>
  );
};

export default Index;

export async function getStaticProps() {
  const configData = await import(`../data/config.json`);
  return {
    props: {
      title: configData.title,
      description: configData.description,
    },
  };
}
