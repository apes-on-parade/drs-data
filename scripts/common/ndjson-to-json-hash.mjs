#! /usr/bin/env node

/*

Example use:

node ~/drs-data/scripts/common/ndjson-to-json-hash.mjs ~/drs-data/manual-data/issuers-index.json ~/drs-data/react-app/dev-data/issuers.json

*/

import {readFile, writeFile} from "node:fs/promises"

if(!process.argv[0].match(/node$/)){
	throw ("sanity check")
	}
if(!process.argv[2]){
	throw ("Argument 1 (input path) required")
	}
if(!process.argv[3]){
	throw ("Argument 2 (output path) required")
	}


main()

async function main(){
	const inputPath = process.argv[2]
	const outputPath = process.argv[3]
	const input = await readFile(inputPath,{encoding:"utf8"})
	const lines = input.split("\n")
	let output = {}
	for(let line of lines){
		if(!line){continue}
		let data = JSON.parse(line)
		let id = data.id
		output[id] = data
		}
	await writeFile(outputPath, JSON.stringify(output)+"\n", {encoding:"utf8"})
	}
