SELECT
	cik as id,
	name,
	transferAgent,
	tickers,
	holders
FROM `apes-on-parade-default.dist.issuers`
ORDER BY holders.totalHolders DESC
