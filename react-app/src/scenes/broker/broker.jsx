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

import Logo from '../../common/components/Logo.jsx'

const BrokerScene = (props) => {
	//const {} = props
	const navigate = useNavigate()
	const {brokerId} = useParams('brokerId')

	//Localization
	const {locale='en'} = useParams('locale')
	const [l,setLocalization] = useState(()=>()=>"...")
	useAsyncEffect(loadLocalization,[locale])

	const [broker, setBroker] = useState()

	useAsyncEffect(load,[brokerId])

	return (
		!broker ? "..."
		: <Container><Stack direction="column" spacing={4} marginTop={4} className="page">
			<Typography size="small">
				<Link href={`/${locale}/search`}>
					{l`Index`}
					</Link>
					&nbsp; >
				</Typography>
			<Typography variant="h2" component="h1">
				{broker.name}
				</Typography>
			<FactRow>
				<Logo domain={broker.domain} />
				</FactRow>
			{broker.country
				&& <FactRow label={l`Country served`}>
					<Typography>{broker.country}</Typography>
					</FactRow>
				}
			{broker.languages
				&& <FactRow label={l`Languages spoken`}>
					<Typography>{broker.languages.join(", ")}</Typography>
					</FactRow>
				}
			{broker.drs.hasDirect !== undefined
				&& <FactRow
					label={l`DRS available`}
					info={l`Whether the broker allows you to initiate a DRS transfer directly. (Keep in mind, you can still DRS indirectly if not.)`}
					>
					<Typography>{broker.drs.hasDirect ? l`Yes` : l`No`}</Typography>
					</FactRow>
				}
			{broker.drs.doesRequireAccount
				&& <FactRow
					label={l`Requires account?`}
					info={l`Whether the broker requires you to provide an account number for your existing account at the transfer agent.`}
					>
					<Typography>{l`Yes, requires an existing account with the transfer agent`}</Typography>
					</FactRow>
				}
			{broker.drs.doesRequireLoi
				&& <FactRow
					label={l`Requires LOI?`}
					info={l`Whether the broker requires a letter of instruction, and if so whether they will accept an email or online message.`}
					>
					<Typography>{[l`Yes`,broker.drs.loiOptions].filter(Boolean).join(", ")}</Typography>
					</FactRow>
				}
			{broker.drs.expectedFee
				&& <FactRow
					label={l`DRS Fee`}
					info={l`Amount charged by the broker to initiate the DRS fee.`}
					>
					<Typography>{broker.drs.expectedFee}</Typography>
					</FactRow>
				}
			{broker.drs.expectedDuration
				&& <FactRow
					label={l`DRS duration (d)`}
					info={l`Typical timeframe, in business days, for this broker to process your DRS request. This is based on information volunteered by customers, and may change without warning.`}
					>
					<Typography>{broker.drs.expectedDuration} days</Typography>
					</FactRow>
				}
			</Stack></Container>
		)

	function* load(onCancel){
		if(!brokerId.match(/^[-a-zA-Z0-9]+$/)){
			return navigate("/")
			}
		const rawResponse = yield fetch(`/data/brokers/${brokerId}.json`,canceller(onCancel))
		const broker = yield rawResponse.json()
		setBroker(broker)
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

export default BrokerScene
