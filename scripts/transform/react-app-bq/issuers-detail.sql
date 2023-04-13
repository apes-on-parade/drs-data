-- Use /scripts/common/ndjson-to-files.mjs to reformat BQ output into react-app expected format

SELECT
	cik as id,
	name,
	transferAgent,
	tickers,
	holders
FROM `apes-on-parade-default.dist.issuers`
ORDER BY holders.totalHolders DESC
