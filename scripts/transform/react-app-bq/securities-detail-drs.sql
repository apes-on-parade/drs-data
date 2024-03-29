SELECT
	CAST(s.pk2_cik AS STRING) || "-" || s.pk2_ticker as id,
	s.pk2_ticker as ticker,
	s.cusip,
	i.name as issuer,
	i.pk1_cik as issuerId,
	s.latestClaimedTransferAgent,
	s.allClaimedTransferAgents
FROM `apes-on-parade-default.dist.securities` as s
LEFT JOIN `apes-on-parade-default.dist.issuers` as i
	ON i.pk1_cik = s.pk2_cik
WHERE s.exchange IN ('NYSE','Nasdaq')
