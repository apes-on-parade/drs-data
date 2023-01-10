
A config.sjon file needs to be provided with the following format:

```
{
	"slugs":[
		"nyse-gme",
		...
	]
}
```

Given the current format of the limo sheet as of 2023-01-09, the following code in the command-line can be used to get this list of slugs (for NYSE & NASDAQ)

```
console.log(JSON.stringify(
	(new Array(...document.querySelectorAll("tr"))).slice(5)
		.map(row=>{
			let cells = (new Array(...row.querySelectorAll("td")))
			return {
				exchange: cells[0].innerText,
				ticker: cells[1] ? cells[1].innerText : ""
				}
			})
		.filter(row=>row.exchange.match(/NYSE|NASDAQ/))
		.map(row=>row.exchange.toLowerCase()+"-"+row.ticker.toLowerCase())
))
```
