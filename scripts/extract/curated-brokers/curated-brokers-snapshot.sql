CREATE TEMP FUNCTION yesno(str STRING) RETURNS BOOLEAN
AS (CASE 
  WHEN str IS NULL THEN NULL
  WHEN LOWER(str) = "yes" THEN TRUE
  WHEN LOWER(str) = "no" THEN FALSE
  ELSE ERROR("Invalid Yes/No value: " || str)
  END);

CREATE OR REPLACE TABLE `apes-on-parade-default.src_first_party.curated_brokers_snapshot` AS
SELECT
  Name_of_Broker as name,
  Country as country,
  SPLIT(Language_Spoken, ", ") as languages,
  -- DRS Info
  STRUCT(
    yesno(Direct_DRS_available_) as hasDirect,
    yesno(Letter_of_instruction_) as doesRequireLoi,
    LOI_options as loiOptions,
    yesno(CS___Required_) as doesRequireAccount,
    CASE _CS_Account_Number_Mentioned__
      WHEN "Demands Acc # Disclaimer" THEN TRUE
      WHEN "Disclaimer" THEN TRUE
      WHEN "No" THEN FALSE
      ELSE null
      END as doesRequestAccount,
    yesno(Is_Excessively_Expensive_) as isExpensive,
    Notes as note,
    yesno(Transfer_to_IBKR) as transferToIbkr,
    yesno(Transfer_to_another_broker) as transferToOther,
    yesno(Cannot_transfer) as transferUnavailable,
    Expected_Fee as expectedFee,
    Duration as expectedDuration,
    IBKR_Name as ibkrName
  ) as drs,
  -- Contact Info
  STRUCT(
    Phone_Number as phone,
    Email_Address as email,
    Mailing_address as mailingAddress,
    Website as website,
    Twitter___X as twitter
  ) as contact,
  -- Text Content
  STRUCT(
    Bespoke_Instructions_en_ as bespokeInstructions
  ) as enLocalized

FROM `apes-on-parade-default.src_first_party.curated_brokers_sheet` as b

--LIMIT 25
