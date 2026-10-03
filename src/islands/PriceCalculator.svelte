<script lang="ts">
  import { defaultLocale, type Locale } from "@lib/routeUtils";
  import { calculateCoursePrice } from "@lib/pricingUtils";
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
  let price = $derived(
    calculateCoursePrice(nParticipants, basePrice, Number(numDays)),
  );
  $effect(() => {
    const event = new CustomEvent("num_participants_updated", {
      detail: nParticipants,
    });
    window.dispatchEvent(event);
  });
  const TRANSLATIONS = {
    participantsLabel: {
      sv: "Antal deltagare",
      da: "Antal deltagere",
      en: "Number of participants",
    },
    daysLabel: {
      sv: "Antal dagar",
      da: "Antal dage",
      en: "Number of days",
    },
    dailyPriceLabel: {
      sv: "Pris per person och dag",
      da: "Pris per person per dag",
      en: "Price per person per day",
    },
    perPersonLabel: {
      sv: "Totalt per person",
      da: "I alt per person",
      en: "Total per person",
    },
    totalLabel: {
      sv: "Totalt",
      da: "I alt",
      en: "Grand total",
    },
    inclTax: {
      sv: "Inklusive moms.",
      da: "SEK inklusive moms.",
      en: "SEK, VAT included.",
    },
  } as const satisfies Record<string, Record<Locale, string>>;
  function t(key: keyof typeof TRANSLATIONS): string {
    return TRANSLATIONS[key][locale];
  }
</script>

<div class="calculator">
  <label for="pricing-calculator-numparticipants">
    {t("participantsLabel")}: {nParticipants}
  </label>
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
  <dl class="calculator__breakdown">
    <div class="calculator__row">
      <dt>{t("daysLabel")}</dt>
      <dd>{numDays}</dd>
    </div>
    <div class="calculator__row">
      <dt>{t("dailyPriceLabel")}</dt>
      <dd>{formatPrice([price.perPersonDaily])}</dd>
    </div>
    <div class="calculator__row">
      <dt>{t("perPersonLabel")}</dt>
      <dd>{formatPrice([price.perPersonTotal])}</dd>
    </div>
    <div class="calculator__row calculator__row--emphasis">
      <dt>{t("totalLabel")}</dt>
      <dd>
        <output for="pricing-calculator-numparticipants"
          >{formatPrice([price.total])}</output
        >
      </dd>
    </div>
  </dl>
  <small class="calculator__tax-note">{t("inclTax")}</small>
</div>

<style>
  .calculator > label {
    display: block;
    margin-bottom: var(--space-2);
  }

  .calculator__breakdown {
    margin-top: var(--space-6);
  }

  .calculator__row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--space-4);
    padding-block: var(--space-2);
    border-bottom: 1px solid var(--color-muted);
  }

  .calculator__row dd {
    text-align: right;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .calculator__row--emphasis {
    color: var(--color-default);
    font-weight: var(--font-weight-bold);
  }

  .calculator__tax-note {
    display: block;
    text-align: right;
    margin-top: var(--space-2);
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
