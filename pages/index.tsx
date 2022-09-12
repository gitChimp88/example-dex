import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Swap from '../components/Swap';
import { ChainsTokensToolsProvider } from "../components/providers/chainsTokensToolsProvider";

let Web3 = require('web3');

const Home: NextPage = () => {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    const checkConnection = async () => {
      // Check if browser is running Metamask
      let web3: any;
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
      } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
      }

      // Check if User is already connected by retrieving the accounts
      web3.eth.getAccounts().then(async (addr: string) => {
        // Set User account into state
        if (addr) {
          setAddress(addr);
        }
      });
      setWeb3(web3);
    };
    checkConnection();
  }, []);

  const connectWallet = () => {
    window.ethereum
      ? window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then((accounts: string[]) => {
            setAddress(accounts[0]);
            let w3 = new Web3(window.ethereum);
            setWeb3(w3);
          })
          .catch((err: any) => console.log(err))
      : console.log('Please install MetaMask');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to example dex!</h1>
        {address?.length ? (
          <p>{'Connected - ' + address}</p>
        ) : (
          <button onClick={connectWallet}>Connect wallet</button>
        )}
        <ChainsTokensToolsProvider>    
          <Swap />
        </ChainsTokensToolsProvider>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
