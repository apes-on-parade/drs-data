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
import CancelIcon from '@mui/icons-material/Cancel'
import DoneIcon from '@mui/icons-material/Done'
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Link from "@mui/material/Link"
// import Autocomplete from '@mui/material/Autocomplete'
// import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'
import TextField from '@mui/material/TextField'

// const O = {}

const SecurityDrsGuide = function(props){
	//Localization
	const {locale='en'} = useParams('locale')
	const [l,setLocalization] = useState(defaultTranslation)
	useAsyncEffect(loadLocalization,[locale])

	//Props
	const {security, removeSelf} = props
	const {ticker, cusip, issuer, issuerId, latestClaimedTransferAgent, allClaimedTransferAgents, readyToSubmit} = security

	//State
	const [menuAnchor, setMenuAnchor] = useState()
	const [editingTa, setEditingTa] = useState(false)
	const [transferAgent, setTransferAgent] = useState()
	const [editingTaName, setEditingTaName] = useState(transferAgent?.name || "")

	// Effects
	useEffect(loadTransferAgent,[latestClaimedTransferAgent, readyToSubmit])

	const avatarColor = transferAgent === undefined ? "#666666" : transferAgent === null ? "#CC9900" : "#006600"

	return <div>
		<style>{`@media print {.noprint{display: none;}}`}</style>
		<Card variant="outlined">
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
					<MenuItem onClick={closeMenu}>
						<Link
							sx={{textDecoration:"none", color:"inherit"}}
							target="_blank"
							rel="noopener"
							href={`/${locale}/issuers/${issuerId}`}
							>View issuer profile</Link>
						</MenuItem>
					<MenuItem onClick={openTaEditor}>Edit Transfer Agent</MenuItem>
					<MenuItem onClick={removeSelf}>Remove from request</MenuItem>
					</Menu>
				<CardContent>
					{!!(editingTa) && <>
						<Typography mb={2} variant="h6" component="div">
							Select the issuer's transfer agent to include in your request
							</Typography>
						<Stack direction="row" spacing={4}>
							<TextField
								label="Transfer agent name"
								sx={{width:"24em"}}
								value={editingTaName}
								onChange={evt=>setEditingTaName(evt.target.value)}
								/>
							<Button variant="outlined" onClick={cancelTaEditor}><CancelIcon/></Button>
							<Button variant="contained" onClick={doneTaEditor}><DoneIcon/></Button>
							</Stack>
						</>}
					{!!(!editingTa && transferAgent) && <>
						<Typography mb={2} variant="h6" component="div">
							Send
							<TextField variant="standard" type="number" placeholder="0" sx={{width:"3em", display:"inline-block", margin:"0 4px"}}/>
							shares to {transferAgent.name}
							{transferAgent.docUrl && <Tooltip className="noprint"
								title={<>
									<b>Source:</b>
									<Link target="_blank" rel="noopener" color="#fff" href={transferAgent.docUrl}>{transferAgent.docUrl}</Link>
									</>}
								>
								<InfoIcon fontSize="small" color="primary" sx={{verticalAlign:"middle", marginRight:1}}/>
								</Tooltip>}
							</Typography>
						{transferAgent.dtcMemberId && <Typography>DTC Member Number: {transferAgent.dtcMemberId}</Typography>}
						</>}
					{!!(!editingTa && transferAgent===null && !latestClaimedTransferAgent) &&
						<Typography mb={2} variant="h6" component="div">
							We do not have information on this issuer's transfer agent.
							</Typography>
						}
					{!!(!editingTa && transferAgent===null && latestClaimedTransferAgent) && <>
						<Typography mb={2} variant="h6" component="div">
							We have found multiple conflicting sources on this issuer's transfer agent.
							</Typography>
							<Stack direction="row" spacing={2}>
								{allClaimedTransferAgents.map((ta,t) => <Card key={t} sx={{minWidth:"200px"}}>
									<CardContent>
										<Typography><b>Name:</b> {ta.name}</Typography>
										{ta.dtcMemberId && <Typography><b>DTC Member Number:</b> {ta.dtcMemberId}</Typography>}
										<Typography><b>Source:</b>
											<Link target="_blank" rel="noopener"
												href={ta.docUrl}
												>{ta.docUrl}</Link>
											</Typography>
										{ta?.asOfDate?.value[0]==='2' && <Typography><b>Date:</b> {ta.asOfDate.value}</Typography>}
										</CardContent>
									<CardActions>
										<Button size="small" variant="outlined" className="noprint" onClick={acceptClaimedTa(ta)}>Accept suggestion</Button>
										</CardActions>
									</Card>)}
								</Stack>
						</>}
					</CardContent>
				<CardActions>
					{(!editingTa && transferAgent===null) && <>
						<Button size="small" variant="outlined" className="noprint" sx={{margin:"0 5px"}}
							href={`https://www.sec.gov/edgar/browse/?CIK=${issuerId}`}
							>Contact issuer</Button>
						<Button size="small" variant="outlined" className="noprint" sx={{margin:"0 5px"}}
							onClick={openTaEditor}
							>Manually set transfer agent</Button>
						</>}
					</CardActions>
			</Card>
		</div>

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
	function loadTransferAgent(){
		setTransferAgent(readyToSubmit===false ? null : latestClaimedTransferAgent)
		}
	function openTaEditor(){
		setEditingTaName(transferAgent?.name || "")
		setEditingTa(true)
		}
	function cancelTaEditor(){
		setEditingTaName(transferAgent?.name || "")
		setEditingTa(false)
		}
	function doneTaEditor(){
		setTransferAgent({name:editingTaName})
		setEditingTa(false)
		}
	function acceptClaimedTa(ta){
		return function(){
			setTransferAgent(ta)
			}
		}
	}

export default SecurityDrsGuide
