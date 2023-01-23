#! /usr/bin/env node

import {URL} from 'url';
import {readFile, writeFile, mkdir} from "node:fs/promises"
import {parse} from 'csv-parse/sync'
//import {createHash} from 'node:crypto'
import {readOrThrow} from '../../common/index.mjs'

main({
	inputPath: "/manual-data/brokers.csv",
	inputColumns:[
		// Name of Broker,Country,Language Spoken,Type,Direct DRS available?,CS # Required?,Letter of instruction,Notes,Expected Fee,Duration,Website,Twitter,English URL,Last Update,Translation Priority
		{csvHeader: 'Name of Broker', as:"name"},
		{csvHeader: 'Country', as:"countryCode"},
		{csvHeader: 'Website', as:"website"},
		{csvHeader: 'Direct DRS available?', as:"hasDrs"},
		{csvHeader: 'CS # Required?', as:"destinationAccountRequired"},
		//{csvHeader: 'Investor Relations', jsonKey:""},
		//{csvHeader: 'IR Phone #', jsonKey:""},
		//{csvHeader: 'DRS', jsonKey:""},
		//{csvHeader: 'Outstanding shares', jsonKey:""},
		//{csvHeader: "% of Shares DRS'd", jsonKey:""},
		//{csvHeader: 'CUSIP', jsonKey:""}
		],
	filter: row => row.name && row.website,
	projections:[
		({name}) => ({id: name.toLowerCase().replace(/\W+/g,"-")}),
		({hasDrs}) => ({hasDrs: hasDrs==="Yes"?true : hasDrs==="No"?false : undefined}),
		({destinationAccountRequired}) => ({destinationAccountRequired: destinationAccountRequired==="Yes"?true : destinationAccountRequired==="No"?false : undefined}),
		({website}) => ({domain: (website.match(/https?:\/\/([^\/:#?]+)/)||[])[1]}),
		],
	id:"id",
	ouputs:{
		"index":{
			type:"index"
			path: "../../../react-app/dev-data/brokers.json",
			fields:["id","name","countryCode","domain"]
			},
		"drs-request":{
			type:"detail",
			path: ({id})=>`../../../react-app/dev-data/brokers/drs-request/${id}.json`,
			fields:["id","name","countryCode","domain","hasDrs","destinationAccountRequired"]
			}
		}
	})

async function main({
	inputPath,
	inputColumns,
	filter,
	projections,
	id,
	ouputs
	}){
	const filenameRegex = /[^\/]*\.[^.\/]+$/
	const csvText = await readOrThrow(
		`../../..${inputPath}`,
		`Required file ${inputPath} not found.`
		+ inputPath.includes('output.csv') ? `\nMaybe try running 'node ${inputPath.replace('output.csv','index.mjs')}?`:''
		)
	const csvData = parse(csvText,{columns:true,skip_empty_lines:true})
	const csvColumns = Object.keys(csvData[0])

	for(let column of inputColumns){
		if(!csvColumns.includes(column.csvHeader)){
			throw new Error(`Could not find expected column '${column.csvHeader}'`)
			}
		}
	const objects = csvData.map(row => {
		let obj = {}
		for(let column of inputColumns){
			obj[column.as] = row[column.csvHeader]
			}
		for(let projection of projections){
			Object.assign(obj, projection(obj))
			}
		return obj
		})
	const filteredObjects = objects.filter(filter)
	const countObjectsFiltered = objects.length - filteredObjects.length
	if(countObjectsFiltered > 0){
		console.warn(`${countObjectsFiltered} objects were filtered out by the requirement ${filter.toString().slice(0,80)}...`)
		}

	for(let output of Object.values(outputs||{})){
		const outputObjects = filteredObjects
			.map(select(output.fields))
		switch(output.type){
			case "index":
				const indexedObject = outputObjects
					.reduce(indexByKey(id),{})
				await mkdir(
					new URL(output.path.replace(filenameRegex,""), import.meta.url),
					{recursive: true}
					)
				await writeFile(
					new URL(output.path, import.meta.url),
					JSON.stringify(indexedObject)
					)
				break
			case "detail":
				await mkdir(
					new URL(output.path({id:'foo'}).replace(filenameRegex,""),import.meta.url),
					{recursive: true}
					)
				for(let obj of outputObjects){
					await writeFile(
						new URL(output.path(obj),import.meta.url),
						JSON.stringify(obj)
						)
					}
				break
			default: console.error(`Missing/invalid output type`)
			}
	}

function indexByKey(key){
	return function(accum,x,i){
		return {...accum, [x[key]]:x}
		}
	}
function select(fields){
	return function(obj){
		let ret = {}
		for(let field of fields){
			ret[field]=obj[field]
			}
		return ret
		}
	}
