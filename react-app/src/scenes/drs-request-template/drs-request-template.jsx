import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
//import {useDebounce} from 'use-debounce'
import useAsyncEffect from "@n1ru4l/use-async-effect"
import defaultTranslation from "../../common/default-translation.mjs"
import BrokerDrsSummary from "../../common/components/broker-drs-summary/broker-drs-summary.jsx"
import SecurityDrsGuide from "../../common/components/security-drs-guide/security-drs-guide.jsx"

//import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
//import WarningIcon from '@mui/icons-material/Warning'

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
	const attentionNeededSecurities = selectedSecurities.filter(s=>s.readyToSubmit===false).length

	return <Stack direction="column" spacing={4} className="project-page">
		<style>{`@media print {.noprint{display: none;}}`}</style>
		<Typography className="noprint" style={{textAlign:"center"}}>This form can help you prepare your DRS request. We do not collect or process information entered here, nor submit the request on your behalf.</Typography>
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
		<div className="noprint">
			{broker && (
				broker.drs===undefined
					? <Typography>{l`Loading broker details...`}</Typography>
					: <BrokerDrsSummary broker={broker} />
				)}
			</div>
		<Autocomplete
			multiple filterSelectedOptions
			options={securitiesOptions}
			getOptionLabel={(option) => option.label}
			value={selectedSecuritiesOptions}
			onChange={(evt,val)=>setSelectedSecuritiesOptions(val)}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Securities"
					placeholder="Securities (stocks/tickers) to DRS"
					/>
				)}
			/>
		{selectedSecurities.length>0 && <>
			{attentionNeededSecurities==1 && <Typography className="noprint">⚠️ {attentionNeededSecurities} security requires attention.</Typography>}
			{attentionNeededSecurities>1 && <Typography className="noprint">⚠️ {attentionNeededSecurities} securities require attention.</Typography>}
			{selectedSecurities?.map(security =>
				<SecurityDrsGuide key={security.id} security={security} removeSelf={removeSecurity(security.id)}/>
				)}
			</>}
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
				.then(r=>r.json()).then(d=>({details:"ok",...d}))
				.catch(e=>({details:"error"}))

			const readyToSubmit = !!(
				securityDetails.latestClaimedTransferAgent
				&& securityDetails.latestClaimedTransferAgent.dtcMemberId
				&& securityDetails.allClaimedTransferAgents?.map(ta=>ta.dtcMemberId).filter(unique).length===1
				)
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
	function removeSecurity(id){
		return function(){
			setSelectedSecuritiesOptions(selectedSecuritiesOptions.filter(opt=>opt.id!==id))
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
function unique(x,i,arr){return arr.indexOf(x)===i}
export default DrsRequestTemplateScene
