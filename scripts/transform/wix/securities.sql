SELECT
  REGEXP_REPLACE(
    TO_HEX(SHA1(exchange||":"||stockSymbol)),
    "^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})",
    "\\1-\\2-\\3-\\4-\\5"
  ) as _id,
  exchange || " - " || stockSymbol as title,
  stockSymbol,
  exchange,
  issuer.name as companyNameIssuer,
  transferAgent.name as transferAgent,
  hasOnlinePurchase as onlinePurchase,
  transferAgent.dtcMemberId as dtcMember,
  issuer.irEmails,
  issuer.irPhone,
  issuer.irAddress as irCompanyAddress,
  sharesOutstanding,
  cusip,
  issuer.cik,
  sharesDirectRegistered as drs,
  CASE transferAgent.dtcMemberId
    WHEN "7807" THEN "https://www.computershare.com/us"
    WHEN "7808" THEN "https://continentalstock.com/"
    WHEN "7805/7810" THEN "https://www.astfinancial.com/"
    WHEN "7810" THEN "https://www.astfinancial.com/"
    WHEN "7805" THEN "https://www.astfinancial.com/"
    WHEN "7806/7835" THEN "https://equiniti.com/us/"
    WHEN "7806" THEN "https://equiniti.com/us/"
    WHEN "7835" THEN "https://equiniti.com/us/"
    WHEN "7824" THEN "https://www.broadridge-ir.com/stock-info/transfer-agent/default.aspx"
    END as taURL,
  "https://" || domain as companyInfoUrl,
  -- "https://logo.clearbit.com/"
  --   || domain
  --   || "?s=48"
  --   as logo,
  "Interested in contacting "
  || issuerNickname
  || " to let them know you’d like to see DRS numbers disclosed in 10Q and 10K reports? Click here to help you get started."
  as contactCallToAction,
  "https://www.sec.gov/edgar/browse/?CIK=" || CAST( issuer.cik AS STRING) as issuerEdgarLink

FROM `apes-on-parade-default.src_first_party.curated_tickers_snapshot`
LEFT JOIN UNNEST([
  CASE WHEN REGEXP_CONTAINS(issuer.irEmails, "^ir@|^investor.?relations@")
    THEN REGEXP_REPLACE(issuer.irEmails, "^ir@|^investor.?relations@", "")
    END
  ]) as domain
LEFT JOIN UNNEST([
  REGEXP_REPLACE(
    issuer.name,
    " Corp\\.?$| Corporation$|,? ?Ltd\\.?$|,? ?Inc\\.?$| L\\.?P\\.?$| Company$",
    ""
  )]) as issuerNickname
WHERE issuer.name NOT LIKE "%BlackRock%"
