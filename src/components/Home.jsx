import { Button, Container, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { useAirdropContract, useTokenContract } from "../contract/hooks";
import { AppContext } from "../utils";
import { ethers } from "ethers";

const Home = () => {
	const { account, balance, signer } = useContext(AppContext);

	const [contractData, setContractData] = useState({
		owner: null,
	});
	const [tokenData, setTokenData] = useState({
		owner: null,
		name: null,
		balanceraw: null,
		balanceformat: null,
	});

	const contract = useAirdropContract(signer);
	const tokenContract = useTokenContract();

	const connectContract = async () => {
		console.log(contract, "Contract");
		const owner = await contract.owner();
		setContractData({
			owner: owner,
		});
	};

	const connectTokenContract = async () => {
		console.log(tokenContract, "Token Contract");
		const owner = await tokenContract.owner();
		const name = await tokenContract.name();
		const balance = await tokenContract.balanceOf(owner);
		const balanceraw = ethers.utils.formatUnits(balance, 18);
		const balanceformat = (+balanceraw).toFixed(2);
		setTokenData({
			owner: owner,
			name: name,
			balanceraw: balanceraw,
			balanceformat: balanceformat,
		});
	};
	return (
		<>
			<Container>
				<Typography>Account Address: {account}</Typography>
				<Typography>Account Balance: {balance}</Typography>
				<Button variant="contained" onClick={() => connectContract()}>
					Connect Contract
				</Button>
				<Typography>{contractData.owner ? contractData.owner : 0.0}</Typography>
				<Button variant="contained" onClick={() => connectTokenContract()}>
					Connect Token
				</Button>
				<Typography>{tokenData.owner && tokenData.owner}</Typography>
				<Typography>{tokenData.name && tokenData.name}</Typography>
				<Typography>{tokenData.balanceraw && tokenData.balanceraw}</Typography>
				<Typography>
					{tokenData.balanceformat && tokenData.balanceformat}
				</Typography>
			</Container>
		</>
	);
};

export default Home;
