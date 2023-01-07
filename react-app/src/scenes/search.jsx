import React, {useEffect, useState} from 'react'
import {useDebounce} from 'use-debounce'
import useAsyncEffect from "@n1ru4l/use-async-effect"

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent'

const styleMaxTwoLines = {
	display: "-webkit-box",
	boxOrient: "vertical",
	lineClamp: 2,
	overflow: "hidden",
	textOverflow: "ellipsis"
	}

const SearchScene = (props) => {
	//const {} = props

	// Core state
	const [queryText, setQueryText] = useState("")
	const [issuers, setIssuers] = useState()
	const [transferAgents, setTransferAgents] = useState()

	// Core state TODO
	// const [view, setView] = useState(TABLE|GRID)
	// const [expandIssuers]
	// const [expandTransferAgents]
	// const [expandBrokers]

	// Derived state
	const [debouncedQueryText] = useDebounce(queryText,250)
	const [filteredIssuerIds, setFilteredIssuerIds] = useState([])
	const [filteredTransferAgentIds, setFilteredTransferAgentIds] = useState([])

	// Effects
	useAsyncEffect(loadIssuers,[])
	useEffect(filterIssuers,[debouncedQueryText,issuers])
	useEffect(filterTransferAgents,[debouncedQueryText,transferAgents])

	return (
		<Stack direction="column" spacing={4} className="project-page">
			<Typography> We have compiled reference data on the top US issuers, transfer agents, and brokers.</Typography>
			<TextField
				id='query-input-field'
				label='Query'
				placeholder='Search Issuers, Transfer Agents, and Brokers'
				style={{width:"100%", minWidth:"20em"}}
				value={queryText}
				onChange={changeQueryText}
				></TextField>
			<Typography variant="h3">Issuers</Typography>
			{ !issuers
				? <Typography>Loading...</Typography>
				: <Stack direction="row"
					justifyContent="flex-start"
					alignItems="flex-start"
					spacing={0}
					sx={{ flexWrap: 'wrap', gap: 1 }}
					>
					{filteredIssuerIds.map(iid=>{
						const issuer = issuers[iid]
						return <Card sx={{ minWidth: 275, marginLeft: 2, marginRight: 2 }} key={issuer["#"]}>
							<CardContent>
								<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
									{issuer["Ticker"]}
									</Typography>
								<Typography variant="h5" component="div" sx={styleMaxTwoLines}>
									{issuer.Company}
									</Typography>
								<Typography variant="body2">
									{issuer["Transfer Agent"]}
									</Typography>
								</CardContent>
							<CardActions>
								<Button size="small">More details</Button>
								</CardActions>
							</Card>
						})}
					</Stack>
				}
			<Typography variant="h3">Transfer Agents</Typography>
			{ !transferAgents
				? <Typography>Loading...</Typography>
				: <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={4}>

					</Stack>
				}
			</Stack>
		)

	function changeQueryText(event){setQueryText(event.target.value)}
	function* loadIssuers(onCancel){
		const rawResponse = yield fetch('/issuers.csv',canceller(onCancel))
		const responseText = yield rawResponse.text()
		// This is NOT a general purpose CSV parser!!
		// It works only because I know I specifically encode strings in a JSON compatible notation
		const lines = responseText.split("\n").filter(Boolean).map(line => line.split("\t"))
		const cols = lines[0].map(cell=>JSON.parse(cell))
		const issuerList = lines.slice(1).map(row =>
			row.reduce((obj,x,i)=>
				({...obj, [cols[i]]:JSON.parse(x) })
				,{}))
		const issuers = issuerList.reduce(indexBy("#"),{})
		setIssuers(issuers)
		}
	function filterIssuers(){
		if(!issuers){
			return
			}
		const query = debouncedQueryText.trim().toLowerCase()
		if(query === ""){
			setFilteredIssuerIds(Object.keys(issuers))
			return
			}
		const filteredIssuerIds =
			Object.values(issuers)
		 	.filter(i =>
				i["Company"].toLowerCase().indexOf(query)!==-1
				|| i["Ticker"].toLowerCase().indexOf(query)!==-1
				)
			.map(i => i["#"])
		setFilteredIssuerIds(filteredIssuerIds)
		}
	async function loadTransferAgents(){} //TODO
	function filterTransferAgents(){
		if(!transferAgents){
			return
			}
		const query = debouncedQueryText.trim().toLowerCase()
		if(query === ""){
			setFilteredTransferAgentIds(Object.keys(transferAgents))
			return
			}
		// TODO once we know the columns in this dataset
		// const filteredTransferAgentIds =
		// 	Object.values(transferAgents)
		// 	.filter(i => true) //TODO
		// 	.map(i => i["#"]) //TODO
		// setFilteredTransferAgentIds(filteredTransferAgentIds)
		}
	}

function canceller(onCancel){
	const controller = new AbortController();
	onCancel(() => controller.abort())
	return controller
	}

function indexBy(property){
	return (obj,x,i) => ({...obj,[x[property]]:x})
	}

export default SearchScene
