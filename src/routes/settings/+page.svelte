<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { base } from '$app/paths';

	const { client, guilds } = data;

	const good = [];
	const bad = [];

	guilds.forEach((g) => {
		if (g.added) {
			good.push(g);
		} else {
			bad.push(g);
		}
	});

	function getAuthUrl(guildId) {
		const scopes = ['applications.commands', 'bot'];
		const url = new URL('https://discord.com/oauth2/authorize');
		url.searchParams.set('scope', scopes.join(' '));
		url.searchParams.set('client_id', client.id);
		url.searchParams.set('permissions', '268561488');
		if (guildId) {
			url.searchParams.set('guild_id', guildId);
			url.searchParams.set('disable_guild_select', 'true');
		}
		return url.toString();
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
	<div class="text-center">
		<div class="grid grid-cols-1 gap-8">
			<div class="grid grid-cols-1 gap-4">
				{#if good.length === 0}
					<div class="my-4">
						<h3 class="font-semibold text-xl">Lade den Bot zu einem Server ein um ihn zu Konfigurieren</h3>
					</div>
				{:else}
					<div class="my-4">
						<h3 class="font-semibold text-xl">Verwalte deine Server</h3>
					</div>
					{#each good as guild}
						<a href={`${base}/settings/${guild.id}`}>
							<div
								class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-4 font-semibold text-lg link"
							>
								<img src={guild.logo} alt="" class="h-12 rounded-full" />
								<span>{guild.name}</span>
							</div>
						</a>
					{/each}
					{#if bad.length > 0}
						<hr class="border-white dark:border-slate-700 mt-4" />
					{/if}
				{/if}
			</div>

			{#if good.length > 0}
				<div class="my-4">
					<h4 class="font-semibold">Füge den Bot zu weiteren Servern hinzu</h4>
				</div>
			{/if}

			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each bad as guild}
					<a href={getAuthUrl(guild.id)} target="_blank" rel="noopener noreferrer">
						<div
							class="bg-gray-100 dark:bg-slate-800 p-3 rounded-xl shadow-sm flex items-center gap-4 font-semibold link h-full"
						>
							<img src={guild.logo} alt="" class="h-10 rounded-full" />
							<span>{guild.name}</span>
						</div>
					</a>
				{/each}
				<a href={getAuthUrl()} target="_blank" rel="noopener noreferrer">
					<div
						class="bg-gray-100 dark:bg-slate-800 flex items-center gap-4 p-3 rounded-xl shadow-sm font-semibold text-lg link h-full"
					>
						<div class="w-full text-center">
							<i class="fa-solid fa-circle-plus mr-2" /><span>Hinzufügen</span>
						</div>
					</div>
				</a>
			</div>
		</div>
	</div>
	<div>
		<div class="bg-white dark:bg-slate-700 p-4 rounded-xl shadow-sm mb-4">
			<div
				class="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-center gap-4 font-semibold"
			>
				<img src={client.avatar} alt="" class="h-12 rounded-full" />
				<span class="font-bold text-2xl">
					{client.username}<span class="text-gray-500 dark:text-slate-400"
						>#{client.discriminator}</span
					>
				</span>
			</div>
			<div class="m-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
				<div>
					<h6 class="font-semibold">Aktivierte Benutzer</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.activatedUsers}</p>
				</div>
				<div>
					<h6 class="font-semibold">Archivierte Nachrichten</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.archivedMessages}</p>
				</div>
				<div>
					<h6 class="font-semibold">Auflösungszeit</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.avgResolutionTime}</p>
				</div>
				<div>
					<h6 class="font-semibold">Antwortzeit</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.avgResponseTime}</p>
				</div>
				<div>
					<h6 class="font-semibold">Kategorien</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.categories}</p>
				</div>
				<div>
					<h6 class="font-semibold">Server</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.guilds}</p>
				</div>
				<!-- <div>
					<h6 class="font-semibold">Durch. Benutzer</h6>
					<p class="text-gray-500 dark:text-slate-400">
						{Math.floor(client.stats.members / client.stats.guilds)}
					</p>
				</div>
				<div>
					<h6 class="font-semibold">Alle Benutzer</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.members}</p>
				</div> -->
				<div>
					<h6 class="font-semibold">Benutzer (durch.)</h6>
					<p class="text-gray-500 dark:text-slate-400">
						{client.stats.members}
						({Math.floor(client.stats.members / client.stats.guilds)})
					</p>
				</div>
				<div>
					<h6 class="font-semibold">Tags</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.tags}</p>
				</div>
				<div>
					<h6 class="font-semibold">Tickets</h6>
					<p class="text-gray-500 dark:text-slate-400">{client.stats.tickets}</p>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="max-w-3xl my-8 mx-auto">
	<hr class="border-white dark:border-slate-700 mx-24 my-8" />
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
		<a href="https://wiki.foxco-network.de/en/discord/ticket-bot" target="_blank" rel="noopener noreferrer">
			<div
				class="bg-gray-50/75 dark:bg-slate-800/75 p-4 rounded-xl shadow-sm link flex items-center gap-4"
			>
				<i class="fa-solid fa-book text-5xl" />
				<div>
					<p class="text-lg font-semibold">Dokumentation</p>
					<p>Schaue im Guide nach weiteren Informationen</p>
				</div>
			</div>
		</a>
		<a href="https://support.foxco-network.de/" target="_blank" rel="noopener noreferrer">
			<div
				class="bg-gray-50/75 dark:bg-slate-800/75 p-4 rounded-xl shadow-sm link flex items-center gap-4"
			>
				<i class="fa-solid fa-circle-question text-5xl" />
				<div>
					<p class="text-lg font-semibold">Support</p>
					<p>Erstelle ein Ticket in unserem System</p>
				</div>
			</div>
		</a>
		<a href="https://discord.com/invite/WnRJxu9" target="_blank" rel="noopener noreferrer">
			<div
				class="bg-gray-50/75 dark:bg-slate-800/75 p-4 rounded-xl shadow-sm link flex items-center gap-4"
			>
				<i class="fa-brands fa-discord text-5xl" />
				<div>
					<p class="text-lg font-semibold">Discord</p>
					<p>Join gerne der Community</p>
				</div>
			</div>
		</a>
	</div>
</div>
