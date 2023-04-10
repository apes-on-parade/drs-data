CREATE TEMP FUNCTION enSummaryParagraph(
    name STRING,
    country STRING,
    hasDirect BOOLEAN,
    doesRequireAccount BOOLEAN,
    isExpensive BOOLEAN,
    transferUnavailable BOOLEAN,
    expectedFee STRING,
    expectedDuration STRING
  )
  RETURNS STRING
  LANGUAGE js
  AS r"""
    if(country=="UM"){country="US"} /*Work around apparent data entry error*/
    const usness = country == "US" ? "U.S." : "non-U.S."
    let para = `${name} is a ${usness} broker. `
    if(country === "US"){
      if(hasDirect){drs()}
      if(!hasDirect){
        if(!transferUnavailable){usTransfer()}
        if(transferUnavailable){usRepurchase()}
      }
    }
    if(country !== "US"){
      if(hasDirect === false){
        if(transferUnavailable === false){nonusTransfer()}
        if(transferUnavailable === true){nonusRepurchase()}
      }
      if(hasDirect === true){
        if(isExpensive === true){nonusExpensive()}
        else{
          if(!doesRequireAccount){drs()}
          if(doesRequireAccount){nonusPreexisting()}
        }
      }
    }
    return `<p class="font_8">para</p>`;

    function drs(){para+=`${name} is able to directly DRS shares upon your request.`+(expectedDuration ? `Expect the request to take ${expectedDuration} to process. `:"")+`See our broker-specific guide below for instructions.`}
    function usTransfer(){para += `${name} cannot DRS transfer, but can transfer to other brokers. To DRS, you will first need to transfer to a broker that can DRS, for example Fidelity. See our <a href="#">Fidelity Route Guide</a>.`}
    function usRepurchase(){para += `${name} cannot DRS transfer, and cannot transfer to other brokers. To DRS, you will need to close out your position and rebuy with a DRS-capable broker or the transfer agent directly. See our <a href="#">U.S. Sell+Repurchase Guide</a>.`}
    function nonusTransfer(){para+=`${name} cannot DRS transfer, but can transfer to other brokers. To DRS, you will first need to transfer to a broker that can DRS, for example Interactive Brokers (IBKR). See our <a href="#">IBKR Route Guide</a>.`}
    function nonusExpensive(){para+=`${name} can DRS transfer, but charges an excessive fee to do so (${expectedFee}). Although you may DRS directly from this broker, we instead recommend first transfering to a broker that can DRS for a reasonable cost, for example Interactive Brokers (IBKR). See our <a href="#">IBKR Route Guide</a>`}
    function nonusPreexisting(){para+=`This broker requires a pre-existing account at the transfer agent. See our <a href="#">Creating an Initial Account guide</a>`}
    function nonusRepurchase(){para += `${name} cannot DRS transfer, and cannot transfer to other brokers. To DRS, you will need to close out your position and rebuy with a DRS broker or the transfer agent directly. See our <a href="#">Non-U.S. Sell+Repurchase Guide</a>/`}

  """;

SELECT
  REGEXP_REPLACE(
    TO_HEX(SHA1(name)),
    "^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})",
    "\\1-\\2-\\3-\\4-\\5"
  ) as _id,
  b.name as title,
  -- b.drs.note,
  enSummaryParagraph(
    name,
    b.country,
    b.drs.hasDirect,
    b.drs.doesRequireAccount,
    b.drs.isExpensive,
    b.drs.transferUnavailable,
    b.drs.expectedFee,
    b.drs.expectedDuration
    ) as enSummaryParagraph
FROM `apes-on-parade-default.src_first_party.curated_brokers_snapshot` as b

-- LIMIT 100
