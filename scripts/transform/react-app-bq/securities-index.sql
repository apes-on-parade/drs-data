SELECT
  CAST(s.pk2_cik AS STRING) || "-" || s.pk2_ticker as id,
  s.pk2_ticker as ticker,
  i.name as issuer
FROM `apes-on-parade-default.dist.securities` as s
LEFT JOIN  `apes-on-parade-default.dist.issuers` as i
    ON i.cik = s.pk2_cik
WHERE s.exchange IN ("NYSE","Nasdaq")
