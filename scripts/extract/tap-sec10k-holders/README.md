# SEC 10-K Record Holders

(Note: the folder is labeled "tap", and the code base is structured to easily be able to output data via the Singer tap
specification, but at the moment, it just appends to an output.csv file)

What this script does:

1. For a specified date range provided in config.json, iterates through dates in the range (excluding the date range already contained in output.csv)
2. For each date, looks up the index of SEC filings on that day, in the index files such as https://www.sec.gov/Archives/edgar/daily-index/2023/QTR1/crawler.20230130.idx
3. For each entry in the daily index, if it is a 10-K, feches the index for that filing, such as https://www.sec.gov/Archives/edgar/data/1435508/0001410578-23-000065-index.htm
4. Picks out the main HTML document in the filing and fetches it
5. Picks out all sentences containing keywords of interest
6. Sends the sentences to OpenAI to extract the number of recordholders, if any, in that sentence
