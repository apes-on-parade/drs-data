-- Use /scripts/common/json-arr-to-json-hash.mjs to reformat BQ output into react-app expected format

SELECT
  CAST(i.cik AS STRING) || "-" || s.ticker as id,
  s.ticker,
  i.name as issuerName
FROM  `apes-on-parade-default.dist.issuers` as i
LEFT JOIN UNNEST(i.tickers) as s
WHERE s.ticker IS NOT NULL
  AND s.exchange IN ("NYSE","Nasdaq")
