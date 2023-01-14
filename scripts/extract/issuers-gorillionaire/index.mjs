#! /usr/bin/env node

import * as cheerio from 'cheerio'
import {csvWriter} from '../../common/index.mjs'

const writeCsv = csvWriter(import.meta.url)

const expectedColumns = [
	'Exchange',
	'Ticker',
	'Company',
	'Transfer Agent',
	'Online Purchase?',
	'Investor Relations',
	'IR Phone #',
	'DRS',
	'Outstanding shares',
	"% of Shares DRS'd",
	'CUSIP'
	]

main()

async function main(){
	const rawResponse = await fetch("https://transferagents.eth.limo/")
	const body = await rawResponse.text()
	const doc = cheerio.load(body)
	const rows = doc("tr").get()
	const numberOfNonDataRows = 6
	const data = rows.slice(numberOfNonDataRows).map(row=>
		doc("td",row).get()
		.map(cell => doc(cell).text())
		.map(text => text.match(/^\d+$/) ? parseInt(text) : text)
		)
	const columns = data[0]
	for (let expectedColumn of expectedColumns){
		if(!columns.includes(expectedColumn)){
			console.warn(`Warn: Column '${expectedColumn}' previously existed in this dataset, and is now missing (or the start of the table has been moved in the sheet)`)
			}
		}
	await writeCsv({data})
	}
