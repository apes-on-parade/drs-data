#! /usr/bin/env node

import reactAppJsonBuilder from '../../common/react-app-json-builder.mjs'

reactAppJsonBuilder({
	inputPath: "/manual-data/brokers.csv",
	inputColumns:[
		// Name of Broker,Country,Language Spoken,Type,Direct DRS available?,CS # Required?,Letter of instruction,Notes,Expected Fee,Duration,Website,Twitter,English URL,Last Update,Translation Priority
		{csvHeader: 'Name of Broker', as:"name"},
		{csvHeader: 'Country', as:"countryCode"},
		{csvHeader: 'Website', as:"website"},
		{csvHeader: 'Language Spoken',		as: "languages"},
		{csvHeader: 'Direct DRS available?',as: "drsAvailable"},
		{csvHeader: 'CS # Required?',		as: "drsAccountRequired"},
		{csvHeader: 'Expected Fee',			as: "drsFee"},
		{csvHeader: 'Duration', 			as: "drsDuration"},
		{csvHeader: 'Language Spoken', 		as: "drsLoi"},
		{csvHeader: 'Notes', 				as: "notes"}
		],
	filter: row => row.name && row.website,
	projections:[
		({name}) => ({id: name.toLowerCase().replace(/\W+/g,"-")}),
		({drsAvailable}) => ({drsAvailable:
			drsAvailable==="Yes" ? true
			: drsAvailable==="No" ? false
			: undefined
			}),
		({drsAccountRequired}) => ({drsAccountRequired:
			drsAccountRequired==="Yes" ? true
			: drsAccountRequired=== "No" ? false
			: undefined}),
		({website}) => ({domain: (website.match(/https?:\/\/([^\/:#?]+)/)||[])[1]}),
		],
	id:"id",
	outputs:{
		"index":{
			type:"index",
			path: "/react-app/dev-data/brokers.json",
			fields:["id","name","countryCode","domain"]
			},
		"detail":{
			type:"detail",
			path: ({id})=>`/react-app/dev-data/brokers/detail/${id}.json`,
			fields:[
				"id","name", "website",
				"countryCode", "languages",
				"drsAvailable","drsAccountRequired",
				"drsFee", "drsDuration", "drsLoi",
				"notes"
				]
			},
		"drs-request":{
			type:"detail",
			path: ({id})=>`/react-app/dev-data/brokers/drs-request/${id}.json`,
			fields:[
				"id","name","domain", "languages",
				"drsAvailable","drsAccountRequired",
				"drsFee", "drsDuration", "drsLoi",
				"notes"
				]
			},

		}
	})
