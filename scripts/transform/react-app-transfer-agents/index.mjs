#! /usr/bin/env node

import reactAppJsonBuilder from '../../common/react-app-json-builder.mjs'

reactAppJsonBuilder({
	inputPath: "/manual-data/transfer-agents.csv",
	inputColumns:[
		//DTC Member Number,Short Name,Full Name,WixDynamicContentId,Address,Serviced Stocks URL
		{csvHeader: 'DTC Member Number', as:"dtcMemberId"},
		{csvHeader: 'Short Name', as:"shortName"},
		{csvHeader: 'Full Name', as:"name"},
		{csvHeader: 'Serviced Stocks URL', as:"stocksUrl"},
		//{csvHeader: 'WixDynamicContentId', as:""},
		{csvHeader: 'Address', as:"address"},
		],
	projections:[
		({stocksUrl}) => ({domain: (stocksUrl.match(/https?:\/\/([^\/:#?]+)/)||[])[1]}),
		({dtcMemberId}) => ({id:dtcMemberId}),
		],
	filter: row => row.id && row.name,
	id:"id",
	outputs:{
		"index":{
			type:"index",
			path: "/react-app/dev-data/transfer-agents.json",
			fields:["id","name","shortName","domain"]
			},
		"drs-request":{
			type:"detail",
			path: ({id})=>`/react-app/dev-data/transfer-agents/drs-request/${id}.json`,
			fields:["id","name","dtcMemberId","address"]
			}
		}
	})
