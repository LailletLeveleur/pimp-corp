/**
 * @myself Ok it seems that I must forget about my coding habits in Js, code factorisation does not seems to be a priority
 *  eg:  
 */

export const installMetaMaskMessage = {
  address: "",
  status: (
    <span>
      <p>
        {" "}
        🦊{" "}
        <a target="_blank" href={`https://metamask.io/download.html`}>
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>
    </span>
  )
};

const walletOperation = async(walletMethodName) => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: walletMethodName,
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return installMetaMaskMessage;
  }
};

export const connectWallet = async () => {
  return await walletOperation("eth_requestAccounts");
};

export const getCurrentWalletConnected = async () => {
  return await walletOperation("eth_accounts");
};

export function addWalletListener(setWalletAddress) {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        // setStatus("👆🏽 Write a message in the text-field above.");
      } else {
          setWalletAddress("");
          // setStatus("🦊 Connect to Metamask using the top right button.");
      }
    });
  } else {
    // setStatus(installMetaMaskMessage);
  }
};