#! /usr/bin/env node

import * as cheerio from 'cheerio'
import {readFile} from "node:fs/promises"
import {parse} from 'csv-parse/sync'
import {readOrThrow} from '../../common/index.mjs'
import {Output} from './lib/output.mjs'
import {createHash} from 'crypto'
import {OpenaiInterpret} from './lib/openai-interpret.mjs'

main()


async function main(){

	const config = JSON.parse(await readFile(new URL("config.json", import.meta.url)))
	const openaiInterpret = OpenaiInterpret(config.openAiKey)

	const cikPath = '/scripts/extract/cik-tickers-sec/output.csv'
	const cikCsv = parse(await readOrThrow(
			cikPath,
			`Required file ${cikPath} not found.`
			+ cikPath.includes('output.csv') ? `\nMaybe try running 'node ${cikPath.replace('output.csv','index.mjs')}?`:''
			)
		,{columns:true,skip_empty_lines:true})
	const isNyseNasdaqByCik = new Map()
	for(let row of cikCsv){
		if(row.exchange === "NYSE" || row.exchange === "Nasdaq"){isNyseNasdaqByCik.set(row.cik,true)}
		}
	//console.log(cikInfo.size)

	let state = await getState()
	console.log({state})
	let slice
	const output = await Output(import.meta.url)
	while(
		await output.emitState(state),
		state = slice && slice.nextState || state,
		slice = getSlice({start:config.startDate, end:config.endDate, min:state.min, max:state.max, lastHash:state.lastHash})
		){
		const {date} = slice
		console.log("\n### "+date)

		const [year,month,day] = date.split('-')
		const quarter = Math.ceil(parseInt(month)/3)

		await wait(600)
		const idxText = await fetch(`https://www.sec.gov/Archives/edgar/daily-index/${year}/QTR${quarter}/crawler.${year}${month}${day}.idx`)
			.then(resp=>resp.ok && resp.text())
			.catch(e=>false)
		if(!idxText){
			console.log(`    ${date} not found. Skipping.`)
			continue
		}
		const idx10k = idxText.split("\n")
			.filter(line => line.match(" DEF 14A "))
			.map(line => line.match(/ (DEF 14A)\s+([0-9]+)\s+([0-9]+)\s+(https?:\/\/.*\.html?)/) || [] )
			.map(([match,form,cik,date,url]) => match && {
				form,
				cik,
				url: url.replace("http://", "https://")
				})
			.filter(Boolean)
		for(const idxEntry of idx10k){

			if(!isNyseNasdaqByCik.get(idxEntry.cik)){
				continue
				}

			console.log("Url: "+idxEntry.url.slice(0,115))
			if(state.lastUrl){
				if(idxEntry.url == state.lastUrl){
					console.log("     State lastUrl reached")
					delete state.lastUrl
					}
				else {continue}
				}

			await wait(600)
			const indexText = await fetch(idxEntry.url)
				.then(resp=>resp.text())
			const doc = cheerio.load(indexText)
			const mainDocUrl = doc("#formDiv td>a").first()?.attr("href")?.replace("/ix?doc=","https://www.sec.gov").replace(/^\//,"https://www.sec.gov/")
			if(!mainDocUrl){continue}
			//console.log("Doc: "+mainDocUrl.slice(0,115))
			if(state.lastUrl){
				if(mainDocUrl == state.lastUrl){
					console.log("     State lastUrl reached")
					delete state.lastUrl
					}
				else {continue}
				}

			await wait(500)
			let docText
			try{docText = await fetch(mainDocUrl).then(resp=>resp.text())}
			catch(e){console.error(">>> ⛔️ ",e); continue}

			let docSegments = docText
				.replace(/<\/?(b|i|strong|em|span)[^>]*>/g,"")
				.split(/<[^>]+>/)
				.filter(Boolean)
				.filter(str=> str.match(/holders/i) && str.match(/registered|of record/) && str.match(/[0-9][0-9]/))
				.map(str => str.replace(/&#(\d+);/gi, (match, n)=> String.fromCharCode(parseInt(n))))
				.map(str => str.replace(/&#x([0-9a-fA-F]+);/gi, (match, n)=> String.fromCharCode(parseInt(n,16))))
				.flatMap(paragraph => paragraph.split(/\. |\.$/g).map(str=>str.trim()).filter(Boolean))
				.filter(str=>
					str.match(/transfer agent/i)
					&& str.match(/ComputerShare|AST|American Stock|Equiniti|Continental|Broadridge/i)
					)
			if(!docSegments.length){docSegments = ["No segments matched"]}

			for(const segment of docSegments){
				const textHash = createHash('sha1').update(date+idxEntry.cik+segment).digest('base64').slice(0,12)
				if(state.lastHash){
					console.log("     " + state.lastHash + "  " + textHash)
					if(textHash == state.lastHash){delete state.lastHash}
					continue
					}

				// const interpretation = await openaiInterpret(segment)
				//
				// for(let e of interpretation.errors){console.error(">>> ⛔️ "+JSON.stringify(e))}
				//
				// console.log("  > "
				// 	+ (interpretation.uncertainty==0 ? "  " : interpretation.uncertainty==1 ? "? " :"??" )
				// 	+ "  " + interpretation.finding.slice(0,15).padEnd(15," ")
				// 	+ "  " + JSON.stringify(interpretation.alternatives.map(a=>a.slice(0,15))).slice(0,40).padEnd(40," ")
				// 	+ "  " + interpretation.traceId.padEnd(20," ")
				// 	+ "  " + segment.replace(/\s+/g," ").slice(0,100)
				// 	)
				const row = {
					filingDate: date,
					cik: idxEntry.cik,
					textHash,
					formUrl: idxEntry.url,
					htmlUrl: mainDocUrl,
					textOfInterest: segment,
					// openaiUncertain: "".padEnd(interpretation.uncertainty,"?"),
					// openaiFinding: interpretation.finding,
					}
				output.emitRow(row)
				}
			}
		}
		output.close()
	}

function wait(ms){
	return new Promise(res=>setTimeout(res,ms))
	}

async function getState(){
	// Could eventually read state.json instead, but this seems more practical for now
	let csvText
	try{csvText = await readFile(new URL("output.csv", import.meta.url))}
	catch(e){return {}}
	const currentData = parse(csvText,{columns:true,skip_empty_lines:true})
	if(!currentData.length){return {}}
	const dates = currentData.map(r=>r.filingDate)
	const lastUrl = currentData.slice(-1)[0].formUrl
	const lastHash = currentData.slice(-1)[0].textHash
	return {
		min: dates.reduce(min),
		max: dates.reduce(max),
		lastUrl,
		lastHash
		}
	}
function getSlice({start,end,min,max,lastHash}){
	/* Given a min->max date from the state, and a start->end target from the config,
	  returns a date to run next, and a nextState that expaons the min->max range by that date */
	const oneDay = 24*60*60*1000
	const yesterday = new Date(new Date() - oneDay)

	if(!start){start="2010-01-01"}
	if(!end){end="2050-01-01"}
	const startDate = new Date(start)
	const endDate = new Date(end)

	if(!max){max = min}
	if(!min){
		let targetDate = (endDate < yesterday ? endDate
			: startDate > yesterday ? startDate
			: yesterday
			).toISOString().slice(0,10)
		return {
			date: targetDate,
			nextState: {
				min: targetDate,
				max: targetDate
				}
			}
		}

	const minDate = new Date(min)
	const maxDate = new Date(max)
	let targetDate
	let nextState
	if(startDate<minDate){
		targetDate = lastHash ? minDate.toISOString().slice(0,10)
			: (new Date(minDate - oneDay)).toISOString().slice(0,10)
		nextState = {max, min:targetDate}
	}
	else if(maxDate<endDate && maxDate < yesterday ){
		targetDate = lastHash ? maxDate.toISOString().slice(0,10)
			: (new Date(maxDate + oneDay)).toISOString().slice(0,10) //TODO: check for date logic correctness
		nextState = {min, max:targetDate}
	}
	return {
		date: targetDate,
		nextState
		}
	}

function min(a,b){return a<b ? a : b}
function max(a,b){return a>b ? a : b}
function indexBy(prop){return (accum,x)=>({...accum, [x[prop]]:x})}
