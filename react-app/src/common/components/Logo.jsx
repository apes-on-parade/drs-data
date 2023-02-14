import React, {useState} from 'react'

export default Logo

function Logo({domain}){
	const [didError, setDidError] = useState(undefined)

	return <img
		style={{display: didError ? 'none' : 'inline-block', boxShadow: '1px 1px 4px 0px rgba(0,0,0,0.33)'}}
		onError={onError}
		src={`https://logo.clearbit.com/${domain}?s=48`}
		/>

	function onError(){setDidError(true)}
	}

