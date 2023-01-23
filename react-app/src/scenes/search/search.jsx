import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {useDebounce} from 'use-debounce'
import useAsyncEffect from "@n1ru4l/use-async-effect"

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
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
	textOverflow: "ellipsis",
	fontSize: "16pt",
	flexGrow: 1
	}
const cardsPerPage=12

const SearchScene = (props) => {
	//const {} = props

	//Localization
	const {locale='en'} = useParams('locale')
	const [l,setLocalization] = useState(()=>()=>"...")
	useAsyncEffect(loadLocalization,[locale])

	// Core state
	const [queryText, setQueryText] = useState("")
	const [issuers, setIssuers] = useState()
	const [brokers, setBrokers] = useState()
	const [transferAgents, setTransferAgents] = useState()
	const [issuersPaging, setIssuersPaging] = useState({page:0})
	const [brokersPaging, setBrokersPaging] = useState({page:0})

	// Core state TODO
	// const [view, setView] = useState(TABLE|GRID)

	// Derived state
	const [debouncedQueryText] = useDebounce(queryText,250)
	const [filteredIssuerIds, setFilteredIssuerIds] = useState([])
	const [filteredBrokerIds, setFilteredBrokerIds] = useState([])
	const [filteredTransferAgentIds, setFilteredTransferAgentIds] = useState([])
	const [visibleIssuerIds, setVisibleIssuerIds] = useState([])
	const [visibleBrokerIds, setVisibleBrokerIds] = useState([])

	// Effects
	useEffect(load,[])
	useAsyncEffect(loadIssuers,[])
	useAsyncEffect(loadBrokers,[])
	useAsyncEffect(loadTransferAgents,[])

	useEffect(filterIssuers,[debouncedQueryText,issuers])
	useEffect(filterBrokers,[debouncedQueryText,brokers])
	useEffect(filterTransferAgents,[debouncedQueryText,transferAgents])
	useEffect(reflectStateToUrl, [debouncedQueryText])

	useEffect(paginateIssuers,[filteredIssuerIds, issuersPaging])
	useEffect(paginateBrokers,[filteredBrokerIds, brokersPaging])


	return (
		<Stack direction="column" spacing={4} className="project-page">
			<Typography style={{textAlign:"center"}}> {l`We have compiled reference data on the top US issuers, transfer agents, and brokers.`}</Typography>
			<TextField
				id='query-input-field'
				label={l`Query`}
				placeholder={l`Search Issuers, Transfer Agents, and Brokers`}
				style={{width:"100%", minWidth:"20em"}}
				value={queryText}
				onChange={changeQueryText}
				></TextField>

			<Typography variant="h3">{l`Issuers`}</Typography>
			{ !issuers
				? <Typography>{l`Loading...`}</Typography>
				: <Stack direction="column" spacing={4}>
					<Stack direction="row"
						justifyContent="flex-start"
						alignItems="flex-start"
						spacing={0}
						sx={{ flexWrap: 'wrap', gap: 1 }}
						>
						{visibleIssuerIds.map(iid=>{
							const issuer = issuers[iid]
							return <Card sx={{ width: 320, marginLeft: 2, marginRight: 2 }} key={issuer.id}>
								<CardContent>
									<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
										{issuer.ticker} ({issuer.exchange})
										</Typography>
									<Stack direction="row" alignItems="center" spacing={1}>
										{/*<Logo domain={issuer.domain} />*/}
										<Typography component="div" style={styleMaxTwoLines}>
											{issuer.name}
											</Typography>
										</Stack>
									<Typography variant="body2">
										{issuer.transferAgent}
										</Typography>
									</CardContent>
								<CardActions>
									<Button size="small">{l`More details`}</Button>
									</CardActions>
								</Card>
							})}
						</Stack>
						{issuersPaging.pages>1 &&
							<Stack direction="row"
								alignItems="center"
								justifyContent="center"
								divider={<Divider orientation="vertical" flexItem />}
								>
								<Button onClick={decrementIssuersPage} disabled={issuersPaging.page<=0}>◀</Button>
								<Typography sx={{marginLeft:3, marginRight:3}}>{l`Page ${issuersPaging.page+1} of ${issuersPaging.pages}`}</Typography>
								<Button onClick={incrementIssuersPage} disabled={issuersPaging.page>=issuersPaging.pages-1} >▶</Button>
							</Stack>
						}
					</Stack>
				}

			<Typography variant="h3">{l`Transfer Agents`}</Typography>
			{ !transferAgents
				? <Typography>{l`Loading...`}</Typography>
				: <Stack direction="row"
					justifyContent="flex-start"
					alignItems="flex-start"
					spacing={0}
					sx={{ flexWrap: 'wrap', gap: 1 }}
					>
					{filteredTransferAgentIds.map(taid=>{
						const transferAgent = transferAgents[taid]
						return <Card sx={{ width: 320, marginLeft: 2, marginRight: 2 }} key={transferAgent.dtcMemberId}>
							<CardContent>
								<Stack direction="row" alignItems="center" spacing={1}>
									<Logo domain={transferAgent.domain} />
									<Typography component="div" style={styleMaxTwoLines}>
										{transferAgent.shortName || transferAgent.name}
										</Typography>
									</Stack>
								<Typography variant="body2">
									{transferAgent.name}
									</Typography>
								</CardContent>
							<CardActions>
								<Button size="small">{l`More details`}</Button>
								</CardActions>
							</Card>
						})}
					</Stack>
				}

			<Typography variant="h3">{l`Brokers`}</Typography>
			{ !brokers
				? <Typography>{l`Loading...`}</Typography>
				: <Stack direction="column" spacing={4}>
					<Stack direction="row"
						justifyContent="flex-start"
						alignItems="flex-start"
						spacing={0}
						sx={{ flexWrap: 'wrap', gap: 1 }}
						>
						{visibleBrokerIds.map(bid=>{
							const broker = brokers[bid]
							return <Card sx={{ width: 320, marginLeft: 2, marginRight: 2 }} key={broker.id}>
								<CardContent>
									<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
										{broker.countryCode}
										</Typography>
									<Stack direction="row" alignItems="center" spacing={1}>
										<Logo domain={broker.domain} />
										<Typography component="div" style={styleMaxTwoLines}>
											{broker.name}
											</Typography>
										</Stack>
									</CardContent>
								<CardActions>
									<Button size="small">{l`More details`}</Button>
									</CardActions>
								</Card>
							})}
						</Stack>
						{brokersPaging.pages>1 &&
							<Stack direction="row"
								alignItems="center"
								justifyContent="center"
								divider={<Divider orientation="vertical" flexItem />}
								>
								<Button onClick={decrementBrokersPage} disabled={brokersPaging.page<=0}>◀</Button>
								<Typography sx={{marginLeft:3, marginRight:3}}>{l`Page ${brokersPaging.page+1} of ${brokersPaging.pages}`}</Typography>
								<Button onClick={incrementBrokersPage} disabled={brokersPaging.page>=brokersPaging.pages-1} >▶</Button>
							</Stack>
						}
					</Stack>
				}

			<Typography style={{textAlign:"center"}}><a href="https://clearbit.com">{l`Logos provided by Clearbit`}</a></Typography>
			</Stack>
		)

	function load(){
		setQueryText(new URLSearchParams(document.location.search).get("q") || '')
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
	function* loadIssuers(onCancel){
		const rawResponse = yield fetch('/issuers.json',canceller(onCancel))
		const issuers = yield rawResponse.json()
		setIssuers(issuers)
		}
	function* loadBrokers(onCancel){
		const rawResponse = yield fetch('/brokers.json',canceller(onCancel))
		const brokers = yield rawResponse.json()
		setBrokers(brokers)
		}
	function* loadTransferAgents(onCancel){
		const rawResponse = yield fetch('/transfer-agents.json',canceller(onCancel))
		const transferAgents = yield rawResponse.json()
		setTransferAgents(transferAgents)
		}

	function changeQueryText(event){setQueryText(event.target.value)}
	function reflectStateToUrl(){
		history.replaceState(null, "", `#q=${encodeURIComponent(queryText)}`)
		}

	function filterIssuers(){
		if(!issuers){
			return
			}
		const query = debouncedQueryText.trim().toLowerCase()
		const filteredIssuerIds =
			query === ""
			? Object.keys(issuers)
			: Object.values(issuers)
			 	.filter(i =>
					i.name.toLowerCase().includes(query)
					|| i.ticker.toLowerCase().includes(query)
					)
				.map(i => i.id)
		setFilteredIssuerIds(filteredIssuerIds)
		const pages = Math.ceil(filteredIssuerIds.length/cardsPerPage)
		setIssuersPaging({page:0, pages})
		}

	function filterBrokers(){
		if(!brokers){
			return
			}
		const query = debouncedQueryText.trim().toLowerCase()
		const filteredBrokerIds =
			query === ""
			? Object.keys(brokers)
			: Object.values(brokers)
			 	.filter(b =>
					b.name.toLowerCase().includes(query)
					)
				.map(b => b.id)
		setFilteredBrokerIds(filteredBrokerIds)
		const pages = Math.ceil(filteredBrokerIds.length/cardsPerPage)
		setBrokersPaging({page:0, pages})
		}
	function filterTransferAgents(){
		if(!transferAgents){
			return
			}
		const query = debouncedQueryText.trim().toLowerCase()
		const filteredTransferAgentIds =
			query === ""
			? Object.keys(transferAgents)
			: Object.values(transferAgents)
				.filter(ta =>
					ta.name.toLowerCase().includes(query)
					|| ta.shortName.toLowerCase().includes(query)
					)
				.map(i => i.dtcMemberId)
		setFilteredTransferAgentIds(filteredTransferAgentIds)
		}

	function paginateIssuers(){
		const visibleIssuerIds = filteredIssuerIds.slice(
			issuersPaging.page*cardsPerPage,
			(issuersPaging.page+1)*cardsPerPage
			)
		setVisibleIssuerIds(visibleIssuerIds)
		}
	function incrementIssuersPage(){
		const {page, pages} = issuersPaging
		if(page<pages-1){
			setIssuersPaging({page:page+1, pages})
			}
		}
	function decrementIssuersPage(){
		const {page, pages} = issuersPaging
		if(page>0){
			setIssuersPaging({page:page-1, pages})
			}
		}

	function paginateBrokers(){
		const visibleBrokerIds = filteredBrokerIds.slice(
			brokersPaging.page*cardsPerPage,
			(brokersPaging.page+1)*cardsPerPage
			)
		setVisibleBrokerIds(visibleBrokerIds)
		}
	function incrementBrokersPage(){
		const {page, pages} = brokersPaging
		if(page<pages-1){
			setBrokersPaging({page:page+1, pages})
			}
		}
	function decrementBrokersPage(){
		const {page, pages} = brokersPaging
		if(page>0){
			setBrokersPaging({page:page-1, pages})
			}
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

function Logo({domain}){
	const [didError, setDidError] = useState(undefined)

	return <img
		style={{display: didError ? 'none' : 'inline-block', boxShadow: '1px 1px 4px 0px rgba(0,0,0,0.33)'}}
		onError={onError}
		src={`https://logo.clearbit.com/${domain}?s=48`}
		/>

	function onError(){setDidError(true)}
}

export default SearchScene
