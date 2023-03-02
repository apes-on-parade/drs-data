#! /usr/bin/env node

/*

Example use:

cd ~/drs-data/react-app/dev-data/issuers/detail
node ~/drs-data/scripts/common/ndjson-to-files.mjs ~/drs-data/manual-data/issuers-detail.ndjson

*/

import {readFile, writeFile} from "node:fs/promises"

console.log(process.argv)

if(!process.argv[0].match(/node$/)){
	console.error("sanity check")
	}

main()

async function main(){
	const inputPath = process.argv[2]
	const input = await readFile(inputPath,{encoding:"utf8"})
	const lines = input.split("\n")
	for(let line of lines){
		if(!line){continue}
		let data = JSON.parse(line)
		let id = data.id
		await writeFile(`${id}.json`, line, {encoding:"utf8"})
		}
	}
