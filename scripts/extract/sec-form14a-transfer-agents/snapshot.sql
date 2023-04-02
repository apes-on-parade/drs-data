CREATE OR REPLACE TABLE `apes-on-parade-default.src_public.14a_transfer_agents_snapshot`
AS SELECT
  filingDate,
  cik,
  htmlUrl,
  textOfInterest,
  transferAgentId
FROM `apes-on-parade-default.src_public.14a_transfer_agents_sheet`
WHERE COALESCE(transferAgentId,"") <> ""
