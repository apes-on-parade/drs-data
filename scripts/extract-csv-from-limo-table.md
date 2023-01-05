
https://transferagents.eth.limo/

```js
console.log((new Array(...document.querySelectorAll("tr"))).slice(5).map(row=>
  (new Array(...row.querySelectorAll("td")))
  .map(cell=>cell.innerText.match(/^\d+$/)?parseInt(cell.innerText):cell.innerText)
  .map(value=>JSON.stringify(value))
  .join("\t")
).join("\n"))
```
