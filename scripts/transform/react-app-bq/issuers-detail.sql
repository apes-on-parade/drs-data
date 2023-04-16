WITH transfer_agent as (
	SELECT
		pk2_cik as pk1_cik,
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
	i.cik as id,
	i.name,
	ta.transferAgent,
	ta.allClaimedTransferAgents,
	tickers,
	holders
FROM `apes-on-parade-default.dist.issuers` as i
LEFT JOIN transfer_agent as ta
	ON ta.pk1_cik = i.cik
WHERE i.is_NN_traded
ORDER BY holders.totalHolders DESC
