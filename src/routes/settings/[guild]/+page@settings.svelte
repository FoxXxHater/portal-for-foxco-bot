<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { onMount } from 'svelte';

	const { guild, problems } = data;

	let createdAt = '';
	onMount(() => {
		createdAt = new Intl.DateTimeFormat('default').format(new Date(guild.createdAt)); // navigator.languages[0]
	});

	const getProblemText = (p) => {
		switch (p.id) {
			case 'logChannelMissingPermission':
				return `Bitte gib dem Bot <span class="font-mono">${p.permission}</span> Rechte im log Channel.`;
		}
	};
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
	<div class="text-center">
		{#each problems as problem}
			<div class="m-4">
				<div
					class="p-2 rounded-xl bg-orange-400/20 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-600 dark:border-orange-400 border-2 font-medium"
				>
					<i class="fa-solid fa-triangle-exclamation text-2xl float-left mr-2" />
					{@html getProblemText(problem)}
				</div>
			</div>
		{/each}
		{#if guild.stats.categories.length === 0}
			<div class="m-4">
				<a href={guild.id + '/categories/new'}>
					<div class="p-2 rounded-xl border-blurple bg-blurple/20 border-2 link font-medium">
						<i class="fa-solid fa-circle-info text-2xl float-left" />
						Erstelle eine Kategorie um zu starten
						<i class="fa-solid fa-arrow-right-long" />
					</div>
				</a>
			</div>
		{/if}
		<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
			<a
				href={guild.id + '/general'}
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm link"
			>
				<i class="fas fa-gears text-4xl mb-4" />
				<p class="font-semibold text-center text-lg">Allgemein</p>
			</a>
			<a
				href={guild.id + '/categories'}
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm link"
			>
				<i class="fas fa-list text-4xl mb-4" />
				<p class="font-semibold text-center text-lg">Kategorien</p>
			</a>
			<a
				href={guild.id + '/panels'}
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm link"
			>
				<i class="fas fa-sliders text-4xl mb-4" />
				<p class="font-semibold text-center text-lg">Panel</p>
			</a>
			<a
				href={guild.id + '/feedback'}
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm link"
			>
				<i class="fas fa-comments text-4xl mb-4" />
				<p class="font-semibold text-center text-lg">Feedback</p>
			</a>
			<a
				href={guild.id + '/tags'}
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm link"
			>
				<i class="fas fa-tags text-4xl mb-4" />
				<p class="font-semibold text-center text-lg">Tags</p>
			</a>
			<a
				href={guild.id + '/reset'}
				class="bg-red-300 dark:bg-red-500/20 hover:bg-red-500 dark:hover:bg-red-500 p-4 rounded-xl shadow-sm transition duration-300"
			>
				<i class="fas fa-triangle-exclamation text-4xl mb-4" />
				<p class="font-semibold text-center text-lg">⚠️ Zurücksetzen ⚠️</p>
			</a>
		</div>
	</div>
	<div>
		<div class="bg-white dark:bg-slate-700 p-4 rounded-xl shadow-sm">
			<div
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-center gap-4"
			>
				<img src={guild.logo} alt="" class="h-12 rounded-full" />
				<p>
					<span class="font-bold text-2xl">
						{guild.name}
					</span>
					<br />
					<span class="text-gray-500 dark:text-slate-400">
						<i class="fa-solid fa-calendar-days" />
						Hinzugefügt am:
						{createdAt}
					</span>
				</p>
			</div>
			<div class="m-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
				<div>
					<h6 class="font-semibold">Auflösungszeit</h6>
					<p class="text-gray-500 dark:text-slate-400">{guild.stats.avgResolutionTime}</p>
				</div>
				<div>
					<h6 class="font-semibold">Reaktionseit</h6>
					<p class="text-gray-500 dark:text-slate-400">{guild.stats.avgResponseTime}</p>
				</div>
				<div>
					<h6 class="font-semibold">Kategorien</h6>
					<p class="text-gray-500 dark:text-slate-400">{guild.stats.categories.length}</p>
				</div>
				<div>
					<h6 class="font-semibold">Tags</h6>
					<p class="text-gray-500 dark:text-slate-400">{guild.stats.tags}</p>
				</div>
				<div>
					<h6 class="font-semibold">Tickets</h6>
					<p class="text-gray-500 dark:text-slate-400">{guild.stats.tickets}</p>
				</div>
				<div>
					<h6 class="font-semibold">Am meisten genutze Kategorie</h6>
					<p class="text-gray-500 dark:text-slate-400">
						{guild.stats.categories.sort((a, b) => b - a)[0]?.name ?? 'Noch keine'}
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
