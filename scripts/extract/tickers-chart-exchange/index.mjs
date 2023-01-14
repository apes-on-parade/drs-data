#! /usr/bin/env node

import * as pathLib from 'path'
import {readFile,writeFile} from "node:fs/promises"

const extractors = {
	sharesOutstanding: tableExtractor("Shares Out."),
	sharesFloat: tableExtractor("Float"),
	sharesDrs: tableExtractor("DRS")
	}

main()

async function main(){
	const config = JSON.parse(await readFile(new URL("config.json", import.meta.url)))
	const header = ["Exchange-ticker", ...Object.keys(extractors)]
	const data = []

	for (let slug of config.slugs){
		const rawResponse = await fetch(`https://chartexchange.com/symbol/${slug}/`)
		const body = await rawResponse.text()
		const row = [
			slug,
			...Object.values(extractors).map(fn=>{try{return fn(body)}catch(e){return e && e.message || e}})
			]
		console.log(row.map(d=>JSON.stringify(d).slice(0,10)).join("\t"))
		data.push(row)
		await pause(1250)
		}
	const outputUrl = new URL("ticker-data.csv", import.meta.url)
	const output = header.map(h=>JSON.stringify(h)).join('\t')
		+ "\n"
		+ data.map(row=>
			row.map(cell=>JSON.stringify(cell)).join('\t')
			).join('\n')
	await writeFile(outputUrl, output)
	}


function pause(ms){
	return new Promise(resolve=>setTimeout(resolve,ms))
	}

function tableExtractor(label, valueFormat = "-?[0-9,]+%?"){
	return function(page){
		const escapedLabel = label.replace(/[.]/g, char=>"\\"+char)
		const regex = new RegExp(`>${escapedLabel}</div><div style="[^"]*" class="cx-font-uniwidth"><div style="text-align: right;">(${valueFormat})<\/div>`)
		const [match,valueString] = page.match(regex) || []
		if(!match){return "Not available"}
		const value = parseInt(valueString.replace(/,|%/g,""))
		const isPercentage = valueString.match(/%/)
		return (value
			? (isPercentage
				? value / 100
				: value
				)
			: valueString
			)
		}
	}
