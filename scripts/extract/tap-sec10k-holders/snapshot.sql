CREATE TEMP FUNCTION asSingleValue(vals STRING)
RETURNS INTEGER
LANGUAGE js
AS r"""
  if( vals === null
   || vals === undefined
   || vals === ''
   || vals.match(/^\s*N\/?A/i)
  ){
    return null
  }
  var parts = vals.replace("and","").split(/\s+/);
  let nums = parts.map(s=>parseInt(s.replace(/[\.,]/g,"")));
  let total = nums.reduce(add);
  if(isNaN(total)){
    throw "Invalid value: "+vals
  }
  return total

  function add(a,b){return a+b}
""";

CREATE OR REPLACE TABLE `apes-on-parade-default.src_first_party.10k_holders_snapshot`
AS SELECT
  filingDate,
  cik,
  textHash,
  docUrl,
  textOfInterest,
  asSingleValue(
    CASE WHEN manualReview LIKE '%ok%'
      THEN openaiFinding
      ELSE manualReview
      END
  ) as numHolders
FROM `apes-on-parade-default.src_first_party.10k_holders_sheet`
WHERE NOT(LOWER(COALESCE(manualReview,'')) LIKE '%n/a%')
  AND NOT(
    LOWER(COALESCE(manualReview,'')) LIKE '%ok%'
    AND LOWER(COALESCE(openaiFinding,'')) LIKE '%n/a%'
  )
