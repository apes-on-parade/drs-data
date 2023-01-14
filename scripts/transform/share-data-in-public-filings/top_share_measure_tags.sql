SELECT
  measure_tag, count(*) as ct
FROM `bigquery-public-data.sec_quarterly_financials.numbers`
WHERE units = "shares"
  AND number_of_quarters = 0 --Point in time snapshot values
GROUP BY 1
HAVING ct > 150000
ORDER BY 2 DESC
