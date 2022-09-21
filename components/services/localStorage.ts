const isSupported = () => {
  try {
    var itemBackup = localStorage.getItem('');
    localStorage.removeItem('');
    if (itemBackup === null) localStorage.removeItem('');
    else localStorage.setItem('', itemBackup);
    return true;
  } catch (e) {
    return false;
  }
};

const readWallets = (): Array<string> => {
  if (!isSupported()) {
    return [];
  }
  const walletsString = localStorage.getItem('wallets');
  if (walletsString) {
    try {
      return JSON.parse(walletsString);
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
};

const readDeactivatedWallets = (): Array<string> => {
  if (!isSupported()) {
    return [];
  }
  const walletsString = localStorage.getItem('deactivatedWallets');
  if (walletsString) {
    try {
      return JSON.parse(walletsString);
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
};

const storeWallets = (wallets: Array<string>) => {
  if (isSupported()) {
    const lowerCaseWallets = wallets.map((address) => address.toLowerCase());
    localStorage.setItem(
      'wallets',
      JSON.stringify(Array.from(new Set(lowerCaseWallets)))
    );
  }
};

const storeDeactivatedWallets = (wallets: string[]) => {
  if (isSupported()) {
    const lowerCaseWallets = wallets.map((address) => address.toLowerCase());
    localStorage.setItem(
      'deactivatedWallets',
      JSON.stringify(Array.from(new Set(lowerCaseWallets)))
    );
  }
};

const storeHideDisconnectPopup = (shouldHide: boolean) => {
  if (!isSupported()) return;
  localStorage.setItem('hideDisconnetPopup', JSON.stringify(shouldHide));
};

export {
  readDeactivatedWallets,
  readWallets,
  storeDeactivatedWallets,
  storeWallets,
  storeHideDisconnectPopup,
};
