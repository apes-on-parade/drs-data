import {URL} from 'url';
import {writeFile, mkdir} from "node:fs/promises"
import {parse} from 'csv-parse/sync'
import {readOrThrow} from "./index.mjs"

export default reactAppJsonBuilder

async function reactAppJsonBuilder({
	inputPath,
	inputColumns,
	projections,
	filter,
	id,
	outputs
	}){
	const filenameRegex = /[^\/]*\.[^.\/]+$/
	const csvText = await readOrThrow(
		inputPath,
		`Required file ${inputPath} not found.`
		+ inputPath.includes('output.csv') ? `\nMaybe try running 'node ${inputPath.replace('output.csv','index.mjs')}?`:''
		)
	const csvData = parse(csvText,{columns:true,skip_empty_lines:true})
	const csvColumns = Object.keys(csvData[0])

	for(let column of inputColumns){
		if(!csvColumns.includes(column.csvHeader)){
			throw new Error(`Could not find expected column '${column.csvHeader}'`)
			}
		}
	const objects = csvData.map(row => {
		let obj = {}
		for(let column of inputColumns){
			obj[column.as] = row[column.csvHeader]
			}
		for(let projection of projections){
			Object.assign(obj, projection(obj))
			}
		return obj
		})
	const filteredObjects = objects.filter(filter)
	const countObjectsFiltered = objects.length - filteredObjects.length
	if(countObjectsFiltered > 0){
		console.warn(`${countObjectsFiltered} objects were filtered out by the requirement ${filter.toString().slice(0,80)}...`)
		}

	for(let output of Object.values(outputs||{})){
		const outputObjects = filteredObjects
			.map(select(output.fields))
		switch(output.type){
			case "index":
				const indexedObject = outputObjects
					.reduce(indexByKey(id),{})
				await mkdir(
					new URL("../.."+output.path.replace(filenameRegex,""), import.meta.url),
					{recursive: true}
					)
				await writeFile(
					new URL("../.."+output.path, import.meta.url),
					JSON.stringify(indexedObject)
					)
				break
			case "detail":
				await mkdir(
					new URL("../.."+output.path({id:'foo'}).replace(filenameRegex,""),import.meta.url),
					{recursive: true}
					)
				for(let obj of outputObjects){
					await writeFile(
						new URL("../.."+output.path(obj),import.meta.url),
						JSON.stringify(obj)
						)
					}
				break
			default: console.error(`Missing/invalid output type`)
			}
		}
	}

function indexByKey(key){
	return function(accum,x,i){
		return {...accum, [x[key]]:x}
		}
	}
function select(fields){
	return function(obj){
		let ret = {}
		for(let field of fields){
			ret[field]=obj[field]
			}
		return ret
		}
	}
