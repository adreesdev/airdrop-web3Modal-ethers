import { ethers } from "ethers";
import React, { createContext, useCallback, useEffect, useState } from "react";
import Web3Modal from "web3modal";

const web3Modal = new Web3Modal({
	network: "testnet",
	cacheProvider: true,
});

let initialState = {
	provider: null,
	web3Provider: null,
	account: null,
	chainId: null,
	signer: null,
	balance: null,
};

export const AppContext = createContext(initialState);

export const AppContextProvider = ({ children }) => {
	const [state, setState] = useState(initialState);

	const connect = async () => {
		const provider = await web3Modal.connect();
		const web3Provider = new ethers.providers.Web3Provider(provider);

		const signer = web3Provider.getSigner();

		const account = await signer.getAddress();

		const balanceInWei = await web3Provider.getBalance(account);
		const balance = ethers.utils.formatEther(balanceInWei);

		const network = await web3Provider.getNetwork();

		setState({
			...state,
			provider: provider,
			web3Provider: web3Provider,
			account: account,
			signer: signer,
			chainId: network.chainId,
			balance: balance,
		});
	};

	const disconnect = useCallback(
		async function () {
			await web3Modal.clearCachedProvider();
			if (
				state.provider?.disconnect &&
				typeof state.provider.disconnect === "function"
			) {
				await state.provider.disconnect();
			}
			setState({
				...state,
				provider: null,
				web3Provider: null,
				account: null,
				chainId: null,
				signer: null,
				balance: null,
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[state.provider]
	);
	useEffect(() => {
		if (state.provider?.on) {
			const handleAccountsChanged = (accounts) => {
				setState({
					...state,
					account: accounts[0],
				});
			};

			// https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
			const handleChainChanged = (_hexChainId) => {
				window.location.reload();
			};
			const handleDisconnect = (error) => {
				disconnect();
			};

			state.provider.on("accountsChanged", handleAccountsChanged);
			state.provider.on("chainChanged", handleChainChanged);
			state.provider.on("disconnect", handleDisconnect);

			return () => {
				if (state.provider.removeListener) {
					state.provider.removeListener(
						"accountsChanged",
						handleAccountsChanged
					);
					state.provider.removeListener("chainChanged", handleChainChanged);
					state.provider.removeListener("disconnect", handleDisconnect);
				}
			};
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.provider, disconnect]);

	return (
		<AppContext.Provider
			value={{
				account: state.account,
				signer: state.signer,
				connect,
				disconnect,
				balance: state.balance,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
