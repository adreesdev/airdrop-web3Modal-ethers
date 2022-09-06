import React, { useEffect } from "react";
import { ethers } from "ethers";
import {
	Dialog,
	DialogActions,
	Button,
	DialogTitle,
	DialogContent,
} from "@mui/material";

const NetworkModal = ({ open, setOpen }) => {
	const provider = new ethers.providers.Web3Provider(window.ethereum);
	const signer = provider.getSigner();

	useEffect(() => {
		async function checkNetwork() {
			const chainid = await signer.getChainId();
			if (chainid !== 97) {
				setOpen(true);
			}
		}
		checkNetwork();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleSwitch = async () => {
		try {
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: "0x61" }],
			});
		} catch (err) {
			// This error code indicates that the chain has not been added to MetaMask
			if (err.code === 4902) {
				await window.ethereum.request({
					method: "wallet_addEthereumChain",
					params: [
						{
							chainName: "BSC Testnet",
							chainId: "0x61",
							nativeCurrency: { name: "tBNB", decimals: 18, symbol: "tBNB" },
							rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
						},
					],
				});
			}
		}
		setOpen(false);
	};

	const handleClose = (event, reason) =>
		reason !== "backdropClick" ? setOpen(false) : null;

	return (
		<>
			<Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
				<DialogTitle>Network Error.</DialogTitle>
				<DialogContent>Error! Incorrect network.</DialogContent>
				<DialogActions>
					<Button onClick={handleSwitch}>Switch Network</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default NetworkModal;
