import {URL} from 'url'
import {stringify} from 'csv-stringify/sync'
import {writeFile} from "node:fs/promises"

export {csvWriter}

function csvWriter(folder){
	console.log(folder)
	return async function writeCsv({data, csvOptions, filename='./output.csv'}){
		const csv = stringify(data, csvOptions)
		const path = new URL(filename, folder).pathname
		await writeFile(path, csv)
		}
}
