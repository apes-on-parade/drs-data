SELECT
	cik as id,
	name,
	STRUCT(transferAgent.name as name) as transferAgent,
	ARRAY(
		SELECT STRUCT(
		exchange,
		ticker
		)
		FROM UNNEST(tickers)
	) as tickers,
	holders.totalHolders as holders
FROM `apes-on-parade-default.dist.issuers`
