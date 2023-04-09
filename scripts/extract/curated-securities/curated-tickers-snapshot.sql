
CREATE OR REPLACE TABLE `apes-on-parade-default.src_first_party.curated_tickers_snapshot` AS
SELECT
  stockSymbol,
  exchange,
  cusip,
  hasOnlinePurchase,
  CAST(REPLACE(sharesOutstanding,",","") AS NUMERIC) as sharesOutstanding,
  sharesDirectRegistered,
  --Issuer fields
  STRUCT(
    cik,
    companyName as name,
    irEmails,
    irPhone,
    irAddress
  ) as issuer,
  -- Transfer Agent fields
  STRUCT(
    dtcMemberId,
    transferAgent as name
  ) as transferAgent,

FROM `apes-on-parade-default.drs_data.gorillionaire_tickers` as t
WHERE exchange IN ("NYSE", "Nasdaq")
  AND overallCompletion = "100%"

--LIMIT 25
