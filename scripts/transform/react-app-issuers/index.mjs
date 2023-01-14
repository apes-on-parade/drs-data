#! /usr/bin/env node

import {URL} from 'url';
import {readFile, writeFile} from "node:fs/promises"
import {parse} from 'csv-parse/sync'
//import {createHash} from 'node:crypto'

main({
	inputPath: "/scripts/extract/issuers-gorillionaire/output.csv",
	inputColumns:[
		{csvHeader: 'Exchange', as:"exchange"},
		{csvHeader: 'Ticker', as:"ticker"},
		{csvHeader: 'Company', as:"name"},
		{csvHeader: 'Transfer Agent', as:"transferAgent"},
		{csvHeader: 'Online Purchase?', as:"onlinePurchase"},
		//{csvHeader: 'Investor Relations', jsonKey:""},
		//{csvHeader: 'IR Phone #', jsonKey:""},
		//{csvHeader: 'DRS', jsonKey:""},
		//{csvHeader: 'Outstanding shares', jsonKey:""},
		//{csvHeader: "% of Shares DRS'd", jsonKey:""},
		//{csvHeader: 'CUSIP', jsonKey:""}
		],
	filter: row => row.exchange && row.ticker && row.name,
	projections:[
		({exchange,ticker}) => ({id: (exchange+':'+ticker).toUpperCase()})
		],
	indexBy:"id",
	outputPath: "/react-app/dist/issuers.json"
	})

async function main({
	inputPath,
	inputColumns,
	filter,
	projections,
	indexBy,
	outputPath
	}){
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
	const jsonObjects = csvData.map(row => {
		let obj = {}
		for(let column of inputColumns){
			obj[column.as] = row[column.csvHeader]
			}
		for(let projection of projections){
			Object.assign(obj, projection(obj))
			}
		return obj
		})
	const filteredObjects = jsonObjects.filter(filter)
	const countObjectsFiltered = jsonObjects.length - filteredObjects.length
	if(countObjectsFiltered > 0){
		console.warn(`${countObjectsFiltered} objects were filtered out by the requirement ${filter.toString().slice(0,80)}...`)
		}
	const indexedObject = filteredObjects
		.reduce(indexByKey(indexBy),{})
	await writeFile(
		new URL(`../../..${outputPath}`,import.meta.url),
		JSON.stringify(indexedObject)
		)
	}

async function readOrThrow(file,errorMessage){
	try{
		return await readFile(new URL(file,import.meta.url))
		}
	catch(e){
		console.error(e)
		throw new Error(errorMessage)
		}
	}

function indexByKey(key){
	return function(accum,x,i){
		return {...accum, [x[key]]:x}
		}
	}
// function hash(str){ const h = createHash('sha256').update(str); return h.digest('hex') }
