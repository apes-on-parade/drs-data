#! /usr/bin/env node

import * as pathLib from 'path'
import {writeFile} from "node:fs/promises"

main()

async function main(){
	const rawResponse = await fetch("https://www.sec.gov/files/company_tickers_exchange.json")
	const json = await rawResponse.json()
	const csv = json.fields.map(f=>JSON.stringify(f)).join(",")
		+ "\n"
		+ json.data.map(row=>
			row.map(value=>JSON.stringify(value)).join(",")
			)
			.join("\n")
	await writeFile("cik_tickers.csv", csv)
	}
