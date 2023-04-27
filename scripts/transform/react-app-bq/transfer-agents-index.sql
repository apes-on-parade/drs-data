
WITH highlights AS (
	SELECT "" as name, "" as shortName, 0 as highlight
	UNION ALL SELECT "AMERICAN STOCK TRANSFER & TRUST COMPANY, LLC", "AST", 1
	UNION ALL SELECT "AMERICAN STOCK TRANSFER & TRUST COMPANY, LLC/AST2", "AST 2", NULL
	UNION ALL SELECT "EQUINITI TRUST COMPANY", "Equiniti", 1
	UNION ALL SELECT "EQUINITI TRUST COMPANY/MICRO CAP", "Equiniti Microcap", NULL
	UNION ALL SELECT "BROADRIDGE CORPORATE ISSUER SOLUTIONS INC." , "Broadridge", 1
	UNION ALL SELECT "COMPUTERSHARE TRUST COMPANY, N.A.", "Computershare", 1
	UNION ALL SELECT "CONTINENTAL STOCK TRANSFER & TRUST COMPANY", "Continental Stock", 1
	UNION ALL SELECT "VSTOCK TRANSFER, LLC", "Vstock", 0
	)
SELECT 
	ta.pk1_dtcMemberId as id,
	ta.name,
	highlights.shortName,
	REGEXP_EXTRACT(ta.stocksUrl,"^https?:\\/\\/([^\\/\\?\\#]+)") as domain
FROM `apes-on-parade-default.src_first_party.curated_transfer_agents_snapshot` as ta
LEFT JOIN highlights
	ON highlights.name = ta.name
WHERE highlights.highlight = 1
