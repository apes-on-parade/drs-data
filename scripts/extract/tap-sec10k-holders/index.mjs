#! /usr/bin/env node

import * as cheerio from 'cheerio'
import {readFile} from "node:fs/promises"
import {csvWriter} from '../../common/index.mjs'

const writeCsv = csvWriter(import.meta.url)

main()

const promptPreamble =`For each prompt, report the number of stockholders/shareholders, if available. (Do NOT report the number of shares)

Prompt: As of February 1, 2023, there were approximately 82 stockholders of record of our common stock and 431,967,907 shares of common stock outstanding
Response: 82

Prompt: In February 2023, the Company's Board declared a $0.33 per share first quarter cash dividend on common shares outstanding, to be paid to stockholders of record as of February 14, 2023
Response: N/A

Prompt: As of January 31, 2023, there were 117 stockholders of record of our Class A common stock and 52 stockholders of record of our Class B common stock, with 10,000,000 shares and 2,500,000 shares outstanding, respectively, of each class
Response: 117 and 52

Prompt: The number of registered shareholders of our common stock on January 31, 2023 was 1,453
Response: 1453

Prompt: As of March 28, 2022, there were 286,069,451 shares of common stock issued and outstanding held by approximately 201 holders of record
Response: 201

`

async function main(){
	const config = JSON.parse(await readFile(new URL("config.json", import.meta.url)))
	const out = []
	const dates = ["2023-02-06","2023-02-03","2023-02-02","2023-02-01","2023-01-31"]
	for(const date of dates){
		const [year,month,day] = date.split('-')
		const quarter = Math.ceil(parseInt(month)/3)
		const idxText = await fetch(`https://www.sec.gov/Archives/edgar/daily-index/${year}/QTR${quarter}/crawler.${year}${month}${day}.idx`)
			.then(resp=>resp.ok && resp.text())
			.catch(e=>false)
		if(!idxText){
			console.log(`${date} not found. Skipping.`)
			continue
		}
		const idx10k = idxText.split("\n")
			.filter(line => line.match("  10-K"))
			.map(line => line.match(/ (10-K\/?A?)\s+([0-9]+)\s+([0-9]+)\s+(https?:\/\/.*\.html?)/) || [] )
			.map(([match,form,cik,date,url]) => match && {
				form,
				cik,
				url: url.replace("http://", "https://")
				})
		for(const idxEntry of idx10k){
			await wait(250)
			const indexText = await fetch(idxEntry.url)
				.then(resp=>resp.text())
			const doc = cheerio.load(indexText)
			const mainDocUrl = doc("#formDiv td>a").first().attr("href").replace("/ix?doc=","https://www.sec.gov")
			console.log({mainDocUrl})
			await wait(250)
			const docText = await fetch(mainDocUrl)
				.then(resp=>resp.text())
			const docSegments = docText
				.replace(/<\/?(b|i|strong|em|span)[^>]*>/g,"")
				.split(/<[^>]+>/)
				.filter(Boolean)
				.filter(str=> str.match(/holders/i) && str.match(/registered|of record/) && str.match(/[0-9][0-9]/))
				.map(str => str.replace(/&#(\d+);/gi, (match, n)=> String.fromCharCode(parseInt(n))))
				.map(str => str.replace(/&#x([0-9a-fA-F]+);/gi, (match, n)=> String.fromCharCode(parseInt(n,16))))
				.flatMap(paragraph => paragraph.split(/\. |\.$/g).map(str=>str.trim()).filter(Boolean))
				.filter(str=> str.match(/holders/i) && str.match(/registered|of record/) && str.match(/[0-9][0-9]/))
			console.log({docSegments})
			for(const segment of docSegments){
				// await wait(1250)
				// const languageResponse = await fetch("https://api.openai.com/v1/completions", {
				// 	method: "POST",
				// 	headers: {
				// 		'Content-Type': 'application/json',
				// 		Authorization: `Bearer ${config.openAiKey}`
				// 		},
				// 	body: JSON.stringify({
				// 		model: "text-curie-001",
				// 		prompt: promptPreamble + "Prompt: "+segment+"\nResponse: ",
				// 		temperature: 0.1,
				// 		max_tokens: 25
				// 		})
				// 	})
				// 	.then(resp=>resp.json())
				// 	.catch(e=>{error:e.toString()})
				// console.log({usage: languageResponse.usage})
				// const finding = languageResponse?.choices?.[0]?.text?.trim()
				const finding = "disabled"
				const row = {
					date,
					cik: idxEntry.cik,
					form: idxEntry.form,
					docUrl: mainDocUrl,
					segment,
					finding,
					message: finding ? "" : JSON.stringify(languageResponse)
					}
				console.log(row)
				out.push(row)
				}
			}
		}
		writeCsv({data:out})
	}

function wait(ms){
	return new Promise(res=>setTimeout(res,ms))
	}
