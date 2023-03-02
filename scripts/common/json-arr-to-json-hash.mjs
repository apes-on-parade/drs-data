#! /usr/bin/env node

/*

Example use:

node ~/drs-data/scripts/common/json-arr-to-json-hash.mjs ~/drs-data/manual-data/issuers-index.json ~/drs-data/react-app/dev-data/issuers.json

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
	const input = JSON.parse(await readFile(inputPath,{encoding:"utf8"}))
	let output = {}
	for(let val of input){
		let id = val.id
		output[id] = val
		}
	await writeFile(outputPath, JSON.stringify(output)+"\n", {encoding:"utf8"})

	}
