import {URL} from 'url'
import {stringify} from 'csv-stringify/sync'
import {readFile, writeFile} from "node:fs/promises"

export {
	csvWriter,
	readOrThrow
	}

function csvWriter(folder){
	//console.log(folder)
	return async function writeCsv({data, csvOptions, filename='./output.csv'}){
		const csv = stringify(data, csvOptions)
		const path = new URL(filename, folder).pathname
		await writeFile(path, csv)
		}
	}

async function readOrThrow(file,errorMessage){
	try{
		return await readFile(new URL("../.."+file,import.meta.url))
		}
	catch(e){
		console.error(e)
		throw new Error(errorMessage)
		}
	}
