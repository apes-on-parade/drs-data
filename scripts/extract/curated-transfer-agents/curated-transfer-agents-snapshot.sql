CREATE OR REPLACE TABLE `apes-on-parade-default.src_first_party.curated_transfer_agents_snapshot` AS
SELECT
  DTC_Member__ as pk1_dtcMemberId,
  CASE WHEN MIN(Transfer_Agent)<>MAX(Transfer_Agent)
    THEN ERROR("Non-unique violation: Transfer_Agent; ID: "||DTC_Member__)
    ELSE MIN(Transfer_Agent)
    END as name,
  CASE WHEN MIN(Address)<>MAX(Address)
    THEN ERROR("Non-unique violation: Address; ID: "||DTC_Member__)
    ELSE MIN(Address)
    END as address,
  CASE WHEN MIN(General_Phone_Number)<>MAX(General_Phone_Number)
    THEN ERROR("Non-unique violation: General_Phone_Number; ID: "||DTC_Member__)
    ELSE MIN(General_Phone_Number)
    END as phone,
  CASE WHEN MIN(E_Mail_Contact)<>MAX(E_Mail_Contact)
    THEN ERROR("Non-unique violation: E_Mail_Contact; ID: "||DTC_Member__)
    ELSE MIN(E_Mail_Contact)
    END as email,
  CASE WHEN MIN(Serviced_Stock_Directory)<>MAX(Serviced_Stock_Directory)
    THEN ERROR("Non-unique violation: Serviced_Stock_Directory; ID: "||DTC_Member__)
    ELSE MIN(Serviced_Stock_Directory)
    END as stocksUrl
FROM `apes-on-parade-default.src_first_party.curated_transfer_agents_sheet`
GROUP BY 1
