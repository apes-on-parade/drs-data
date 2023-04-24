import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
//import {useDebounce} from 'use-debounce'
import useAsyncEffect from "@n1ru4l/use-async-effect"
import defaultTranslation from "../../common/default-translation.mjs"
import BrokerDrsSummary from "../../common/components/broker-drs-summary/broker-drs-summary.jsx"
//import SecurityDrsGuide from "../../common/components/broker-drs-summary/security-drs-guide.jsx"

//import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const O = {}

const DrsRequestTemplateScene = (props) => {
	//Localization
	const {locale='en'} = useParams('locale')
	const [l,setLocalization] = useState(defaultTranslation)
	useAsyncEffect(loadLocalization,[locale])

	//Core state
	const [brokers, setBrokers] = useState()
	const [brokerOptions, setBrokerOptions] = useState([])
	const [selectedBrokerOption,  setSelectedBrokerOption] = useState(null)
	const [securities, setSecurities] = useState()
	const [securitiesOptions, setSecuritiesOptions] = useState([])
	const [selectedSecuritiesOptions, setSelectedSecuritiesOptions] = useState([])
	//const [transferAgents, setTransferAgents] = useState({})
	//const [accountInfoOptions] = useState(["Standard", "401(k)", "IRA", "Other retirement"])

	// Effects
	useAsyncEffect(loadSecurities,[])
	useAsyncEffect(loadBrokers,[])
	useAsyncEffect(loadBrokerDetails,[selectedBrokerOption])
	useAsyncEffect(loadSecurityDetails,[selectedSecuritiesOptions])

	const broker = selectedBrokerOption && brokers[selectedBrokerOption.id]
	const selectedSecurities = selectedSecuritiesOptions.map(option=>securities[option.id])
	console.log(selectedSecurities)
	return <Stack direction="column" spacing={4} className="project-page">
			<Typography style={{textAlign:"center"}}>This form can help you prepare your DRS request. We do not collect or process information entered here, nor submit the request on your behalf.</Typography>
			<Stack direction="row" spacing={1}>
				<Autocomplete
					style={{ flexGrow: 1 }}
					options={brokerOptions}
					getOptionLabel={(option) => option.label}
					value={selectedBrokerOption}
					onChange={(evt,val)=>setSelectedBrokerOption(val)}
					renderInput={(params) => <TextField {...params} label="Broker" placeholder="Your broker" />}
					/>
				{/*<Autocomplete
					style={{ flexGrow: 1 }}
					options={accountInfoOptions}
					renderInput={(params) => <TextField {...params} label="Account Type" placeholder="(Optional) Whether your account is a 401(k), IRA, etc." />}
					/>*/}
				</Stack>
			{broker && (
				broker.drs===undefined
					? <Typography>{l`Loading broker details...`}</Typography>
					: <BrokerDrsSummary broker={broker} />
				)}
			<Autocomplete
				multiple filterSelectedOptions
				options={securitiesOptions}
				getOptionLabel={(option) => option.label}
				value={selectedSecuritiesOptions}
				onChange={(evt,val)=>setSelectedSecuritiesOptions(val)}
				renderInput={(params) => (
					console.log({params}),<TextField
						{...params}
						label="Securities"
						placeholder="Securities (stocks/tickers) to DRS"
						/>
					)}
				/>
			<hr />
			{/*broker && broker.drsAvailable===false && <Typography>{l`Your broker does not handle DRS requests directly. However, there are still a few options you can use to register your shares`}</Typography>}
			{broker && broker.drsAvailable===true && <>
				<Typography>{l`Good news! Your broker does handle DRS requests!`}</Typography>
				</> */}
			{/*selectedSecurities.length>0 &&
				<table>
					<thead>
						<tr>
							<th>Ticker</th>
							<th>CUSIP</th>
							<th>Issuer</th>
							</tr>
						</thead>
					<tbody>
						{selectedSecurities?.map(([security,s]) =>
							<tr key={security?.id || console.log({s,security}),1}>
								<td>{security?.ticker}</td>
								<td>{security?.cusip}</td>
								<td>{security.issuerName}</td>
								</tr>
							)}
						</tbody>
					</table>
				*/}
		</Stack>


	function* loadSecurities(onCancel){
		const rawResponse = yield fetch('/data/securities.json',canceller(onCancel))
		const securitiesArr = yield rawResponse.json()
		const securitiesOptions = securitiesArr.map(s => ({id:s.id, label:`[${s.ticker.toUpperCase()}] ${s.issuer}`}))
		const securities = arrayToHash(securitiesArr)
		setSecurities(securities)
		setSecuritiesOptions(securitiesOptions)
		}
	function* loadBrokers(onCancel){
		const rawResponse = yield fetch('/data/brokers.json',canceller(onCancel))
		const brokersArr = yield rawResponse.json()
		const brokerOptions = brokersArr.map(b => ({id:b.id, label:b.name}))
		const brokers = arrayToHash(brokersArr)
		setBrokers(brokers)
		setBrokerOptions(brokerOptions)
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
	function* loadBrokerDetails(onCancel){
		if(!selectedBrokerOption){
			return
			}
		const selectedBroker = brokers[selectedBrokerOption.id]
		if(selectedBroker.drsAvailable !== undefined){
			return
			}
		const rawResponse = yield fetch(`/data/brokers/${selectedBroker.id}.json`,canceller(onCancel))
		const broker = yield rawResponse.json()
		setBrokers({
			...brokers,
			[selectedBroker.id]: broker
			})
		}
	function* loadSecurityDetails(onCancel){
		//const requests = []
		for(let option of selectedSecuritiesOptions){
			let security = securities[option.id]
			if(security.details){
				continue
				}
			const request =	fetchDetails(security)
			//requests.push(request)
			}
		//if(requests.length){setLoading("loading")}
		//yield Promise.all(requests)
		//setLoading("done")
		return

		async function fetchDetails(security){
			const securityDetails = await fetch(`/data/securities/drs/${security.id}.json`)
				.then(r=>({details:"ok", ...r.json()}))
				.catch(e=>({details:"error"}))
			const readyToSubmit = securityDetails.drs //TODO: fill out logic
			setSecurities({
				...securities,
				[security.id]:{
					...security,
					readyToSubmit,
					...securityDetails}
				})
			//TODO: This is needlessly complicated. There are only a handful of TA's, they should just be eagerly loaded ahead of time
			// const transferAgentId = securityDetails.transferAgentId
			// if(!transferAgentId){
			// 	return
			// 	}
			// const transferAgent = transferAgents[transferAgentId] || O
			// if(transferAgent.details){
			// 	return
			// 	}
			// const transferAgentDetails = await fetch(`/transfer-agents/drs-request/${transferAgentId}.json`)
			// 		.then(r=>r.json())
			// 		.catch(e=>({details:"error"}))
			// setTransferAgents({
			// 	...transferAgents,
			// 	[transferAgentId]:{...transferAgent, details:"ok", ...transferAgentDetails}
			// 	})
			}
		}

	}

function canceller(onCancel){
	const controller = new AbortController();
	onCancel(() => controller.abort())
	return controller
	}
function arrayToHash(arr, id="id"){
	let obj = {}
	for( let x of arr){
		obj[x[id]] = x
		}
	return obj
	}

export default DrsRequestTemplateScene
