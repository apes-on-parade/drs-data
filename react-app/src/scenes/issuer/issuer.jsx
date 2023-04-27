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

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

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
			{issuer.holders?.totalHolders
				&& <FactRow
					label={l`Holders of Record`}
					info={l`The number of holders of record, a.k.a. registered shareholders, as stated on the company's most recently retrieved annual 10-K filing on ${issuer.holders.filingDate}`}
					>
					<Typography>
						{parseInt(issuer.holders.totalHolders).toLocaleString("en-US")}
						{issuer.holders.docUrls.map((url,u)=>
							<sup key={u}> <a href={"https://www.sec.gov/Archives/edgar/data/"+url} target="_blank">[{u+1}]</a> </sup>
							)}
						</Typography>

					</FactRow>
				}
			{issuer.transferAgent?.name
				&& <FactRow
					label={l`Transfer Agent`}
					info={l`An issuer's transfer agent maintains that issuer's official shareholder list/ledger, and is central to the direct registerd ownership of securities. See our Glossary for more info.`}
					>
					<Typography>{issuer.transferAgent.name}</Typography>
					</FactRow>
				}
			{issuer.transferAgent?.dtcMemberId
				&& <FactRow
					label={l`Transfer Agent DTC Member #`}
					info={l`The 'Member Number' identifying the transfer agent at the Depository Trust Company (DTC). This number can be used for more explicit DRS requests.`}
					>
					<Typography>{issuer.transferAgent.dtcMemberId}</Typography>
					</FactRow>
				}
			{issuer.tickers?.length &&
				<Box>
					<Typography variant="h3">Publicly-traded securities</Typography>
					<TableContainer>
						<Table sx={{ minWidth: 650 }}>
							<TableHead sx={{fontWeight:"bold"}}>
								<TableRow>
									<TableCell>CUSIP</TableCell>
									<TableCell align="center">Exchange</TableCell>
									<TableCell align="center">Ticker</TableCell>
									<TableCell align="center">Direct Purchase?</TableCell>
									</TableRow>
								</TableHead>
							<TableBody>
								{issuer.tickers.map(t => (
									<TableRow key={t.cusip}>
										<TableCell component="th" scope="row">
											{t.cusip}
										</TableCell>
										<TableCell align="center">{t.exchange}</TableCell>
										<TableCell align="center">{t.ticker}</TableCell>
										<TableCell align="center">{t.hasOnlinePurchase===true?"Yes":t.hasOnlinePurchase===false?"No":t.hasOnlinePurchase||"Unknown"}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Box>
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
		const rawResponse = yield fetch(`/data/issuers/${issuerId}.json`,canceller(onCancel))
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
