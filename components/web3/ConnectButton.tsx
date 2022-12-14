import { WalletOutlined } from '@ant-design/icons';
import { useWeb3React } from '@web3-react/core';
import { Avatar, Button, Modal, Popconfirm, Typography } from 'antd';
import { useEffect, useState } from 'react';

import {
  readDeactivatedWallets,
  readWallets,
  storeDeactivatedWallets,
  storeWallets,
} from '../services/localStorage';
import { getInjectedConnector } from './connectors';
import {
  addToDeactivatedWallets,
  removeFromActiveWallets,
} from './DisconnectButton';

const ENABLED_WALLETS = ['metamask', 'walletconnect', 'blockwallet', 'imtoken'];

interface Wallet {
  key: string;
  name: string;
  icon: string;
  connector: Function;
  providerCheck?: Function;
}
const supportedWallets: Wallet[] = [
  {
    key: 'metamask',
    name: 'MetaMask',
    icon: '/metamask.svg',
    connector: async () => {
      return await getInjectedConnector();
    },
    // Removed for now to allow all kinds of injected wallets to connect using the metamask button
    // providerCheck: () => {
    //   return !!(window as any).ethereum && !!(window as any).ethereum['isMetaMask']
    // },
  },
  {
    key: 'blockwallet',
    name: 'BlockWallet',
    icon: '/blockwallet.svg',
    connector: async () => {
      return await getInjectedConnector();
    },
    providerCheck: () => {
      if ((window as any).ethereum && (window as any).ethereum.isBlockWallet) {
        return true;
      } else {
        return false;
      }
    },
  },
  {
    key: 'imtoken',
    name: 'imToken',
    icon: '/imToken.svg',
    connector: async () => {
      return await getInjectedConnector();
    },
    providerCheck: () => {
      return (
        !!(window as any).ethereum && !!(window as any).ethereum['isImToken']
      );
    },
  },
];

// const configuredWalletKeys = JSON.parse(
//   '["metamask", "walletconnect", "blockwallet", "imtoken"]' || '[]'
// ) as string[];
const enabledWallets = supportedWallets.filter((wallet) =>
  ['metamask', 'walletconnect', 'blockwallet', 'imtoken'].includes(wallet.key)
);

export const addToActiveWallets = (address: string | null | undefined) => {
  if (!address) return;
  const lowerCaseAddress = address.toLowerCase();
  const activeWallets = readWallets();
  activeWallets.push(lowerCaseAddress);
  storeWallets(activeWallets);
};

export const removeFromDeactivatedWallets = (
  address: string | null | undefined
) => {
  if (!address) return;
  const lowerCaseAddress = address.toLowerCase();
  const deactivatedWallets = readDeactivatedWallets();
  const deactivatedWalletsWithoutAccount = deactivatedWallets.filter(
    (wallet) => wallet !== lowerCaseAddress
  );
  storeDeactivatedWallets(deactivatedWalletsWithoutAccount);
};

type ConnectButtonPropType = {
  style?: React.CSSProperties;
  className?: string;
  size?: 'large' | 'middle' | 'small';
};

function ConnectButton({
  style,
  className,
  size = 'middle',
}: ConnectButtonPropType) {
  const { activate } = useWeb3React();
  const [showConnectModal, setShowConnectModal] = useState<boolean>(false);
  const [showWalletIdentityPopover, setShowWalletIdentityPopover] =
    useState<Wallet>();

  const login = async (wallet: Wallet) => {
    if (wallet.providerCheck) {
      const checkResult = wallet.providerCheck?.();
      if (!checkResult) {
        setShowWalletIdentityPopover(wallet);
        return;
      }
    }

    const connector = await wallet.connector();
    try {
      await activate(connector, undefined, true);
    } catch {
      return;
    }
    const accountAddress = await connector.getAccount();
    removeFromDeactivatedWallets(accountAddress);
    addToActiveWallets(accountAddress);

    connector.on('Web3ReactDeactivate', () => {
      removeFromActiveWallets(accountAddress);
      addToDeactivatedWallets(accountAddress);
    });
  };

  useEffect(() => {
    setShowWalletIdentityPopover(undefined);
  }, [showConnectModal]);

  return (
    <>
      <Button
        className={className}
        style={{ ...{ borderRadius: '6px' }, ...style }}
        size={size}
        type="primary"
        icon={<WalletOutlined />}
        onClick={() => setShowConnectModal(true)}
      >
        Connect Your Wallet
      </Button>
      <Modal
        destroyOnClose={true}
        className="wallet-selection-modal"
        visible={showConnectModal}
        onOk={() => setShowConnectModal(false)}
        onCancel={() => setShowConnectModal(false)}
        footer={null}
      >
        <Typography.Title level={4} style={{ marginBottom: 32 }}>
          Choose a wallet
        </Typography.Title>
        {enabledWallets.map((wallet) => {
          if (ENABLED_WALLETS?.includes(wallet.key)) {
            return (
              <Popconfirm
                key={wallet.name + '_identitiy_popover'}
                showCancel={false}
                onConfirm={() => {
                  setShowWalletIdentityPopover(undefined);
                }}
                onCancel={() => {
                  setShowWalletIdentityPopover(undefined);
                }}
                title={
                  <Typography.Text>
                    {`Please make sure that only the ${wallet.name} browser extension is active before choosing this wallet.`}
                  </Typography.Text>
                }
                visible={showWalletIdentityPopover?.key === wallet.key}
              >
                <div
                  style={{
                    // width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                  key={wallet.name}
                  onClick={async () => login(wallet)}
                  className="wallet-provider-button"
                >
                  <div>{wallet.name}</div>
                  <div>
                    <Avatar
                      shape="square"
                      size={'large'}
                      src={wallet.icon}
                    ></Avatar>
                  </div>
                </div>
              </Popconfirm>
            );
          }
        })}
      </Modal>
    </>
  );
}

export default ConnectButton;
