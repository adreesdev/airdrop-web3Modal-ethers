import React, { useContext, useState } from "react";
import { AppContext } from "../utils";
import Loader from "./Loader";
import { useAirdropContract } from "../contract/hooks";

import { Paper, Container, Button, Box } from "@mui/material";

import {
	useCSVReader,
	lightenDarkenColor,
	formatFileSize,
} from "react-papaparse";
const GREY = "#CCC";
const GREY_LIGHT = "rgba(255, 255, 255, 0.4)";
const DEFAULT_REMOVE_HOVER_COLOR = "#A01919";
const REMOVE_HOVER_COLOR_LIGHT = lightenDarkenColor(
	DEFAULT_REMOVE_HOVER_COLOR,
	40
);
const GREY_DIM = "#686868";

const styles = {
	zone: {
		alignItems: "center",
		border: `2px dashed ${GREY}`,
		borderRadius: 20,
		display: "flex",
		flexDirection: "column",
		height: "100%",
		justifyContent: "center",
		padding: 20,
	},
	file: {
		background: "linear-gradient(to bottom, #EEE, #DDD)",
		borderRadius: 20,
		display: "flex",
		height: 120,
		width: 120,
		position: "relative",
		zIndex: 10,
		flexDirection: "column",
		justifyContent: "center",
	},
	info: {
		alignItems: "center",
		display: "flex",
		flexDirection: "column",
		paddingLeft: 10,
		paddingRight: 10,
	},
	size: {
		backgroundColor: GREY_LIGHT,
		borderRadius: 3,
		marginBottom: "0.5em",
		justifyContent: "center",
		display: "flex",
	},
	name: {
		backgroundColor: GREY_LIGHT,
		borderRadius: 3,
		fontSize: 12,
		marginBottom: "0.5em",
	},
	progressBar: {
		bottom: 14,
		position: "absolute",
		width: "100%",
		paddingLeft: 10,
		paddingRight: 10,
	},
	zoneHover: {
		borderColor: GREY_DIM,
	},
	default: {
		borderColor: GREY,
	},
	remove: {
		height: 23,
		position: "absolute",
		right: 6,
		top: 6,
		width: 23,
	},
};

const UploadCSV = () => {
	const { account, signer, connect } = useContext(AppContext);
	let AirdropContract = useAirdropContract(signer);
	// let tokenContract = useTokenContract();
	const { CSVReader } = useCSVReader();
	const [zoneHover, setZoneHover] = useState(false);
	const [removeHoverColor, setRemoveHoverColor] = useState(
		DEFAULT_REMOVE_HOVER_COLOR
	);
	const [amountArray, setAmountArray] = useState([]);
	const [addressArray, setAddressArray] = useState([]);
	const [loading, setloading] = useState(false);
	// const [total, settotal] = useState(0);

	const handleOnDrop = (data) => {
		let addressArr = [];
		let amountArr = [];
		// let total = 0;
		for (let index = 0; index < data.length - 1; index++) {
			addressArr.push(data[index][0]);
			amountArr.push(data[index][1]);
			// total += +data[index][1];
		}

		setAddressArray(addressArr);
		setAmountArray(amountArr);
	};
	const handleOnRemoveFile = () => {
		setAddressArray([]);
		setAmountArray([]);
	};

	const handleSend = async () => {
		if (!account) {
			console.log("Error! Please connect your wallet.");
		} else if (addressArray.length === 0 || amountArray.length === 0) {
			console.log("Error! Please select csv file.");
		} else {
			try {
				const tran = await AirdropContract.multipletransfer(
					addressArray,
					amountArray
				);
				tran.wait();
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<>
			<Loader loading={loading} setloading={setloading} />
			<Container>
				<Box width="100%" display="flex" justifyContent="center">
					<Paper sx={{ width: "300px" }}>
						<CSVReader
							onUploadAccepted={(results) => {
								console.log(results.data, "csv file");

								handleOnDrop(results.data);
								setZoneHover(false);
							}}
							onDragOver={(event) => {
								event.preventDefault();
								setZoneHover(true);
							}}
							onDragLeave={(event) => {
								event.preventDefault();
								setZoneHover(false);
							}}
							noDrag
						>
							{({
								getRootProps,
								acceptedFile,
								ProgressBar,
								getRemoveFileProps,
								Remove,
							}) => (
								<>
									<div
										{...getRootProps()}
										style={Object.assign(
											{},
											styles.zone,
											zoneHover && styles.zoneHover
										)}
									>
										{acceptedFile ? (
											<>
												<div style={styles.file}>
													<div style={styles.info}>
														<span style={styles.size}>
															{formatFileSize(acceptedFile.size)}
														</span>
														<span style={styles.name}>{acceptedFile.name}</span>
													</div>
													<div style={styles.progressBar}>
														<ProgressBar />
													</div>
													<div
														{...getRemoveFileProps()}
														style={styles.remove}
														onMouseOver={(event) => {
															event.preventDefault();
															setRemoveHoverColor(REMOVE_HOVER_COLOR_LIGHT);
														}}
														onMouseOut={(event) => {
															event.preventDefault();
															setRemoveHoverColor(DEFAULT_REMOVE_HOVER_COLOR);
														}}
													>
														<Remove
															color={removeHoverColor}
															onClick={() => handleOnRemoveFile()}
														/>
													</div>
												</div>
											</>
										) : (
											"Click to upload"
										)}
									</div>
								</>
							)}
						</CSVReader>
						<Box py={2} textAlign="center">
							{!account ? (
								<Button
									variant="contained"
									color="warning"
									onClick={() => connect()}
								>
									Connect
								</Button>
							) : (
								<Button
									variant="contained"
									color="success"
									onClick={() => handleSend()}
								>
									Send
								</Button>
							)}
						</Box>
					</Paper>
				</Box>
			</Container>
		</>
	);
};

export default UploadCSV;
