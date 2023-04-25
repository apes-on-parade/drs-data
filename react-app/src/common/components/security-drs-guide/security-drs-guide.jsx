import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import useAsyncEffect from "@n1ru4l/use-async-effect"
import defaultTranslation from "../../default-translation.mjs"

import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import IconButton from "@mui/material/IconButton"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
// import Autocomplete from '@mui/material/Autocomplete'
// import Select from '@mui/material/Select'
// import MenuItem from '@mui/material/MenuItem'
// import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
// import Tooltip from '@mui/material/Tooltip'
// import InfoIcon from '@mui/icons-material/Info'
import TextField from '@mui/material/TextField'

// const O = {}

const SecurityDrsGuide = function(props){
	//Localization
	const {locale='en'} = useParams('locale')
	const [l,setLocalization] = useState(defaultTranslation)
	useAsyncEffect(loadLocalization,[locale])

	//Props
	const {security} = props
	const {ticker, cusip, issuer, latestClaimedTransferAgent, allClaimedTransferAgents, readyToSubmit} = security

	//State
	const [menuAnchor, setMenuAnchor] = useState()
	// const [expanded, setExpanded] = useState(true)

	const avatarColor = readyToSubmit === true ? "#006600" : readyToSubmit === false ? "#CC9900" : "#666666"

	return <Card variant="outlined">
			<CardHeader
				avatar={<Avatar sx={{ bgcolor: avatarColor, width:"5em" }} variant="rounded">
					<nobr>{ticker}</nobr>
					</Avatar>}
				title={issuer}
				action={<IconButton onClick={(evt)=>setMenuAnchor(evt.currentTarget)}>
					<MoreVertIcon />
					</IconButton>
					}
				/>
			<Menu
				anchorEl={menuAnchor}
				open={!!menuAnchor}
				onClose={closeMenu}
				>
				<MenuItem onClick={closeMenu}>[TODO] View issuer profile</MenuItem>
				<MenuItem onClick={closeMenu}>[TODO] Remove from request</MenuItem>
				</Menu>
			<CardContent>
				{!!(latestClaimedTransferAgent && readyToSubmit) && <>
					<Typography gutterBottom variant="h6" component="div">
						Send
						<TextField variant="standard" type="number" placeholder="0" sx={{width:"3em", display:"inline-block", margin:"0 4px"}}/>
						shares to {latestClaimedTransferAgent.name}
						</Typography>
					{latestClaimedTransferAgent.dtcMemberId && <Typography>DTC Member Number: {latestClaimedTransferAgent.dtcMemberId}</Typography>}
					</>}
				{!!(!latestClaimedTransferAgent) &&
					<Typography>
						We do not have information on this issuer's transfer agent.
						</Typography>
					}
				</CardContent>
			<CardActions>
				{!readyToSubmit && <Button size="small" variant="outlined">Contact Issuer</Button>}
				</CardActions>
		</Card>

	function* loadLocalization(onCancel){
		let localization
		try{
			localization = (yield import(`./locale-${locale}.js`)).default
			}
		catch(e){
			console.error(`Failed to load requested locale ${locale}`)
			localization = (yield import(`./locale-en.js`)).default
			}
		setLocalization(()=>localization)
		}
	function closeMenu(){setMenuAnchor(undefined)}
	}

export default SecurityDrsGuide
