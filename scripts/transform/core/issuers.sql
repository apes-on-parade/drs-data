--CREATE OR REPLACE TABLE `apes-on-parade-default.dist.issuers` AS
WITH
	cik_sec as (
		SELECT
			cik,
			CASE WHEN MIN(name) <> MAX(name)
				THEN ERROR('Non-unique violation: cik_name_sec.name; cik:' || cik)
				ELSE MIN(name)
				END as name,
			LOGICAL_OR(exchange='NYSE' OR exchange='Nasdaq') as is_NN_traded
		FROM `apes-on-parade-default.src_public.sec_cik_tickers`
		GROUP BY 1
		),
	cik_date_holders AS (
		SELECT
		cik,
		filingDate,
		SUM(numHolders) as totalHolders,
		ARRAY_AGG(DISTINCT docUrl) as docUrls
		FROM (
			-- Because a 10K doc may contain 2 sentences that describe the holdings, or because the extraction script may have double-extracted a sentence
			-- we discard any sentences that both specify the same number. However, since there can be multiple sentences that each describe separate classes
			-- of shares, we do not discard (and later sum) any different numbers from the same filing
			SELECT DISTINCT cik, filingDate, numHolders, docUrl
			FROM `apes-on-parade-default.src_first_party.10k_holders_snapshot`
			) as unique_holding_numbers
		GROUP BY 1, 2
		),
	cik_latest_holders_filing as (
		SELECT cik, MAX(filingDate) as filingDate
		FROM `apes-on-parade-default.src_first_party.10k_holders_snapshot`
		GROUP BY 1
		),
	cik_gorillionaire as (
		SELECT
		spreadsheet.cik,
		CASE WHEN MIN(spreadsheet.companyName) <> MAX(spreadsheet.companyName)
			THEN NULL
			ELSE MIN(spreadsheet.companyName)
			END as name
		FROM `apes-on-parade-default.drs_data.gorillionaire_tickers` as spreadsheet
		WHERE spreadsheet.cik IS NOT NULL
		GROUP BY 1
		)
SELECT
	cik_sec.cik as pk1_cik,
	COALESCE(cik_gorillionaire.name, cik_sec.name) as name,
	STRUCT(
		holders.filingDate,
		holders.totalHolders,
		holders.docUrls
		) as holders,
	cik_sec.is_NN_traded
FROM cik_sec
LEFT JOIN cik_gorillionaire
	ON cik_gorillionaire.cik = cik_sec.cik
LEFT JOIN cik_latest_holders_filing as latest_holders
	ON latest_holders.cik = cik_sec.cik
LEFT JOIN cik_date_holders as holders
	ON  holders.cik = latest_holders.cik
	AND holders.filingDate = latest_holders.filingDate

-- WHERE cik_sec.is_NN_traded
--
-- ORDER BY holders.totalHolders DESC
-- LIMIT 25
