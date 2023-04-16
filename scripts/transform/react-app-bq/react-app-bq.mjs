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
		//{id:"issuersIndex",		src:"issuers-index.sql",		output: outputIndex("/react-app/dev-data/data/issuers.json")},
		{id:"issuersDetail",	src:"issuers-detail.sql",		output: outputFiles("/react-app/dev-data/data/issuers/")},
		//{id:"brokersIndex",		src:"brokers-index.sql",		output: outputIndex("/react-app/dev-data/data/brokers.json")},
		// {id:"brokersDetail",	src:"brokers-detail.sql",		output: outputFiles("/react-app/dev-data/data/brokers/")},
		// {id:"transferAgents",	src:"transfer-agents.sql",	output: outputIndex("/react-app/dev-data/data/transfer-agents.json")},
		// {id:"securitiesIndex",	src:"securities-index.sql",	output: outputIndex("/react-app/dev-data/data/securities.json")},
		// {id:"securitiesDetail",	src:"securities-detail.sql"),	output: outputFiles("/react-app/dev-data/data/securities/")},
		]

	const dryRun = cliArgs.length === 0
	console.log(`Dry run: ${dryRun}`)

	for(let query of queries){
		console.log(`\nQuery: ${query.id}\n####################`)
		const isSelected = cliArgs.includes(query.id)
		if(!dryRun && !isSelected){
			console.log(`	Skipping`)
			continue
			}
		const sql = await read(query.src)
		console.log(`	SQL query loaded`)
		const [job] = await bq.createQueryJob({
			location,
			query: sql,
			dryRun
			})
		console.log(`	Started as job ${job.id}`)
		console.log(`	Status: ${job.metadata.status}`)
		console.log('	Bytes: ', formatMb(job.metadata.statistics.totalBytesProcessed))
		console.log('	Cache: ', job.metadata.statistics.query.cacheHit)

		if(!dryRun){
			const [rows] = await job.getQueryResults()
			console.log(`	Received: ${rows.length} rows`)
			await query.output(rows)
			console.log(`	Output complete`)
			}
		}
	return

}

async function read(file){
	return await readFile(new URL(file,import.meta.url), 'utf8')
	}
function outputFiles(path){
	return async function(data){
		await mkdir(
			new URL("../../.."+path, import.meta.url),
			{ recursive: true }
			)
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
	return async function(data){
		await mkdir(
			new URL("../../.."+path.replace(/\/[^\/]+$,""/), import.meta.url),
			{ recursive: true }
			)
		let output = {}
		for(let d of data){
			let id = d.id
			if(id === undefined){
				throw "`id` field is required"
				}
			output[id] = d
			}
		await writeFile(
			new URL(`../../..${path}`, import.meta.url),
			JSON.stringify(output),
			{encoding:"utf8"}
			)
		}
	}

function formatMb(bytes) {
	return Math.ceil(bytes/1e6).toString()+" Mb"
	}
