import { ApolloProvider } from '@apollo/react-hooks'
import Layout from '../components/layout'
import '../styles/globals.scss'

import client from '../libs/apollo-client'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Layout>
  )
}

export default MyApp
