import React from "react";
import { ethers } from "ethers";
import Environment from "./environment";
import airdropContractABI from "./airdropContractABI.json";
import tokenContractABI from "./tokenContractABI.json";
const walletAdd = "0x4eCbf8722613809922E436B5FB666FfB864363CC";

const provider = new ethers.providers.JsonRpcProvider(
	"https://data-seed-prebsc-1-s1.binance.org:8545"
);

const voidSigner = new ethers.VoidSigner(walletAdd, provider);

const useContract = (address, ABI, signer) => {
	return React.useMemo(() => {
		if (signer) {
			return new ethers.Contract(address, ABI, signer);
		} else {
			return new ethers.Contract(address, ABI, voidSigner);
		}
	}, [address, ABI, signer]);
};

export function useTokenContract(signer) {
	return useContract(
		Environment.tokenContractAddress,
		tokenContractABI,
		signer
	);
}
export function useAirdropContract(signer) {
	return useContract(
		Environment.airdropContractAddress,
		airdropContractABI,
		signer
	);
}
