CREATE OR REPLACE TABLE `apes-on-parade-default.src_first_party.curated_tickers_snapshot` AS
SELECT
  Ticker as stockSymbol,
  Exchange as exchange,
  CUSIP as cusip,
  Online_Purchase_ as hasOnlinePurchase,
  CAST(REPLACE(Shares_Outstanding,",","") AS NUMERIC) as sharesOutstanding,
  __of_Shares_DRS_d as sharesDirectRegistered,
  --Issuer fields
  STRUCT(
    CIK as cik,
    Company_Name_Issuer as name,
    IR_Emails as irEmails,
    IR_Phone__ as irPhone,
    IR__Company_Address as irAddress,
    IR_URL as irUrl
  ) as issuer,
  -- Transfer Agent fields
  STRUCT(
    DTC_Member__ as dtcMemberId,
    Transfer_Agent as name
  ) as transferAgent,

FROM `apes-on-parade-default.src_first_party.curated_tickers_sheet` as t
WHERE Exchange IN ("NYSE", "Nasdaq")

-- LIMIT 100
