#! /usr/bin/env node

import reactAppJsonBuilder from '../../common/react-app-json-builder.mjs'

// TODO: We need to get the DTC member ID into the issuers dataset, trying to match things by name is not reliable

reactAppJsonBuilder({
	inputPath: "/manual-data/issuers.csv",
	inputColumns:[
		//Stock Symbol	Exchange	Company Name	Transfer Agent	Online Purchase?	DTC Member #	Transfer Agent %	IR Emails	IR Phone #	IR /Company Address	IR Contact Info	Shares Outstanding	CUSIP	Company Info	Full Progress %	CIK	DRS	% of Shares DRS'd	TA URL	IR URL	Company Info URL	SIP Symbol	Security Name	Stock Number	ISIN	DMM Firm Name	DMM Clearing Symbol	DMM Clearing Number	Depositary Bank	Lead Market Maker	Invest. Min.	Initial Min. Investment	Add'l Investment Min.	Discount Offered	Plan Type
		{csvHeader: 'Exchange', as:"exchange"},
		{csvHeader: 'Stock Symbol', as:"ticker"},
		{csvHeader: 'Company Name', as:"name"},
		{csvHeader: 'DTC Member #', as:"transferAgentDtcMemberId"}, //Not exactly a foreign key, because sometimes ambiguously resovled from a name to 2 possible id's
		{csvHeader: 'Transfer Agent', as:"transferAgentName"},
		{csvHeader: 'Online Purchase?', as:"onlinePurchase"},
		{csvHeader: 'CUSIP', as:"cusip"}
		],
	projections:[
		({exchange,ticker}) => ({id: ([exchange,ticker.replace(/\W+/g,"-")].join(":")).toUpperCase()}),
		({transferAgentName}) => ({detail: transferAgentName ? true : undefined})
		],
	filter:({exchange,ticker,transferAgentName})=> ticker && transferAgentName && (exchange=="NYSE" || exchange=="Nasdaq"),
	id:"id",
	outputs:{
		"index":{
			type:"index",
			path: "/react-app/dev-data/issuers.json",
			fields:["id","name","ticker","detail"]
			},
		"detail":{
			type: "detail",
			filter: ({detail}) => !!detail,
			path: ({id})=>`/react-app/dev-data/issuers/detail/${id}.json`,
			fields:["id","name","ticker","exchange","transferAgentName","transferAgentDtcMemberId", "cusip", "onlinePurchase"]
			}
		// "drs-request":{
		// 	type:"detail",
		// 	path: ({id})=>`/react-app/dev-data/issuers/drs-request/${id}.json`,
		// 	fields:["id","name","countryCode","cusip","transferAgentId"]
		// 	}
		}
	})
