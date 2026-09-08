# Connecting Clover to the payment page

`payments.html` is complete up to the point where money moves. Choosing what you
are paying for and setting the amount both work today, and the summary follows
along. The customer detail fields are on the page but are not yet wired to
anything. The final button is the piece that needs a developer.

## Why the button can't do it from here

Creating a Clover checkout session requires your Clover **API key**. Anything in
these files is downloadable by anyone who visits the site, so the key cannot live
here. It has to sit on a server that the page calls.

## What a developer needs to build

One endpoint. Roughly:

```
POST /api/clover/checkout
  body: { kind, amount }
  ↓ server calls Clover's Create Checkout endpoint with the secret API key
  ↓ Clover returns a one-time checkout URL
  response: { href }
```

Then in `payments.html`, find `btn.onclick` near the end of the `render()`
function — it is the click handler for `#pay-button` — and replace its
`window.alert(...)` with:

```js
const r = await fetch('/api/clover/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ kind: state.kind, amount: state.amount })
});
window.location.href = (await r.json()).href;
```

That handler is not declared `async`, so mark it `async` before using `await`.

A comment in that same handler says the same thing, so whoever picks this up
will find it.

The body carries only `kind` and `amount` because those are the only two values
the page tracks. The four customer detail fields — name, email, phone, reference
— are plain inputs with no `id` and no state binding, so nothing reads them
today. If the endpoint should receive them, give each field an `id` and read it
in the handler.

## Which Clover integration to ask for

**Hosted Checkout** — the customer is redirected to Clover's payment page, pays,
and comes back to your site. Clover handles the card data, which keeps your
PCI-DSS obligations light. The page can be styled to match the brand.

The alternative, **iframe**, embeds the card form directly in your page so the
customer never leaves. It looks better and costs a little more work. Either is
fine; start with Hosted Checkout.

Do **not** let anyone talk you into the custom API-only route — it requires your
own PCI DSS certification.

## Two things to decide before wiring it up

1. **Inventory.** Hosted Checkout does not read your Clover inventory. If you want
   gown availability to reflect what is actually in the studio, you need an
   ecommerce app from the Clover App Market instead. Worth deciding now rather
   than rebuilding later.
2. **Rental deposits.** A refundable deposit is a second transaction (or an
   authorisation you release later). Tell your developer which, because it
   changes how the endpoint is written.

## Ask Clover for

- Your merchant ID and an Ecommerce API key (sandbox first, then production)
- Confirmation that card-not-present transactions are enabled on your account
- Your card-not-present transaction rate — it differs from your in-store rate

## Payment logos

The card row sits at the bottom of `payments.html`, in the "Other ways to pay"
block. It is seven hardcoded tiles, each currently showing the network's name as
text — there is no logo list or config flag, so adding a real mark is a direct
edit to that tile.

Two steps per logo:

1. Save the official file into an `assets/payments/` folder. That folder does not
   exist yet, so create it. Suggested names:

   ```
   assets/payments/visa.svg
   assets/payments/mastercard.svg
   assets/payments/amex.svg
   assets/payments/discover.svg
   assets/payments/apple-pay.svg
   assets/payments/zelle.svg
   assets/payments/venmo.svg
   ```

2. In `payments.html`, find that network's tile and replace the inner text
   `<span>` with an `<img>`. Leave the outer tile `<span>` exactly as it is — it
   carries the sizing and the border.

   Before:

   ```html
   <span style="width: 78px; height: 44px; ...">
     <span style="font-family: 'Jost', sans-serif; ...">Visa</span>
   </span>
   ```

   After:

   ```html
   <span style="width: 78px; height: 44px; ...">
     <img src="assets/payments/visa.svg" alt="Visa" style="max-width: 100%; max-height: 100%; display: block;" />
   </span>
   ```

Do them one at a time. A tile you have not touched keeps showing its name, so the
row always looks finished and the page never requests a file that isn't there.

Download the real assets from the networks themselves — using their official
files is a condition of displaying the marks, and hand-drawn imitations look
cheap next to them:

| Network | Where |
|---|---|
| Visa | Visa Brand Center — "Visa Brand Mark" |
| Mastercard | Mastercard Brand Center — "Symbol and wordmark" |
| American Express | Amex Merchant Marketing Kit |
| Discover | Discover Network Brand Center |
| Apple Pay | Apple Pay Marketing Guidelines (Apple Identity Guidelines) |
| Zelle | Zelle Brand Guidelines |
| Venmo | PayPal/Venmo Brand Center — "Venmo acceptance mark" |

Ask Clover support too — merchant kits usually bundle the card-network marks in
one download.

Use the SVG where offered (PNG works — just change the extension in the filenames
above and in the `src`). Keep them on a light background and don't recolour or
stretch them. Each tile is 78×44 with 6px of padding, so a mark has roughly 66×32
to sit in, which suits the standard horizontal acceptance marks.
