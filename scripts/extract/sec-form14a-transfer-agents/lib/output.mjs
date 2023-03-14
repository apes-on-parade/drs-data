import {open,writeFile} from "node:fs/promises"
import {stringify} from 'csv-stringify/sync'

async function Output(basePath){
	const path = new URL("output.csv", basePath)
	const statePath = new URL("state.json", basePath)
	const header = "filingDate,cik,textHash,formUrl,htmlUrl,textOfInterest\n"
	try{await writeFile(path, header, {encoding: "utf8", flag:"wx"})} //x flag means it fails if the file already exists
	catch(e){}

	const file = await open(path, "a")

	return {
		emitRow: async function emitRow(row){
			await file.write(stringify([[
				row.filingDate,
				row.cik,
				row.textHash,
				row.formUrl,
				row.htmlUrl,
				row.textOfInterest,
				// row.openaiUncertain,
				// row.openaiFinding
				]]))
			},
		emitState: async function emitState(state){
			await writeFile(
				statePath,
				JSON.stringify(state)
				)
			},
		close: async function close(){return await file.close()}
		}
	}

export {Output}
