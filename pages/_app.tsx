// import '../styles/globals.css';
import 'antd/dist/antd.css';
import type { AppProps } from 'next/app';
import WrappedWeb3ReactProvider from '../components/web3/WrappedWeb3ReactProvider';
import Web3ConnectionManager from '../components/web3/Web3ConnectionManager';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WrappedWeb3ReactProvider>
      <Web3ConnectionManager>
        <Component {...pageProps} />
      </Web3ConnectionManager>
    </WrappedWeb3ReactProvider>
  );
}

export default MyApp;
