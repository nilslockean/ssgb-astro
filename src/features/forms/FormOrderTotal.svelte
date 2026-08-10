<script lang="ts">
  import { defaultLocale, type Locale } from "@lib/routeUtils";
  import { formatPrice } from "@lib/stringUtils";

  let {
    numDays = 2,
    priceSingle = 1,
    priceDouble = 2,
    priceMany = 3,
    locale = defaultLocale,
  } = $props();

  let nParticipants = $state(0);

  $effect(() => {
    const input = document.querySelector<HTMLInputElement>(
      "input[type=number][name=numParticipants]",
    );
    if (!input) return;
    nParticipants = parseInt(input.value, 10) || 0;
    input.addEventListener("input", () => {
      nParticipants = parseInt(input.value, 10) || 0;
    });
  });

  let basePrice = $derived.by(() => {
    if (nParticipants === 1) return priceSingle;
    if (nParticipants === 2) return priceDouble;
    return priceMany;
  });

  let total = $derived(nParticipants * basePrice * numDays);

  const TRANSLATIONS = {
    total: {
      sv: "Totalt",
      da: "I alt",
      en: "Total",
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

{#if nParticipants > 0}
  <div class="order-total">
    <p class="order-total__label">{t("total")}:</p>
    <output class="order-total__price">{formatPrice([total])}</output>
    <p class="order-total__tax">{t("inclTax")}</p>
  </div>
{/if}

<style>
  .order-total {
    grid-column: 1 / -1;
    padding: var(--space-4);
    background: var(--color-surface-lighter);
    border-radius: var(--radius-md, 6px);
    border: 1px solid var(--color-line);
  }

  .order-total__label {
    font-weight: 600;
    margin: 0;
  }

  .order-total__price {
    display: block;
    font-size: var(--text-3xl);
    font-weight: 500;
    font-family: var(--font-heading);
    margin: var(--space-1) 0;
  }

  .order-total__tax {
    margin: 0;
    font-size: var(--text-xs);
    opacity: 0.6;
  }
</style>
