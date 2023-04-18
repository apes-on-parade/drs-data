WITH issuer_securities AS (
	SELECT
		s.pk2_cik as pk1_cik,
		ARRAY_AGG(s.pk2_ticker) as tickers
	FROM `apes-on-parade-default.dist.securities` as s
	WHERE exchange IN ('NYSE','Nasdaq')
	GROUP BY 1
	)
SELECT
	i.pk1_cik as id,
	i.name,
	s.tickers,
	i.holders.totalHolders as holders
FROM `apes-on-parade-default.dist.issuers` as i
LEFT JOIN issuer_securities as s
	ON s.pk1_cik = i.pk1_cik
WHERE i.is_NN_traded
ORDER BY holders DESC
