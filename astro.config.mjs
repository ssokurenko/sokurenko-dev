// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { SECTIONS } from './src/config/taxonomy.ts';
import { ORIGIN_TRIAL_TOKENS } from './src/config/origin-trials.ts';
import { rehypePagefindWeights } from './scripts/rehype-pagefind-weights.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://sokurenko.dev',
	// `markdown.rehypePlugins` is deprecated in favor of `markdown.processor`
	// (unified({ rehypePlugins }) from @astrojs/markdown-remark), but that
	// API replaces Astro's whole markdown pipeline rather than composing
	// with Starlight's own remark/rehype additions (heading anchors, code
	// copy buttons) — verified this array form still works correctly with
	// Starlight; switching risks silently losing those features.
	markdown: {
		rehypePlugins: [rehypePagefindWeights],
	},
	// Companion-video thumbnails (src/components/SheetVideo.astro). Fetched
	// and re-encoded at build time and served from this origin — visitors'
	// browsers never contact i.ytimg.com.
	image: {
		domains: ['i.ytimg.com'],
	},
	integrations: [
		starlight({
			title: 'SokurenkoDEV',
			customCss: ['./src/styles/custom.css'],
			social: [],
			// Set explicitly because it is no longer Starlight's default
			// `./favicon.svg`, which was deleted. Shares the hero
			// illustration rather than being its own asset.
			favicon: '/illustrations/hero.svg',
			// Google Analytics: the one deliberate exception to the
			// site's zero-third-party-request-on-load policy — see
			// specs/09-quality-bar.md#performance-budgets. (The YouTube
			// player is the other, loaded only when a visitor presses play
			// on a companion video — SheetVideo.astro.) Injected via
			// Starlight's `head` so it lands on every page, `async` so
			// it never blocks render.
			head: [
				// Chrome origin-trial tokens. Not a network request and not a
				// third party — a token only tells the visitor's own browser it
				// may run an experimental API on this origin. Empty by default,
				// in which case nothing is emitted. See src/config/origin-trials.ts.
				...ORIGIN_TRIAL_TOKENS.map(({ token }) => ({
					tag: /** @type {const} */ ('meta'),
					attrs: { 'http-equiv': 'origin-trial', content: token },
				})),
				{
					tag: 'script',
					attrs: {
						src: 'https://www.googletagmanager.com/gtag/js?id=G-79T6FT7YES',
						async: true,
					},
				},
				{
					tag: 'script',
					content: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-79T6FT7YES');`,
				},
			],
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
				Search: './src/components/Search.astro',
				PageTitle: './src/components/PageTitle.astro',
				Footer: './src/components/Footer.astro',
				Hero: './src/components/Hero.astro',
			},
			sidebar: SECTIONS.map((section) => ({
				label: section.label,
				collapsed: true,
				items: [{ autogenerate: { directory: section.slug } }],
			})),
		}),
	],
});
