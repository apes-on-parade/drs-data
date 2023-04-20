export default function defaultTranslationWrapper(){
	return function defaultTranslation(strings, ...vars){
		return strings[0]+strings.slice(1).map((s,i)=>vars[i]+s).join("")
		}
	}
