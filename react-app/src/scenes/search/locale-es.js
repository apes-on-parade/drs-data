const translations = {
	"Query": "Filtro",
	"This is a compilation of reference data on select brokers, issuers and transfer agents dealing with US securities.":
		"Esta es una recopilación de datos de referencia sobre corredores (brokers), emisores (issuers) y agentes de transferencia (transfer agents) seleccionados que negocian con valores de EEUU",
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
	"No issuers match your query. Note that we only publish information for a limited set of issuers.":
		"Ningún emisor coincide con su consulta. Tenga en cuenta que solo publicamos información para un conjunto limitado de emisores.",
	"No brokers match your query.":
		"Ningún corredor coincide con su consulta",
	"No transfer agents match your query.":
		"Ningún agente de transferencia coincide con su consulta.",
	"Page $ of $":
		(...vars)=>`Página ${vars[0]} de ${vars[1]}`
	}

import translator from '../../common/translator'
const translate = translator(translations)
export default translate
