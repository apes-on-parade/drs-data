SELECT
	CAST(s.pk2_cik AS STRING) || "-" || s.pk2_ticker as id,
	s.pk2_ticker as ticker,
	i.name as issuer
FROM `apes-on-parade-default.dist.securities` as s
LEFT JOIN  `apes-on-parade-default.dist.issuers` as i
	ON i.pk1_cik = s.pk2_cik
WHERE s.exchange IN ("NYSE","Nasdaq")
ORDER BY
	CASE WHEN LENGTH(s.pk2_ticker)<=3 AND s.pk2_ticker NOT LIKE '%-%' THEN 1 ELSE 0 END DESC,
	i.holders.totalHolders DESC
