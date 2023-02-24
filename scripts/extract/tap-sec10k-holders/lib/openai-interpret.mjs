import {writeFile} from "node:fs/promises"

const promptPreamble = {
a: `For each prompt, report the number of stockholders/shareholders, if available.

Prompt: As of February 1, 2023, there were approximately 82 stockholders of record of our common stock and 431,967,907 shares of common stock outstanding.
Response: 82.

Prompt: As of February 28, 2023, there were 1,300,000 shares outstanding of our common stock.
Response: N/A.

Prompt: As of February 10, 2023, there were approximately 31 unitholders of record of our common units.
Response: 31.

Prompt: As of January 31, 2023, there were 117 stockholders of record of our Class A common stock and 52 stockholders of record of our Class B common stock, with 10,000,000 shares and 2,500,000 shares outstanding, respectively, of each class.
Response: 117 and 52.

Prompt: As of January 31, 2023, we had 231,826,520 shares of common stock issued and outstanding which were held by 195 holders of record
Response: 195.

Prompt: The dividend is payable April 27, 2023 to shareholders of record on March 31, 2023.
Response: N/A.

Prompt: %s.
Response: `,
// ##########################3
b:`For each scenario below, the number of holders, if available, is also provided on the following line.

Scenario: As of January 31, 2023, there were 117 stockholders of record of our Class A common stock and 52 stockholders of record of our Class B common stock, with 10,000,000 shares and 2,500,000 shares outstanding, respectively, of each class.
Holders: 117 and 52.

Scenario: As of February 28, 2023, there were 1,300,000 shares outstanding of our common stock held by our holders of record of our Class A stock.
Holders: N/A.

Scenario: On February 14, 2023, we had 152 holders of record of Class A Common Stock and 90 holders of record of Class B Common Stock.
Holders: 152 and 90.

Scenario: The Series B distribution will be paid on March 15, 2023 to unitholders of record on March 1, 2023.
Holders: N/A.

Scenario: As of February 10, 2023, there were approximately 31 unitholders of record of our common units.
Holders: 31.

Scenario: The number of registered shareholders of our common stock on January 31, 2023 was 1,453
Holders: 1453.

Scenario: %s.
Holders: `,
// ##########################3
tiebreaker:`Below each statement, we specify the number of stockholders/shareholders, if available.

Statement: As of February 1, 2023, there were approximately 82 stockholders of record of our common stock and 431,967,907 shares of common stock outstanding.
Number of holders: 82.

Statement: On February 14, 2023, we had 152 holders of record of Class A Common Stock and 90 holders of record of Class B Common Stock.
Number of holders: 152 and 90.

Statement: In February 2023, the Company's Board declared a $0.33 per share first quarter cash dividend on common shares outstanding, to be paid to stockholders of record as of February 14, 2023.
Number of holders: N/A.

Statement: At the close of business on February 10, 2023, we had twenty-four holders of record of our common units and two holders of record of our Class C units.
Number of holders: 24 and 2.

Statement: The number of registered shareholders of our common stock on January 31, 2023 was 1,453.
Number of holders: 1453.

Statement: As of February 28, 2023, there were 1,300,000 shares outstanding of our common stock held by our holders of record of our Class A stock.
Number of holders: N/A.

Statement: As of March 28, 2022, there were 286,069,451 shares of common stock issued and outstanding held by approximately 201 holders of record.
Number of holders: 201.

Statement: %s.
Number of holders: `
}

function OpenaiInterpret(openAiKey){
	return async function openaiInterpret(sentence){
		const findings = []
		const errors = []
		const traceId = '' + Date.now()
		for(let variant of ["a","b"]){
			const languageResponse = await getCompletion({
				sentence,
				variant,
				model: "text-curie-001"
				})
			const finding = languageResponse?.choices?.[0]?.text?.trim().replace(/,/g,"").replace(/\s+/g," ")
			if(finding){
				findings.push(finding)
				}
			else{
				errors.push(JSON.stringify(languageResponse))
				}
			}

		const agreement =
			findings.length == 2
			&& findings.filter(unique).length == 1

		const tiebreakerResponse = agreement ? undefined
			: await getCompletion({
				sentence,
				variant: "tiebreaker",
				model: "text-curie-001"
				})
		const tiebreaker = tiebreakerResponse?.choices?.[0]?.text?.trim().replace(/,/g,"").replace(/\s+/g," ")
		if(tiebreakerResponse && !tiebreaker){
			errors.push(JSON.stringify(tiebreakerResponse))
			}

		return {
			finding: tiebreaker || findings[0],
			errors,
			traceId,
			uncertainty: agreement ? 0
				: findings.includes(tiebreaker) ? 1
				: 2,
			alternatives: agreement ? [] : findings
			}

		async function getCompletion({sentence, variant, model}){
			await wait(1100) //Janky rate limiting implementation, mate...
			const prompt = promptPreamble[variant].replace("%s",sentence.trim().replace(/\s+/," "))
			const request = {
				model,
				prompt,
				temperature: 0.1,
				max_tokens: 25,
				stop: ".\n\n"
				}
			const response = await fetch("https://api.openai.com/v1/completions", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${openAiKey}`
					},
				body: JSON.stringify(request)
				})
				.then(resp=>resp.json())
				.catch(e=>{error:e.toString()})

			await writeFile(
				(new URL(`../inspect/${traceId}-${variant}.json`, import.meta.url)),
				JSON.stringify({request,response},undefined,4)
				)
			return response
			}
		}
	}


function wait(ms){
	return new Promise(res=>setTimeout(res,ms))
	}
function unique(x,i,arr){return arr.indexOf(x)===i}

export {OpenaiInterpret}
