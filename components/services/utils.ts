import { readDeactivatedWallets, readWallets } from './localStorage';

export const deepClone = (src: any) => {
  return JSON.parse(JSON.stringify(src));
};

export const isWalletDeactivated = (
  address: string | null | undefined
): boolean => {
  if (!address) return false;
  const lowerCaseAddress = address.toLowerCase();
  const deactivatedWallets = readDeactivatedWallets();
  const deactivatedAddresses = deactivatedWallets.map((address) =>
    address.toLowerCase()
  );
  return deactivatedAddresses.includes(lowerCaseAddress);
};

export const isWalletActivated = (
  address: string | null | undefined
): boolean => {
  if (!address) return false;
  const lowerCaseAddress = address.toLowerCase();
  const activeWallets = readWallets();
  const activeAddresses = activeWallets.map((address) => address.toLowerCase());
  return activeAddresses.includes(lowerCaseAddress);
};
