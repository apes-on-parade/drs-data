CREATE TEMPORARY FUNCTION stringOverlap(str1 STRING, str2 STRING)
	RETURNS FLOAT64
	LANGUAGE js AS """
    if(str1==null){return null}
    if(str2==null){return null}
		var stopWords = / ?\\b(The|inc|Incorporated|ASP|Co|Ltd|Limited|LLC|SA|SAS|BV|Corp|Corporation|formerly|previously|by|as|dba|com|Company|Companies|Holdings?|Common Stock|Warrants|\\([^\\)]*\\))\\b ?/ig
		var stopChars = /[-_ \\.,'"'\\/()]/g
		/* "'" This comment appeases my text editors SQL syntax highlighter... */
		var tokens = /\\b(Global|Media Group|Group|Solutions|Software|Computing|Networks?|Systems|Health|Brands|Project|Services|Technologies|Technology|Studios?|Digital|Mobile|Financial|Management|Media|Maintenance|Agency|Support|Bank|International|Dental|University|Labs|Enterprises?|GmbH|Industries|Entertainment|Society|Security|Interactive|Capital)\\b/ig
		var grams = 4
		var tokenValue = 2
		var substrs1 = extract(str1)
		var substrs2 = extract(str2)
		var maxL = max(substrs1.length, substrs2.length)
		return ( parseInt(100*(
			substrs1.filter(s=>~substrs2.indexOf(s)).length
			+substrs2.filter(s=>~substrs1.indexOf(s)).length
			) / (0.01+maxL) / 2))
		function max(a,b){return a>b?a:b}
		function extract(str){
			return str.toLowerCase()
			.replace(stopWords,"")
			.replace(tokens, m=>m.slice(0,tokenValue).toUpperCase())
			.replace(stopChars,"")
			.split('')
      .map((char,c,arr)=>arr.slice(max(0,1+c-grams),1+c).join(''))
      //.filter(s=>s.length>=3)
			}
	""";


--CREATE OR REPLACE TABLE `apes-on-parade-default.dist.securities` AS
WITH
	security_sec as (
		SELECT
			cik as pk2_cik,
			ticker as pk2_ticker,
			CASE WHEN MIN(exchange) <> MAX(exchange)
				THEN ERROR('Non-unique violation: cik_ticker_sec.exchange; cik:' || cik || ', ticker:' || ticker)
				ELSE MIN(exchange)
				END as exchange,
			CASE WHEN MIN(name) <> MAX(name)
				THEN ERROR('Non-unique violation: cik_ticker_sec.name; cik:' || cik || ', ticker:' || ticker)
				ELSE MIN(name)
				END as issuerName,
			LOGICAL_OR(exchange='NYSE' OR exchange='Nasdaq') as is_NN_traded
		FROM `apes-on-parade-default.src_public.sec_cik_tickers`
		GROUP BY 1, 2
		)
	--, security_gorillionaire as (
	-- 	SELECT
	-- 		spreadsheet.cik as pk2_cik,
	-- 		spreadsheet.stockSymbol as pk2_ticker,
	-- 		CASE WHEN MIN(spreadsheet.companyName) <> MAX(spreadsheet.companyName)
	-- 			THEN ERROR('Non-unique violation: security_gorillionaire.companyName; cik:' || cik || ', ticker:' || stockSymbol)
	-- 			ELSE MIN(spreadsheet.companyName)
	-- 			END as issuerName,
	-- 		CASE WHEN MIN(spreadsheet.exchange) <> MAX(spreadsheet.exchange)
	-- 			THEN ERROR('Non-unique violation: gorillionaire.exchange; cik:' || cik || ', ticker:' || stockSymbol)
	-- 			ELSE MIN(spreadsheet.exchange)
	-- 			END as exchange,
	-- 		CASE WHEN MIN(spreadsheet.cusip) <> MAX(spreadsheet.cusip)
	-- 			THEN ERROR('Non-unique violation: gorillionaire.cusip; cik:' || cik || ', ticker:' || stockSymbol)
	-- 			ELSE MIN(spreadsheet.cusip)
	-- 			END as cusip,
	-- 		CASE WHEN MIN(spreadsheet.hasOnlinePurchase) <> MAX(spreadsheet.hasOnlinePurchase)
	-- 			THEN ERROR('Non-unique violation: gorillionaire.hasOnlinePurchase; cik:' || cik || ', ticker:' || stockSymbol)
	-- 			ELSE MIN(spreadsheet.hasOnlinePurchase)
	-- 			END as hasOnlinePurchase,
	-- 		STRUCT(
	-- 			CASE WHEN MIN(spreadsheet.dtcMemberId) <> MAX(spreadsheet.dtcMemberId)
	-- 				THEN ERROR('Non-unique violation: gorillionaire.dtcMemberId; cik:' || cik || ', ticker:' || stockSymbol)
	-- 				ELSE MIN(spreadsheet.dtcMemberId)
	-- 				END as dtcMemberId,
	-- 			CASE WHEN MIN(spreadsheet.transferAgent) <> MAX(spreadsheet.transferAgent)
	-- 				THEN ERROR('Non-unique violation: gorillionaire.transferAgent; cik:' || cik || ', ticker:' || stockSymbol)
	-- 				ELSE MIN(spreadsheet.transferAgent)
	-- 				END as name,
	-- 			CAST('1900-01-01' AS DATE) as asOfDate
	-- 			) as transferAgent
	-- 	FROM `apes-on-parade-default.drs_data.gorillionaire_tickers` as spreadsheet
	-- 	WHERE spreadsheet.cik IS NOT NULL
	-- 	GROUP BY 1, 2
	-- )
-- 	, map_nasdaq_dtc_transfer_agents AS (
-- 		SELECT name as pk1_name,
-- 			CASE WHEN MIN(selected_id) <> MAX(selected_id) THEN ERROR('Non-unique violation: map_nasdaq_dtc_transfer_agents, name:' || name)
-- 				ELSE MIN(selected_id) END as dtcMemberId
-- 		FROM `apes-on-parade-default.src_first_party.map_nasdaq_dtc_transfer_agents`
-- 		GROUP BY 1
-- 		)
-- , security_nasdaq as (
-- 		SELECT
-- 			security_sec.pk2_cik,
-- 			security_sec.pk2_ticker,
-- 		CASE WHEN MIN(nasdaq.CUSIP) <> MAX(nasdaq.CUSIP)
-- 			THEN ERROR('Non-unique violation: nasdaq.CUSIP; cik:' || pk2_cik || ', ticker:' || pk2_ticker)
-- 			ELSE MIN(nasdaq.CUSIP)
-- 			END as cusip,
-- 		CASE WHEN MIN(nasdaq.Description) <> MAX(nasdaq.Description)
-- 			THEN ERROR('Non-unique violation: nasdaq.Description; cik:' || pk2_cik || ', ticker:' || pk2_ticker)
-- 			ELSE MIN(nasdaq.Description)
-- 			END as description,
-- 		CASE WHEN MIN(nasdaq.Transfer_Agent) <> MAX(nasdaq.Transfer_Agent)
-- 			THEN ERROR('Non-unique violation: nasdaq.Transfer_Agent; cik:' || pk2_cik || ', ticker:' || pk2_ticker)
-- 			ELSE ARRAY_AGG(STRUCT(
-- 				ta as name,
-- 				map.dtcMemberId,
-- 				Effective_Date as asOfDate,
-- 				"https://www.nasdaqtrader.com/content/home/help/samplereports/Fundamental_Data_cusip121720.xlsx" as docUrl
-- 				))
-- 			END as claimedTransferAgents
-- 		FROM `apes-on-parade-default.src_unlicensed.nasdaq_fundamentals_sample` as nasdaq
-- 		LEFT JOIN UNNEST([ SPLIT(LOWER(Issue_Name), SUBSTR(LOWER(Description),1,10))[OFFSET(0)] ]) as impliedIssuerName
-- 		INNER JOIN security_sec
-- 			ON  security_sec.exchange = "Nasdaq"
-- 			AND security_sec.pk2_ticker = nasdaq.Symbol
-- 			AND stringOverlap(security_sec.issuerName, impliedIssuerName) > 25
-- 		LEFT JOIN UNNEST(SPLIT(nasdaq.Transfer_Agent, " ; ")) as ta
-- 		LEFT JOIN map_nasdaq_dtc_transfer_agents as map
-- 			ON map.pk1_name = ta
-- 		GROUP BY 1,2
-- 	)
--, security_nyse as (
	-- SELECT
	-- 	security_sec.pk2_cik,
	-- 	security_sec.pk2_ticker,
	-- 	CASE WHEN MIN(nyse.CUSIP) <> MAX(nyse.CUSIP)
	-- 		THEN ERROR('Non-unique violation: nyse.CUSIP; cik:' || pk2_cik || ', ticker:' || pk2_ticker)
	-- 		ELSE MIN(nyse.CUSIP)
	-- 		END as cusip,
	-- 	CASE WHEN MIN(nyse.Security_Name) <> MAX(nyse.Security_Name)
	-- 		THEN ERROR('Non-unique violation: nyse.Security_Name; cik:' || pk2_cik || ', ticker:' || pk2_ticker)
	-- 		ELSE MIN(nyse.Security_Name)
	-- 		END as description,
	-- FROM `apes-on-parade-default.src_unlicensed.nyse_securities` as nyse
	-- INNER JOIN security_sec
	-- 	ON  security_sec.exchange = "NYSE"
	-- 	AND security_sec.pk2_ticker = nyse.Stock_Symbol
	-- 	AND stringOverlap(security_sec.issuerName, nyse.Issuer_Name) > 25
	-- GROUP BY 1,2
--)
	, claimed_transfer_agents as (
		SELECT
			unioned.pk2_cik,
			unioned.pk2_ticker,
			ARRAY_AGG(unioned.transferAgent) as claimedTransferAgents,
			--CASE WHEN MIN=MAX THEN MIN(dtcMemberId)
		FROM (
			SELECT pk2_cik, pk2_ticker, UNNEST(claimedTransferAgents) as transferAgent FROM security_nasdaq
			UNION ALL
			SELECT pk2_cik, pk2_ticker, transferAgent FROM security_gorillionaire
			-- UNION ALL
			-- FROM issuer_14a...
		) as unioned
		ORDER BY unioned.transferAgent.asOfDate DESC
		)
SELECT
	security_sec.pk2_cik,
	security_sec.pk2_ticker,
	security_sec.exchange,
	COALESCE(security_nyse.cusip, security_nasdaq.cusip) as cusip,
	COALESCE(security_nyse.description, security_nasdaq.description) as description,


FROM security_sec
LEFT JOIN security_nyse
	ON security_nyse.pk2_cik = security_sec.pk2_cik
	AND security_nyse.pk2_ticker = security_sec.pk2_ticker
LEFT JOIN security_nasdaq
	ON security_nasdaq.pk2_cik = security_sec.pk2_cik
	AND security_nasdaq.pk2_ticker = security_sec.pk2_ticker
