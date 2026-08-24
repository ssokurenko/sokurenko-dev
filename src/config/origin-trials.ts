/**
 * Chrome origin-trial tokens, emitted as <meta http-equiv="origin-trial"> by
 * astro.config.mjs.
 *
 * A token is what lets an experimental browser API run for ordinary visitors
 * on a specific origin, with no flag on their side. It is public by design —
 * it ships in the HTML of every page — so it belongs in the repo, not in a
 * secret. Tokens are origin-bound and time-limited: one registered for
 * https://sokurenko.dev does nothing on http://localhost, and every token has
 * a hard expiry after which the feature silently stops.
 *
 * Register at https://developer.chrome.com/origintrials — one token per
 * origin. Adding none leaves the array empty, no meta tag is emitted, and
 * every dependent feature falls back exactly as if the trial did not exist.
 *
 * Nothing here is load-bearing for the site: the only consumer is the home
 * page's peel effect, which probes for API support at runtime and renders the
 * plain hero when it is absent. See src/vendor/canvasui/README.md.
 */
export interface OriginTrialToken {
	/** The origin this token was issued for, for humans reading the list. */
	origin: string;
	/** Trial feature name, as shown on the registration page. */
	feature: string;
	/** ISO date the token stops working. Past this, the tag is dead weight. */
	expires: string;
	/** The token string, copied verbatim from the registration page. */
	token: string;
}

export const ORIGIN_TRIAL_TOKENS: OriginTrialToken[] = [
	{
		// Enables the home-page peel effect for Chrome visitors with no flag.
		// Issued without `isSubdomain`, so it covers https://sokurenko.dev and
		// nothing else — not www., and not localhost. Local development still
		// needs chrome://flags/#canvas-draw-element.
		//
		// When this expires the peel silently stops for visitors and the plain
		// hero takes over; nothing breaks. Re-register at
		// https://developer.chrome.com/origintrials to renew.
		origin: 'https://sokurenko.dev',
		feature: 'HTMLInCanvas',
		expires: '2026-10-20',
		token:
			'ArKTtR2cETETaon7t8nUCkd8CkHXYu4x8BNdLYUFtQfO0S1ZdS4Q6b+cH6Zkb3nIPgAd4hk9ycnW8arHbtOGsAwAAABTeyJvcmlnaW4iOiJodHRwczovL3Nva3VyZW5rby5kZXY6NDQzIiwiZmVhdHVyZSI6IkhUTUxJbkNhbnZhcyIsImV4cGlyeSI6MTc5MjQ1NDQwMH0=',
	},
];
