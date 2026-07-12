<script lang="ts">
  import { defaultLocale, type Locale } from "@lib/routeUtils";
  import { formatPrice } from "@lib/stringUtils";

  let {
    maxParticipants = 4,
    numDays = 2,
    priceSingle = 1,
    priceDouble = 2,
    priceMany = 3,
    locale = defaultLocale,
  } = $props();

  let nParticipants = $state(2);
  let basePrice = $derived.by(() => {
    if (nParticipants === 1) {
      return priceSingle;
    }
    if (nParticipants === 2) {
      return priceDouble;
    }
    return priceMany;
  });
  let price = $derived({
    total: nParticipants * basePrice * numDays,
    perPerson: basePrice,
  });
  $effect(() => {
    const event = new CustomEvent("num_participants_updated", {
      detail: nParticipants,
    });
    window.dispatchEvent(event);
  });
  const TRANSLATIONS = {
    labelSingle: {
      sv: "Om bokar ensam",
      da: "Hvis du tager kurset allene",
      en: "If you take the course alone",
    },
    labelMultiple: {
      sv: "Om ni är $1 personer",
      en: "If you are $1 people",
      da: "Hvis I er $1 personer",
    },
    priceEyebrow: {
      sv: "kostar kursen totalt",
      da: "er den samlade pris",
      en: "the total is",
    },
    subTextSingle: {
      sv: "Det är $1 per dag.",
      da: "Det er $1 om dagen.",
      en: "That is $1 per day.",
    },
    subTextMultiple: {
      sv: "Det är $1 per person och dag.",
      da: "Det er $1 per person per dag.",
      en: "That is $1 per person per day.",
    },
    inclTax: {
      sv: "Inklusive moms.",
      da: "SEK inklusive moms.",
      en: "SEK, VAT included.",
    },
  } as const satisfies Record<string, Record<Locale, string>>;
  function t(key: keyof typeof TRANSLATIONS, interpolate = ""): string {
    return TRANSLATIONS[key][locale].replaceAll("$1", interpolate);
  }
</script>

<div class="calculator">
  <p>
    <label for="pricing-calculator-numparticipants"
      >{t(
        nParticipants === 1 ? "labelSingle" : "labelMultiple",
        String(nParticipants),
      )}</label
    >
  </p>
  <div class="calculator__input">
    <small>1</small>
    <input
      id="pricing-calculator-numparticipants"
      type="range"
      min="1"
      max={maxParticipants}
      bind:value={nParticipants}
    />
    <small>{maxParticipants}</small>
  </div>
  <p>
    {t("priceEyebrow")}
    <output for="pricing-calculator-numparticipants"
      >{formatPrice([price.total])}</output
    >
  </p>
  <p>
    {t(
      nParticipants === 1 ? "subTextSingle" : "subTextMultiple",
      formatPrice([price.perPerson]),
    )}
    <br /><small>{t("inclTax")}</small>
  </p>
</div>

<style>
  p {
    margin-top: var(--space-4);
  }
  output {
    margin: 0;
    display: block;
    font-size: var(--text-4xl);
    font-weight: 500;
    font-family: var(--font-heading);
  }

  .calculator__input {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-2);

    small {
      color: var(--color-muted);
      opacity: 0.5;
      font-size: var(--text-xs);
    }

    input {
      accent-color: var(--color-accent);
      width: 100%;
      max-width: var(--prose);
    }
  }
</style>
