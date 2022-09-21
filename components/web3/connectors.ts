import { ChainId, getChainById, supportedChains } from '../types';
import { NetworkConnector } from '@web3-react/network-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { providers } from 'ethers';

export const getRpcUrl = (chainId: number) => {
  return getChainById(chainId).metamask.rpcUrls[0];
};

export const network = new NetworkConnector({
  urls: Object.fromEntries(
    supportedChains
      .map((chain) => chain.id)
      .map((chainId) => [chainId, getRpcUrl(chainId)])
  ),
  defaultChainId: ChainId.ETH,
});

export const injected = new InjectedConnector({
  supportedChainIds: supportedChains.map((chain) => chain.id),
});

// get our standard supported chain and try to append the possibly unknown chain the user is on
export const getInjectedConnector = async () => {
  const { ethereum } = window as any;
  const currentProvider = new providers.Web3Provider(ethereum);
  const chainId = (await currentProvider.getNetwork()).chainId;
  // append the current chain to the supported chains.
  // can push duplicate ids, when user is on supported chain but that does not seem to make any problems.
  const chains = [...supportedChains.map((chain) => chain.id), chainId];
  return new InjectedConnector({
    supportedChainIds: chains,
  });
};
