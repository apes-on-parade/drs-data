import {BigQuery} from '@google-cloud/bigquery'
import {readFile, writeFile, mkdir} from 'node:fs/promises'
import pathLib from 'path'

main()

async function main() {
	const location = "US"
	const bq = new BigQuery({
		projectId: 'apes-on-parade-default',
		keyFilename: './secret/service-account-credentials.json'
		})
	const cliArgs = process.argv.filter((x,i) => i>=2 || !x.match(/node$|\.mjs$/))

	const queries = [
		{id:"issuers-index.sql",		output: outputIndex("/react-app/dev-data/data/issuers.json")},
		{id:"issuers-detail.sql",		output: outputFiles("/react-app/dev-data/data/issuers/")},
		{id:"securities-index.sql",		output: outputIndex("/react-app/dev-data/data/securities.json")},
		{id:"securities-detail-drs.sql",output: outputFiles("/react-app/dev-data/data/securities/drs/")},
		{id:"brokers-index.sql",		output: outputIndex("/react-app/dev-data/data/brokers.json")},
		{id:"brokers-detail-drs.sql",	output: outputFiles("/react-app/dev-data/data/brokers/")},
		{id:"transfer-agents-index.sql",	output: outputIndex("/react-app/dev-data/data/transfer-agents.json")},
		]

	const dryRun = cliArgs.length === 0
	const log = {}
	console.log(`Dry run: ${dryRun}`)

	for(let query of queries){
		const {id} = query
		const src = query.src ?? query.id
		console.log(`Query: ${id}`)
		const isSelected = cliArgs.includes(query.id)
		if(!dryRun && !isSelected){
			console.log(`	Skipping`)
			continue
			}
		const sql = await read(src)
		//console.log(`	SQL query loaded`)
		const [job] = await bq.createQueryJob({
			location,
			query: sql,
			dryRun
			})
		//console.log(`	Started as job ${job.id}`)
		//console.log(`	Status: ${job.metadata.status}`)
		const bytes = formatMb(job.metadata.statistics.totalBytesProcessed)
		const cache = job.metadata.statistics.query.cacheHit
		log[id]={bytes, cache}
		if(!dryRun){
			const [rows] = await job.getQueryResults()
			console.log(`	Received: ${rows.length} rows`)
			await query.output(rows)
			console.log(`	Output complete`)
			}
		}
	console.table(log)
	return
	}

async function read(file){
	return await readFile(new URL(file,import.meta.url), 'utf8')
	}
function outputFiles(path){
	return async function(data){
		const folder = new URL("../../.."+path, import.meta.url)
		try{ //How to appropriately guard this to not accidentally delete stuff? (at least I'm running on a VM...)
			await rm(folder, { recursive: true, force: true })
			}catch(e){}
		await mkdir(folder,{ recursive: true })
		for(let d of data){
			let id = d.id
			if(id === undefined){
				throw "`id` field is required"
				}
			await writeFile(
				new URL(`../../..${path}/${id}.json`, import.meta.url),
				JSON.stringify(d),
				{encoding:"utf8"}
				)
			}
		}
	}
function outputIndex(path){
	const fileLocation = new URL(`../../..${path}`, import.meta.url)
	return async function(data){
		const outputDir = new URL("../../.."+path.replace(/\/[^\/]+$/,""), import.meta.url)
		await mkdir(outputDir,{ recursive: true })
		//try{await rm(fileLocation)}catch(e){}
		const output = data
		// Used to output a hash instead of an array
		// let output = {}
		// for(let d of data){
		// 	let id = d.id
		// 	if(id === undefined){
		// 		throw "`id` field is required"
		// 		}
		// 	output[id] = d
		// 	}
		await writeFile(
			fileLocation,
			JSON.stringify(output),
			{encoding:"utf8"}
			)
		}
	}

function formatMb(bytes) {
	return Math.ceil(bytes/1e6).toString()+" Mb"
	}
