WITH
	issuer_securities AS (
		SELECT
			s.pk2_cik as pk1_cik,
			ARRAY_AGG(STRUCT(
				s.pk2_ticker as ticker,
				s.exchange,
				s.description,
				s.hasOnlinePurchase,
				s.cusip
			)) as tickers
		FROM `apes-on-parade-default.dist.securities` as s
		WHERE exchange IN ('NYSE','Nasdaq')
		GROUP BY 1
		)
	, transfer_agent as (
		SELECT
			s.pk2_cik as pk1_cik,
			CASE WHEN MIN(mostSpecificTaIdentifier) = MAX(mostSpecificTaIdentifier)
				THEN STRUCT(
					MIN(ta.dtcMemberId) as dtcMemberId,
					MIN(ta.name) as name
				)
				END as transferAgent,
			ARRAY_AGG(ta) as allClaimedTransferAgents
		FROM `apes-on-parade-default.dist.securities` as s
		INNER JOIN UNNEST(s.allClaimedTransferAgents) as ta
		LEFT JOIN UNNEST([COALESCE(CAST(ta.dtcMemberId AS STRING), ta.name)]) as mostSpecificTaIdentifier
		WHERE exchange IN ('NYSE','Nasdaq')
		GROUP BY 1
		)
SELECT
	i.pk1_cik as id,
	i.name,
	ta.transferAgent,
	ta.allClaimedTransferAgents,
	s.tickers,
	holders
FROM `apes-on-parade-default.dist.issuers` as i
LEFT JOIN issuer_securities as s
	ON s.pk1_cik = i.pk1_cik
LEFT JOIN transfer_agent as ta
	ON ta.pk1_cik = i.pk1_cik
WHERE i.is_NN_traded
ORDER BY holders.totalHolders DESC
