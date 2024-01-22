
CREATE TEMP FUNCTION assembledContent(
    name STRING,
    country STRING,
    emailAddress STRING,
    hasDirect BOOLEAN,
    doesRequireAccount BOOLEAN,
    isExpensive BOOLEAN,
    transferUnavailable BOOLEAN,
    expectedFee STRING,
    expectedDuration STRING,
    ibkrName STRING,
    bespokeInstructions STRING
  )
  RETURNS STRUCT<
    enSummaryParagraph STRING
    >
  LANGUAGE js
  AS r"""
if(country=="UM"){country="US"} /*Work around apparent data entry error*/
let isUs = country === "US"
if(!hasDirect && transferUnavailable){
  return nonTransferringBrokerTemplate()
}
if(!hasDirect && !transferUnavailable){
  return nonDrsBrokerTemplate()
}
if(hasDirect && isUs){
  return usDrsBrokerTemplate()
}
if(hasDirect && !isUs){
  return nonUsDrsBrokerTemplate()
}

function nonTransferringBrokerTemplate(){return {
  enSummaryParagraph:
    `<p class="font_7">${name} does not allow transfers of any kind.</p>
    <p class="font_7">To direct register your shares, you are left with a few options:</p>
    <ul>
    <li class="font_7">Stop buying with your non-transferring broker and instead buy with a broker that can DRS transfer shares. For example:
    ${isUs
      ? `Fidelity`
      : `Interactive Brokers`
      }</li>
    <li class="font_7">Sell your shares from your non-transferring broker and wait for the cash to settle back into your bank account. Then repurchase your shares using that cash (risky due to volatility).</li>
    <li class="font_7">Buy shares in a broker that can direct register. Then sell from your non-transferring broker at a similar price, (requires extra cash, but reduces risk).</li>
    </ul>
    <p class="font_7"><i>This isn't advocating day trading in any way shape or form; stocks can become volatile for a multitude of reasons. While you may make some gains, selling in any shape provides short hedge funds with liquidity. Those shares, and that liquidity is removed permanently if the re-purchased shares are directly registered.</i></p>
    ${!bespokeInstructions?"":`
      <h2 class="font_2">Specifics for ${name}</h2>
      ${bespokeInstructions}
    `}
    `
  }}

function nonDrsBrokerTemplate(){return {
  enSummaryParagraph:
    `<p class="font_7">${name} does not DRS transfer shares, so you need to transfer your shares to another broker that can DRS transfer.</p>
    ${isUs
      ? `<p class="font_7">A popular route has been through Fidelity, as they are able to reliably DRS transfer for free, and it’s a very simple process to request it. Fidelity have also been known to reimburse transfer fees when moving to them (up to $75)</p>`
      : `<p class="font_7">A popular route has been through Interactive Brokers (IBKR), as they are available internationally and can DRS transfer for $5(USD). For this example, IBKR is being used. </p>
        <p class="font_7">The quickest way is to open an Interactive Broker account, buy a share, and request a DRS transfer. While you wait for your Computershare account to be created, you can transfer your shares from ${name} to IBKR with a Basic FOP Transfer, then from IBKR to Computershare via DRS transfer for a $5(US) fee.</p>`
    }
    ${!bespokeInstructions?"":`
      <h2 class="font_2">Specifics for ${name}</h2>
      ${bespokeInstructions}
    `}
    <h2 class="font_2">Transfer Instructions</h2>
    <h3 class="font_3">How to Transfer between Brokers</h3>
    ${isUs
      ? `<p class="font_7">Open an account with Fidelity. When it asks you how you want to fund your account, select transfer from another brokerage. Fidelity will pull your shares from ${name}. This will take roughly 3 days.</p>`
      : `<p class="font_7">Once your shares are settled in ${name}, you can start the process by making a Letter of Instruction with IBKR.</p>
        <ul>
        <li class="font_7">Login in your IBKR account, and click on "Transfer & Pay" from the top menu and select "Transfer Positions".</li>
        <li class="font_7">On the next page select "Incoming".</li>
        <li class="font_7">On the next page select "All Other Regions" from the drop down menu.</li>
        <li class="font_7">On the next page select "Basic FOP Transfer".</li>
        <li class="font_7">Select ${ibkrName || name} on the drop down list.</li>
        <li class="font_7">For "Your Account Number at the Financial Institution" put your ${name} account number.</li>
        <li class="font_7">For "Name of Account Holder at Financial Institution" put your full name as defined on your ${name} account.</li>
        <li class="font_7">Select the Account type (most likely individual).</li>
        <li class="font_7">Select the country of the Financial Institution where you access ${name} from.</li>
        <li class="font_7">For the contact email put "${emailAddress}".</li>
        <li class="font_7">You have to add the asset you want to transfer, click on "Add Asset".</li>
        <li class="font_7">On the next page you can search which stock you'd like to transfer, click on "Search".</li>
        <li class="font_7">On the next page, click on the row that has the company you wish to DRS shares of.</li>
        <li class="font_7">On the next page, define how many shares you'd like to transfer and click on "Save and Finish".</li>
        <li class="font_7">On the next page you'll see a summary of the transfer. Write in your name as it shows on the page and click on "Continue".</li>
        <li class="font_7">Interactive Brokers will then generate a Letter of Instruction for you.</li>
        <li class="font_7">Click on "View Form", then click on "Print".</li>
        <li class="font_7">Print, sign, and scan the form back in (or take a photo of it).</li>
        <li class="font_7">Send the Letter of Instruction to your broker (details for this are above).</li>
        </ul>
        <p class="font_7">The transfer should be processed within 3-5 business days, but can sometimes take longer. You will receive an email confirming that the transfer was successfully performed. If you have not received confirmation within a week or two, then it’s best practice to chase it up with both brokers.</p>
        `
      }
    <h3 class="font_3">How to DRS Transfer</h3>
    ${isUs
      ? `<p class="font_7">After your shares reach Fidelity, you are able to request the DRS transfer from Fidelity to the issuer's transfer agent. To do this you can follow our <a href="/brokers/fidelity">guide on how to DRS transfer from Fidelity</a>.</p>`
      : `<p class="font_7">After your shares reach IBKR, you are able to request the DRS transfer from IBKR to the issuer's transfer agent. To do this you can follow our <a href="/brokers/interactive-brokers">guide on how to DRS transfer from IBKR</a>.</p>`
    }
    `
}}
  
function usDrsBrokerTemplate(){return{
  enSummaryParagraph:
  `<p class="font_7">${name} can DRS shares. ${isExpensive ? `However, they charge an expensive fee, so you may want to ACAT transfer to another broker first, such as Fidelity.`:``}</p>
  ${!bespokeInstructions?"":`
    <h2 class="font_2">Specifics for ${name}</h2>
    ${bespokeInstructions}
  `}`
}}
  
function nonUsDrsBrokerTemplate(){return{
  enSummaryParagraph:
  `<p class="font_7">${name} can DRS shares. ${isExpensive ? `However, they charge an expensive fee, so you may want to transfer to another broker first, such as Interactive Brokers.`:``}</p>
  ${!bespokeInstructions?"":`
    <h2 class="font_2">Specifics for ${name}</h2>
    ${bespokeInstructions}
  `}`
}}
""";

SELECT
  REGEXP_REPLACE(
    TO_HEX(SHA1(name)),
    "^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})",
    "\\1-\\2-\\3-\\4-\\5"
  ) as _id,
  b.name as title,
  ac.enSummaryParagraph
FROM `apes-on-parade-default.src_first_party.curated_brokers_snapshot` as b
LEFT JOIN UNNEST([assembledContent(
    b.name,
    b.country,
    b.contact.email,
    b.drs.hasDirect,
    b.drs.doesRequireAccount,
    b.drs.isExpensive,
    b.drs.transferUnavailable,
    b.drs.expectedFee,
    b.drs.expectedDuration,
    b.drs.ibkrName,
    b.enLocalized.bespokeInstructions
)]) as ac

-- LIMIT 100