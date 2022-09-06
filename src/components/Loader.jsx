import React from "react";
import { Dna } from "react-loader-spinner";
import { Backdrop } from "@mui/material";

const Loader = ({ loading }) => {
	return (
		<>
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={loading}
			>
				<Dna
					visible={true}
					height="80"
					width="80"
					ariaLabel="dna-loading"
					wrapperStyle={{}}
					wrapperClass="dna-wrapper"
				/>
			</Backdrop>
		</>
	);
};

export default Loader;
