

SELECT
  name,
  CASE
  WHEN country = "US" THEN
    name || " is a US broker. " ||
    CASE WHEN hasDirectDrs THEN
      "To DRS transfer from " || name || " you need to..."
    ELSE
      name || " cannot DRS transfer. "
      || "<CASE WHEN can broker transfer THEN ... ELSE ...>"
    END
  ELSE
    name || " is a " || country || " broker." ||
    CASE WHEN hasDirectDrs THEN
      "< Can DRS: CASE WHEN is Saxo-related THEN ... ELSE ...>"
    ELSE
      "< Can't DRS: CASE WHEN can broker transfer THEN ... ELSE ...>"
    END
  END as paragraph

FROM `apes-on-parade-default.src_first_party.curated_brokers_snapshot` as b
