import { Box, Button, Container, Typography } from "@mui/material";
import React, { useContext } from "react";
import { AppContext } from "../utils";

const Header = () => {
	const { connect, disconnect, account } = useContext(AppContext);
	return (
		<>
			<Container>
				<Box sx={{ display: "flex", justifyContent: "space-between" }} py={3}>
					<Typography variant="h5">Logo</Typography>
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
							color="error"
							onClick={() => disconnect()}
						>
							Disconnect
						</Button>
					)}
				</Box>
			</Container>
		</>
	);
};

export default Header;
