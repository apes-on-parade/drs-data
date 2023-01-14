

Unfortunately, this data is way out of date, even though the last modified timestamp is within the last quarter...


Latest GME data is 2020-12

```
SELECT *
  FROM `bigquery-public-data.sec_quarterly_financials.submission`
  WHERE central_index_key = 1326380
ORDER BY date_filed desc
```
