WITH cik_form_latest_submission AS (
  SELECT
    central_index_key AS cik,
    form,
    MAX(date_filed) as latest_filed_date,
    SUBSTRING(MAX(CAST(date_filed AS STRING) || submission_number ),9) as latest_submission_number
  FROM `bigquery-public-data.sec_quarterly_financials.submission`
  WHERE form IN ("10-Q", "10-Q/A", "10-K", "10-K/A", "8-K")
  GROUP BY 1,2
),
measures as (
  SELECT
  tickers.cik,
  tickers.exchange,
  tickers.ticker,
  cik_form_latest_submission.form,
  cik_form_latest_submission.latest_filed_date,
  cik_form_latest_submission.latest_submission_number,
  numbers.measure_tag,
  numbers.value,
  IFNULL(SUM(value) OVER (PARTITION BY numbers.submission_number),0) > 0 as any_shares
  FROM `misc-275401.stocks2.cik_tickers` AS tickers
  INNER JOIN cik_form_latest_submission
    ON cik_form_latest_submission.cik = tickers.cik
  LEFT JOIN `bigquery-public-data.sec_quarterly_financials.numbers` AS numbers
    ON numbers.submission_number = cik_form_latest_submission.latest_submission_number
    AND numbers.units = 'shares'
)
SELECT * EXCEPT (any_shares)
FROM (SELECT * FROM measures WHERE any_shares) as measures
PIVOT (
  count(*) as row_count,
  SUM(value) as shares
  FOR measure_tag
  IN ("CommonStockSharesOutstanding","CommonStockSharesIssued","CommonStockSharesAuthorized","SharesOutstanding","PreferredStockSharesAuthorized","ShareBasedCompensationArrangementByShareBasedPaymentAwardOptionsOutstandingNumber","PreferredStockSharesIssued","PreferredStockSharesOutstanding","ShareBasedCompensationArrangementByShareBasedPaymentAwardEquityInstrumentsOtherThanOptionsNonvestedNumber","EntityCommonStockSharesOutstanding","SharesIssued","TreasuryStockShares","ShareBasedCompensationArrangementByShareBasedPaymentAwardOptionsExercisableNumber")
)
ORDER BY ticker, exchange, latest_filed_date DESC
LIMIT 50000
