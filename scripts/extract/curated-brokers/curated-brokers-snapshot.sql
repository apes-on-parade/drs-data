CREATE OR REPLACE TABLE `apes-on-parade-default.src_first_party.curated_brokers_snapshot` AS
SELECT
  name,
  country,
  SPLIT(languages, ", ") as languages,
  CASE hasDirectDrs
    WHEN "Yes" THEN TRUE
    WHEN "No" THEN FALSE
    END AS hasDirectDrs,
  CASE requiresExistingAccount
    WHEN "Yes" THEN TRUE
    WHEN "No" THEN FALSE
    END AS requiresExistingAccount,
  CASE requiresLetterOfInstruction
    WHEN "Yes" THEN TRUE
    WHEN "No" THEN FALSE
    END AS requiresLetterOfInstruction,
  note,
  expectedDrsFee,
  expectedDrsDuration,
  contactInfoCompletion,
  phone,
  email,
  mailingAddress,
  website,
  twitter

FROM `apes-on-parade-default.src_first_party.curated_brokers_sheet` as b

--LIMIT 25
