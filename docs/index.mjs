import { h, text, app as App } from "https://unpkg.com/hyperapp"

const [div,h1,h3,input] =
	  "div,h1,h3,input".split(",").map(tag => (...args) => h(tag,...args))

const UpdateQuery = (state, event) => ({
	...state,
	query: event.target.value,
	filteredIssuers:
		event.target.value.trim() === ""
		? Object.keys(state.issuerx)
		: Object.values(state.issuerx)
			.filter(issuer=>issuer["Company"].toLowerCase().indexOf(event.target.value.trim().toLowerCase())!=-1)
			.map(issuer=>issuer["#"])
	})

const Load = async (effectDone) => {
	let rawResponse = await fetch("data/issuers.csv")
	let responseText = await rawResponse.text()
	// This is NOT a general purpose CSV parser!!
	// It works only because I know I specifically encode strings in a JSON compatible notation
	let lines = responseText.split("\n").filter(Boolean).map(line => line.split("\t"))
	let cols = lines[0].map(cell=>JSON.parse(cell))
	let issuers = lines.slice(1).map(row =>
		row.reduce((obj,x,i)=>
			({...obj, [cols[i]]:JSON.parse(x) })
			,{}))
	let issuerx = issuers.reduce(indexBy("#"),{})
	console.log(issuerx)
	effectDone(LoadFinish, {issuerx})
}

const LoadFinish = (state, {issuerx}) =>({
	...state,
	query: "",
	issuerx,
	filteredIssuers:Object.keys(issuerx)
	})

function indexBy(property){
	return (obj,x,i) => ({...obj,[x[property]]:x})
	}

let app = App({
	init: [
		{
			query: "",
			filteredIssuers: [],
			issuerx: undefined,
			},
		[Load]
		],
	view: ({query, filteredIssuers, issuerx }) =>
	div({id:"main"}, [
		h1({}, text("Issuers")),
		(	!issuerx
			? div({},text("Loading..."))
			: div({}, [
				input({type:"text", placeholder:"Filter...", value:query, oninput:UpdateQuery }),
				div({className:"items"},
					filteredIssuers.map(issuerId =>
						div({className:"item"},[
							div({className:"item-title"},text(issuerx[issuerId]["Company"])),
							div({},text(issuerx[issuerId]["Transfer Agent"]))
							])
						)
					)
				])
			)
		]),
	node: document.body,
})

//app(Load)
