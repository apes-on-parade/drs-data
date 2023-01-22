import React, {useEffect, useState} from 'react'
import {useDebounce} from 'use-debounce'
import useAsyncEffect from "@n1ru4l/use-async-effect"

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const DrsRequestTemplateScene = (props) => {

	const [issuerOptions] = useState(["[GME] Gamestop", "[BBBY] Bed, Bath & Beyond", "[AMC] AMC Theaters"])
	const [brokerOptions] = useState(["Fidelity", "Robinhood"])
	const [accountInfoOptions] = useState(["Standard", "401(k)", "IRA", "Other retirement"])

	return <Stack direction="column" spacing={4} className="project-page">
			<Typography style={{textAlign:"center"}}>This form can help you prepare your DRS request. We do not collect or process information entered here, nor submit the request on your behalf.</Typography>
			<Stack direction="row" spacing={1}>
				<Autocomplete
					style={{ flexGrow: 1 }}
					options={brokerOptions}
					renderInput={(params) => <TextField {...params} label="Broker" placeholder="Your broker" />}
					/>
				<Autocomplete
					style={{ flexGrow: 1 }}
					options={accountInfoOptions}
					renderInput={(params) => <TextField {...params} label="Account Type" placeholder="(Optional) Whether your account is a 401(k), IRA, etc." />}
					/>
				</Stack>
			<Autocomplete
				multiple
				options={issuerOptions}
				getOptionLabel={(option) => option}
				filterSelectedOptions
				renderInput={(params) => (
					<TextField
						{...params}
						label="Stocks"
						placeholder="Stocks/tickers to DRS"
						/>
					)}
				/>
		</Stack>
	}

export default DrsRequestTemplateScene
