import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'
import { createUploadLink } from 'apollo-upload-client'

import UploadForm from './UploadForm'

const link = createUploadLink({ uri: 'http://localhost:4000/graphql' })

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
  headers: {
    authorization: localStorage.getItem('token') || ''
  }
})


function App() {
  return (
    <ApolloProvider client={client}>
      <UploadForm />
    </ApolloProvider>
  );
}

export default App;
