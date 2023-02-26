#! /usr/bin/env node

import * as pathLib from 'path'
import {csvWriter} from "../../common/index.mjs"

const writeCsv = csvWriter(import.meta.url)

main()

async function main(){
	const rawResponse = await fetch("https://www.sec.gov/files/company_tickers_exchange.json")
	const json = await rawResponse.json()
	await writeCsv({
		csvOptions:{
			columns: json.fields,
			header: true
			},
		data: json.data
		})
	}
