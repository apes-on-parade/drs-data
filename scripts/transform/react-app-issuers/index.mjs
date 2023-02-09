#! /usr/bin/env node

import reactAppJsonBuilder from '../../common/react-app-json-builder.mjs'

// TODO: We need to get the DTC member ID into the issuers dataset, trying to match things by name is not reliable
const transferAgentsByName = {
	"Computershare": 7807,
	"Continental Stock Transfer & Trust Co.": 7808,
	"American Stock Transfer & Trust Co.": 7805,
	"Odyssey Trust Company": 7822,
	"VStock Transfer LLC": 7924,
	"Broadridge Corporate Issuer Solutions, Inc.": 7824,
	"VStock Transfer, LLC": 7924,
	"Continental Stock Transfer and Trust": 7808
	}

reactAppJsonBuilder({
	inputPath: "/scripts/extract/issuers-gorillionaire/output.csv",
	inputColumns:[
		//Exchange,Ticker,Company,Transfer Agent,Online Purchase?,Investor Relations,IR Phone #,DRS,Outstanding shares,% of Shares DRS'd,CUSIP
		{csvHeader: 'Exchange', as:"exchange"},
		{csvHeader: 'Ticker', as:"ticker"},
		{csvHeader: 'Company', as:"name"},
		{csvHeader: 'Transfer Agent', as:"transferAgentName"},
		{csvHeader: 'Online Purchase?', as:"onlinePurchase"},
		{csvHeader: 'CUSIP', as:"cusip"}
		],
	projections:[
		({exchange,ticker}) => ({id: (exchange+':'+ticker.replace(/\W+/g,"-")).toUpperCase()}),
		({transferAgentName}) =>({transferAgentId:transferAgentsByName[transferAgentName]})
		],
	filter:()=>true,
	id:"id",
	outputs:{
		"index":{
			type:"index",
			path: "/react-app/dev-data/issuers.json",
			fields:["id","name","ticker","exchange"]
			},
		// "drs-request":{
		// 	type:"detail",
		// 	path: ({id})=>`/react-app/dev-data/issuers/drs-request/${id}.json`,
		// 	fields:["id","name","countryCode","cusip","transferAgentId"]
		// 	}
		}
	})
