import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
//import {useDebounce} from 'use-debounce'
import useAsyncEffect from "@n1ru4l/use-async-effect"

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
	const [l,setLocalization] = useState(()=>()=>"...")
	useAsyncEffect(loadLocalization,[locale])

	//Core state
	const [securities, setSecurities] = useState()
	const [brokers, setBrokers] = useState()
	const [securitiesOptions, setSecuritiesOptions] = useState([])
	const [brokerOptions, setBrokerOptions] = useState([])
	const [selectedSecuritiesOptions, setSelectedSecuritiesOptions] = useState([])
	const [selectedBrokerOption,  setSelectedBrokerOption] = useState(null)
	const [transferAgents, setTransferAgents] = useState({})

	//const [accountInfoOptions] = useState(["Standard", "401(k)", "IRA", "Other retirement"])


	useAsyncEffect(loadSecurities,[])
	useAsyncEffect(loadBrokers,[])
	useAsyncEffect(loadBrokerDetails,[selectedBrokerOption])
	useAsyncEffect(loadSecurityDetails,[selectedSecurityOptions])

	const broker = selectedBrokerOption && brokers[selectedBrokerOption.id]
	const selectedSecurities = selectedSecurititesOptions.map(option=>securities[option.id])

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
			<Autocomplete
				multiple filterSelectedOptions
				options={securitiesOptions}
				getOptionLabel={(option) => option.label}
				value={selectedSecuritiesOptions}
				onChange={(evt,val)=>setSelectedSecurititesOptions(val)}
				renderInput={(params) => (
					<TextField
						{...params}
						label="Securities"
						placeholder="Securities (stocks/tickers) to DRS"
						/>
					)}
				/>
			<hr />
			{broker && broker.drsAvailable===undefined && <Typography>{l`Loading broker details...`}</Typography>}
			{broker && broker.drsAvailable===false && <Typography>{l`Your broker does not handle DRS requests directly. However, there are still a few options you can use to register your shares`}</Typography>}
			{broker && broker.drsAvailable===true && <>
				<Typography>{l`Good news! Your broker does handle DRS requests!`}</Typography>
				</>}
			{selectedSecurities.length>0 &&
				<table>
					<thead>
						<tr>
							<th>Issuer</th>
							<th>Ticker</th>
							<th>CUSIP</th>
							<th>Transfer Agent</th>
							<th>Transfer Agent <br />DTC Member ID</th>
							<th>Transfer Agent <br />Address</th>
							</tr>
						</thead>
					<tbody>
						{selectedSecurities.map(security =>
							<tr key={security.id}>
								<td>{security.ticker}</td>
								<td>{security.cusip}</td>
								<td>{security.issuerName}</td>
								<td>{(transferAgents[security.transferAgentId]||O).name}</td>
								<td>{security.transferAgentId || ""}</td>
								<td>{(transferAgents[security.transferAgentId]||O).address}</td>
								</tr>
							)}
						</tbody>
					</table>
				}
		</Stack>


	function* loadSecurities(onCancel){
		const rawResponse = yield fetch('/securities.json',canceller(onCancel))
		const securities = yield rawResponse.json()
		const securitiesOptions = Object.values(securities)
			.map(s=>({id:s.id, label:`[${s.ticker.toUpperCase()}] ${s.issuerName}`}))
		setSecurities(securities)
		setSecuritiesOptions(securitiesOptions)
		}
	function* loadBrokers(onCancel){
		const rawResponse = yield fetch('/brokers.json',canceller(onCancel))
		const brokers = yield rawResponse.json()
		const brokerOptions = Object.values(brokers)
			.map(b=>({id:b.id, label:b.name}))
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
		const rawResponse = yield fetch(`/brokers/drs-request/${selectedBroker.id}.json`,canceller(onCancel))
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
			const securityDetails = await fetch(`/securities/${security.id}.json`)
				.then(r=>r.json())
				.catch(e=>({details:"error"}))
			setSecurities({
				...security,
				[security.id]:{...security, details:"ok", ...securityDetails}
				})
			//TODO: This is needlessly complicated. There are only a handful of TA's, they should just be eagerly loaded ahead of time
			const transferAgentId = securityDetails.transferAgentId
			if(!transferAgentId){
				return
				}
			debugger;
			const transferAgent = transferAgents[transferAgentId] || O
			if(transferAgent.details){
				return
				}
			const transferAgentDetails = await fetch(`/transfer-agents/drs-request/${transferAgentId}.json`)
					.then(r=>r.json())
					.catch(e=>({details:"error"}))
			setTransferAgents({
				...transferAgents,
				[transferAgentId]:{...transferAgent, details:"ok", ...transferAgentDetails}
				})
			}
		}
	}

function canceller(onCancel){
	const controller = new AbortController();
	onCancel(() => controller.abort())
	return controller
	}

export default DrsRequestTemplateScene
