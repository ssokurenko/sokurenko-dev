// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { SECTIONS } from './src/config/taxonomy.ts';
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
	integrations: [
		starlight({
			title: 'SokurenkoDEV',
			customCss: ['./src/styles/custom.css'],
			social: [],
			components: {
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
