import React, {useEffect, useState} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
//import {useDebounce} from 'use-debounce'
import useAsyncEffect from "@n1ru4l/use-async-effect"

//import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'
import Link from '@mui/material/Link'

const IssuerScene = (props) => {
	//const {} = props
	const navigate = useNavigate()
	const {issuerId} = useParams('issuerId')

	//Localization
	const {locale='en'} = useParams('locale')
	const [l,setLocalization] = useState(()=>()=>"...")
	useAsyncEffect(loadLocalization,[locale])

	const [issuer, setIssuer] = useState()

	useAsyncEffect(load,[issuerId])

	return (
		!issuer ? "..."
		: <Container><Stack direction="column" spacing={4} marginTop={4} className="page">
			<Typography size="small">
				<Link href={`/${locale}/search`}>
					{l`Index`}
					</Link>
					&nbsp; >
				</Typography>
			<Typography variant="h2" component="h1">
				{issuer.name}
				</Typography>
			{issuer.transferAgentName
				&& <FactRow
					label={l`Transfer Agent`}
					info={l`An issuer's transfer agent maintains that issuer's official shareholder list/ledger, and is central to the direct registerd ownership of securities. See our Glossary for more info.`}
					>
					<Typography>{issuer.transferAgentName}</Typography>
					</FactRow>
				}
			{issuer.transferAgentDtcMemberId
				&& <FactRow
					label={l`Transfer Agent DTC Member #`}
					info={l`The 'Member Number' identifying the transfer agent at the Depository Trust Company (DTC). This number can be used for more explicit DRS requests.`}
					>
					<Typography>{issuer.transferAgentDtcMemberId}</Typography>
					</FactRow>
				}
			{issuer.cusip
				&& <FactRow
					label={l`CUSIP`}
					info={l`A nine character identifier for finanical instruments, including securities. See our Glossary for more info.`}
					>
					<Typography>{issuer.cusip}</Typography>
					</FactRow>
				}
			{issuer.onlinePurchase !== undefined
				&& <FactRow
					label={l`Online Purchase?`}
					info={l`In addition to transfering securities into your name via DRS, some securities may also be purchased through an online direct stock purchase plan. See our Glossary for more info.`}
					>
					<Typography>{issuer.onlinePurchase ? l`Yes` : l`No`}</Typography>
					</FactRow>
				}
			</Stack></Container>
		)

	function* load(onCancel){
		if(!issuerId.match(/^[-:a-zA-Z0-9]+$/)){
			return navigate("/")
			}
		const rawResponse = yield fetch(`/issuers/detail/${issuerId}.json`,canceller(onCancel))
		const issuer = yield rawResponse.json()
		setIssuer(issuer)
		}

	function canceller(onCancel){
		const controller = new AbortController();
		onCancel(() => controller.abort())
		return controller
		}

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
	}

const FactRow = (props)=>{
	const {label, info, children} = props
	return <Stack direction="row" spacing={4}>
		<Box sx={{width:"12em"}}>
			<Typography align="right" sx={{fontWeight:"bold"}}>
				{info &&<Tooltip title={info}>
					<InfoIcon fontSize="small" color="primary" sx={{verticalAlign:"middle", marginRight:1}}/>
					</Tooltip>}
				{label}
				</Typography>
			</Box>
		<Box>
			{children}
			</Box>
		</Stack>
}

export default IssuerScene
