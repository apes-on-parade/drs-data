export default function translator(translations){
	return function translate(strings, ...vars){
		const key = strings.join('$').trim()
		const translation = translations[key]
		switch(typeof translation){
			case "string": return translation
			case "function": return translation(...vars)
			default: return strings[0]+strings.slice(1).map((s,i)=>vars[i]+s).join("")
			}
		}
	}
