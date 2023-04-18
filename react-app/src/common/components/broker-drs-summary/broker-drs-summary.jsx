import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import useAsyncEffect from "@n1ru4l/use-async-effect"

//import Button from '@mui/material/Button'
// import Stack from '@mui/material/Stack'
// import Autocomplete from '@mui/material/Autocomplete'
// import Select from '@mui/material/Select'
// import MenuItem from '@mui/material/MenuItem'
// import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const O = {}

const BrokerDrsSummary = function(){
	//Localization
	const {locale='en'} = useParams('locale')
	const [l,setLocalization] = useState(()=>()=>"...")
	useAsyncEffect(loadLocalization,[locale])

	return (<div>

		</div>)
	}

export default DrsRequestTemplateScene
