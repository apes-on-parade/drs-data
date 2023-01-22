import translator from '../../common/translator'

const translations = {
	"Query": "Filtro",
	"We have compiled reference data on the top US issuers, transfer agents, and brokers.":
		"Hemos recopilado datos de referencia sobre los principales emisores (issuers), agentes de transferencia (transfer agents) y corredores (brokers) de los EEUU.",
	"Search Issuers, Transfer Agents, and Brokers":
		"Buscar emisores, agentes de transferencia y corredores",
	"Issuers":
		"Emisores",
	"Transfer Agents":
		"Agentes de transferencia",
	"Brokers":
		"Corredores",
	"More details":
		"Más detalles",
	"Loading...":
		"Cargando...",
	"Logos provided by Clearbit":
		"Logotipos proporcionados por Clearbit",
	"Page $ of $":
		(...vars)=>`Página ${vars[0]} de ${vars[1]}`
	}

const translate = translator(translations)

export default translate
