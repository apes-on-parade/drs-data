import {BigQuery} from '@google-cloud/bigquery'
import {readOrThrow} from "../../common/index.mjs"

const bq = new BigQuery({
	projectId: 'apes-on-parade-default',
	keyFilename: './secret/service-account-credentials.json'
	})

// WIP
//main()

async function main() {
	const location = "US"

	const queries = [
		{id:"issuersIndex",		sql:read("issuers-index.sql"),		output: outputIndex("/react-app/dev-data/data/issuers.json")},
		{id:"issuersDetail",	sql:read("issuers-detail.sql"),		output: outputFiles("/react-app/dev-data/data/issuers")},
		//{id:"brokersIndex",	sql:read("brokers-index.sql"),		output: outputIndex("/react-app/dev-data/data/brokers.json")},
		{id:"brokersDetail",	sql:read("brokers-detail.sql"),		output: outputFiles("/react-app/dev-data/data/brokers")},
		{id:"transferAgents",	sql:read("transfer-agents.sql"),	output: outputIndex("/react-app/dev-data/data/transfer-agents.json")},
		{id:"securitiesIndex",	sql:read("securities-index.sql"),	output: outputIndex("/react-app/dev-data/data/securities.json")},
		{id:"securitiesDetail",	sql:read("securities-detail.sql"),	output: outputFiles("/react-app/dev-data/data/securities")},
		]


	throw "TODO"
	//TODO: require cli args to choose which queries to run. If missing, dry-run them and output predicted cost

	for(let query of queries){
		console.log(`Query: ${query.id}`)
		const [job] = await bq.createQueryJob({
			location,
			query: query.sql
			})
		console.log(`	Started as job ${job.id}`)
		const [rows] = await job.getQueryResults()
		console.log(`	Received ${rows.length} rows`)
		await query.output(rows)
		}
	return

}

async function read(file){
	return await readFile(new URL(file,import.meta.url))
	}
function outputFiles(path){
	return function(data){
		throw "TODO"
		//TODO; copy from /scripts/common/nondjson-to-files.mjs
		}
	}
function outputIndex(path){
	return function(data){
		throw "TODO"
		//TODO; copy from /scripts/common/json-arr-to-json-hash.mjs
		}
	}
