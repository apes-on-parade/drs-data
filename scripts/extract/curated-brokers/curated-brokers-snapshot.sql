CREATE OR REPLACE TABLE `apes-on-parade-default.src_first_party.curated_brokers_snapshot` AS
SELECT
  Name_of_broker as name,
  Country as country,
  SPLIT(Language_spoken, ", ") as languages,
  -- DRS Info
  STRUCT(
    CAST(Direct_DRS_available_ AS BOOLEAN) as hasDirect,
    CAST(Letter_of_instruction_ AS BOOLEAN) as doesRequireLoi,
    LOI_options as loiOptions,
    CAST(CS___Required_ AS BOOLEAN) as doesRequireAccount,
    CASE CS_Account__Number_Mentioned_
      WHEN "Demands Acc # Disclaimer" THEN TRUE
      WHEN "Disclaimer" THEN TRUE
      WHEN "No" THEN FALSE
      ELSE null
      END as doesRequestAccount,
    Is_Excessively_Expensive_ as isExpensive,
    Notes as note,
    Transfer_to_IBKR as transferToIbkr,
    Transfer_to_another_broker as transferToOther,
    Cannot_transfer as transferUnavailable,
    Expected_Fee as expectedFee,
    Duration as expectedDuration
  ) as drs,
  -- Contact Info
  STRUCT(
    Phone_Number as phone,
    Email_Address as email,
    Mailing_address as mailingAddress,
    Website as website,
    Twitter as twitter
  ) as contact

FROM `apes-on-parade-default.src_first_party.curated_brokers_sheet` as b

--LIMIT 25
