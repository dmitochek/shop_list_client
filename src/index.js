import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import
{
  ApolloClient,
  InMemoryCache,
  ApolloProvider
} from "@apollo/client";

const defaultOptions = {
  //watchQuery: {
  //  fetchPolicy: 'no-cache',
  //  errorPolicy: 'ignore',
  //},
  //query: {
  //  fetchPolicy: 'no-cache',
  //  errorPolicy: 'all',
  //},
}
const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

reportWebVitals();
