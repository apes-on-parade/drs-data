import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import useAsyncEffect from "@n1ru4l/use-async-effect"
import defaultTranslation from "../../default-translation.mjs"

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
// import Autocomplete from '@mui/material/Autocomplete'
// import Select from '@mui/material/Select'
// import MenuItem from '@mui/material/MenuItem'
// import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const O = {}

const BrokerDrsSummary = function(props){
	//Localization
	const {locale='en'} = useParams('locale')
	const [l,setLocalization] = useState(defaultTranslation)
	useAsyncEffect(loadLocalization,[locale])

	//Props
	const {broker} = props
	const {name, country, drs} = broker
	const {hasDirect,transferUnavailable,isExpensive,doesRequireAccount,expectedFee,expectedDuration} = drs

	//State
	const [fragment, setFragment] = useState(<></>)

	useEffect(()=>setFragment(determineFragment()),[l,broker])

	return fragment

	function determineFragment(){
		if(country === "US" || country === "UM"){ //UM is temporary data error workaround. Remove check later
			if(hasDirect){return drs()}
			if(!hasDirect){
				if(!transferUnavailable){return usTransfer()}
				if(transferUnavailable){return usRepurchase()}
				}
			}
		if(country !== "US"){
			if(hasDirect === false){
				if(transferUnavailable === false){return nonusTransfer()}
				if(transferUnavailable === true){return nonusRepurchase()}
				}
			if(hasDirect === true){
				if(isExpensive === true){return nonusExpensive()}
				else{
					if(!doesRequireAccount){return drs()}
					if(doesRequireAccount){return nonusPreexisting()}
					}
				}
			}
		return;

		function drs(){return <p>
			{l`Good news! ${name} is able to directly DRS shares upon your request. `}
			{(expectedDuration ? l`Expect the request to take ${expectedDuration} to process. `:"")}
			{l`You can always consult our broker-specific guide for step-by-step instructions.`}
			</p>}
		function usTransfer(){return <>
			<p>{l`${name} cannot DRS transfer, but can transfer to other brokers. To DRS, you will first need to transfer to a broker that can DRS, for example Fidelity. See our Fidelity Route Guide`}</p>
			<Stack direction="row" justifyContent="center"><Button variant="contained" href="#">{l`Fidelity Route Guide`}</Button></Stack>
			</>}
		function usRepurchase(){return <>
			<p>
			{l`${name} cannot DRS transfer, and cannot transfer to other brokers. To DRS, you will need to close out your position and rebuy with a DRS-capable broker or the transfer agent directly.`}
			</p>
			<Stack direction="row" justifyContent="center"><Button variant="contained" href="#">{l`U.S. Sell+Repurchase Guide`}</Button></Stack>
			</>}
		function nonusTransfer(){return <>
			<p>
			{l`${name} cannot DRS transfer, but can transfer to other brokers. To DRS, you will first need to transfer to a broker that can DRS, for example Interactive Brokers (IBKR).`}
			</p>
			<Stack direction="row" justifyContent="center"><Button variant="contained" href="#">{l`IBKR Route Guide`}</Button></Stack>
			</>}
		function nonusExpensive(){return <>
			<p>
			{l`${name} can DRS transfer, but charges an excessive fee to do so (${expectedFee}). Although you may DRS directly from this broker, we instead recommend first transfering to a broker that can DRS for a reasonable cost, for example Interactive Brokers (IBKR).`}
			</p>
			<Stack direction="row" justifyContent="center"><Button variant="contained" href="#">{l`IBKR Route Guide`}</Button></Stack>
			</>}
		function nonusPreexisting(){return <>
			<p>{l`This broker requires a pre-existing account at the transfer agent. See our guide to creating an initial account.`}</p>
			<Stack direction="row" justifyContent="center"><Button variant="contained" href="#">{l`Creating an Initial Account Guide`}</Button></Stack>
			<p>{l`You can always consult our broker-specific guide for step-by-step instructions.`}</p>
			</>}
		function nonusRepurchase(){return <>
			<p>{l`${name} cannot DRS transfer, and cannot transfer to other brokers. To DRS, you will need to close out your position and rebuy with a DRS broker or the transfer agent directly.`}</p>
			<Stack direction="row" justifyContent="center"><Button variant="contained" href="#">{l`Non-U.S. Sell+Repurchase Guide`}</Button></Stack>.
			</>}
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

export default BrokerDrsSummary
