<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { page } from '$app/stores';
	import zones from '$lib/timezones.json';
	import ms from 'ms';
	import { fade } from 'svelte/transition';
	import Required from '$components/Required.svelte';
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';

	let modified = false;

	beforeNavigate((navigation) => {
		if (modified && !confirm('Du hast nicht gespeicherte Einstellungen! Sicher das du sie verwerfen möchtest?')) {
			navigation.cancel();
		}
	});

	onMount(() => {
		window.addEventListener('beforeunload', (event) => {
			if (modified) {
				event.preventDefault();
				event.returnValue = '';
			}
		});
	});

	let { settings, channels, locales, roles } = data;

	const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
	const expanded = { workingHours: false };

	channels = channels.filter((c) => c.type === 0); // text
	roles = roles.filter((r) => r.name !== '@everyone').sort((a, b) => b.rawPosition - a.rawPosition);
	roles.forEach((r) => {
		r._hexColor = r.color > 0 ? `#${r.color.toString(16).padStart(6, '0')}` : null;
		r._style = r._hexColor ? `color: ${r._hexColor}` : '';
	});
	settings.autoClose = settings.autoClose ? ms(settings.autoClose) : '';
	settings.logChannel = settings.logChannel ?? '';
	settings.staleAfter = settings.staleAfter ? ms(settings.staleAfter) : '';
	settings.workingHours = settings.workingHours.map((v) => (v === null ? [] : v));

	let autoTag = Array.isArray(settings.autoTag) ? 'custom' : settings.autoTag; // there are 2 inputs for autoTag, need separate variables
	let error = null;
	let loading = false;

	const submit = async () => {
		try {
			// error = null;
			loading = true;
			const json = { ...settings };
			json.autoClose = settings.autoClose ? ms(settings.autoClose) : null;
			json.staleAfter = settings.staleAfter ? ms(settings.staleAfter) : null;
			// if (json.autoClose !== null && json.staleAfter === null)
			// 	throw new Error('autoClose cannot be set unless staleAfter is also set.');
			if (autoTag !== 'custom') json.autoTag = autoTag;
			else if (!Array.isArray(settings.autoTag)) json.autoTag = []; // it only updates if you select (and optionally deselect) a channel
			if (settings.logChannel === '') json.logChannel = null;
			json.workingHours = settings.workingHours.map((v) => (v.length === 0 ? null : v));

			const response = await fetch(`/api/admin/guilds/${$page.params.guild}/settings`, {
				method: 'PATCH',
				body: JSON.stringify(json),
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				}
			});
			const body = await response.json();

			if (!response.ok) {
				throw body;
			} else {
				modified = false;
				window.location = './';
			}
		} catch (err) {
			loading = false;
			error = err;
			window.scroll({
				top: 0,
				behavior: 'smooth'
			});
		}
	};
</script>

<h1 class="m-4 text-4xl font-bold text-center">Allgemeine Einstellungen</h1>
<div class="m-2 p-4 max-w-lg mx-auto text-lg">
	{#if error}
		<div id="error" class="text-center break-words">
			<div
				class="bg-red-400 dark:bg-red-500 text-red-800 dark:text-red-400 bg-opacity-40 dark:bg-opacity-20 mb-4 p-6 px-12 rounded-lg text-center max-w-lg inline-block"
			>
				<p class="font-semibold text-xl">Error</p>
				{error.message ?? error}
			</div>
		</div>
	{/if}
	<div class="mb-8 text-orange-600 dark:text-orange-400 text-center">
		<p class="font-semibold"><i class="fa-solid fa-triangle-exclamation" /> Warning</p>
		<p>
			Diese Seite ist so konzipiert, dass sie "gerade noch funktioniert".
			<a
				href="https://wiki.foxco-network.de/en/discord/ticket-bot"
				class="font-semibold hover:underline">Lesen Sie die Dokumentation</a
			>
			um nicht etwas kaputt zu machen!
			<br>
			<br>
			P.S. Habe das einfach nur Übersetzt, keine Ahnung was damit genau gemeint ist...
		</p>
	</div>
	<form on:submit|preventDefault={() => submit()} on:change={() => (modified = true)}>
		<div class="my-4 grid grid-cols-1 gap-8">
			<div>
				<label class="font-medium">
					Auto close after
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="Wie lange soll der Bot warten, bevor er ein Ticket schließt (bei Schließ- Anfragen und veralteten Anfragen)?"
					/>
					<input type="text" class="form-input input" bind:value={settings.autoClose} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Auto Tag Channel
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="In welchen Channels soll der Bot automatisch auf Tags reagieren?"
					/>
					<select class="form-multiselect block input font-normal" bind:value={autoTag}>
						<option value="custom">Spezielle Channel (wie FAQ)</option>
						<option value="ticket">Nur Tickets</option>
						<option value="!ticket">Alle nicht Ticket Channel</option>
						<option value="all">Alle Channel</option>
					</select>
					{#if autoTag === 'custom'}
						<select
							multiple
							class="form-multiselect input font-normal"
							bind:value={settings.autoTag}
						>
							{#each channels as channel}
								<option value={channel.id} class="p-1 m-1 rounded">
									<i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" />
									{channel.name}
								</option>
							{/each}
						</select>
					{/if}
				</label>
			</div>
			<div>
				<label for="archive" class="font-medium">
					Archiv Funktion
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="Sollen Nachrichten in Tickets für spätere Nutzung gespeichert werden?"
					/>
					<input
						type="checkbox"
						id="archive"
						name="archive"
						class="form-checkbox"
						bind:checked={settings.archive}
					/>
				</label>
			</div>
			<div>
				<label class="font-medium">
					Rollen Blockliste
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="Welche Rollen soll der Bot ignorieren?"
					/>
					<select
						multiple
						class="form-multiselect input font-normal h-44"
						bind:value={settings.blocklist}
					>
						{#each roles as role}
							<option value={role.id} class="p-1 m-1 rounded" style={role._style}>
								<i class="fa-solid fa-at text-gray-500 dark:text-slate-400" style={role._style} />
								{role.unicodeEmoji || ''}
								{role.name}
							</option>
						{/each}
					</select>
				</label>
			</div>
			<div>
				<div class="font-medium">
					Knöpfe
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="Welche Knöpfe sollen angezeigt werden? (wenn das Feature in der Kategorie aktiviert ist)"
					/>
					<div class="mx-4">
						<div>
							<label for="claimButton" class="font-medium text-base">
								Übernehmen
								<i
									class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
									title="Fügt einen Übernehmen/ Abgeben Knopf hinzu (wenn aktiviert in der Kategorie)"
								/>
								<input
									type="checkbox"
									id="claimButton"
									name="claimButton"
									class="form-checkbox"
									bind:checked={settings.claimButton}
								/>
							</label>
						</div>
						<div>
							<label for="closeButton" class="font-medium text-base">
								Schließen
								<i
									class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
									title="Fügt einen Schließen Knopf hinzu"
								/>
								<input
									type="checkbox"
									id="closeButton"
									name="closeButton"
									class="form-checkbox"
									bind:checked={settings.closeButton}
								/>
							</label>
						</div>
					</div>
				</div>
			</div>
			<div>
				<label class="font-medium">
					Error Farbe
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="In welcher Farbe sollen Fehler angezeigt werden?"
					/>
					<input type="text" class="form-input input" bind:value={settings.errorColour} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Fußzeile
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="Was soll in der Fußzeile stehen? P.S Ehre wenn es so bleibt wie es ist! ♥"
					/>
					<input type="text" class="form-input input" bind:value={settings.footer} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Sprache
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="In welcher Sprache soll der Bot Antworten?"
					/>
					<select class="form-multiselect input" bind:value={settings.locale}>
						{#each locales as locale}
							<option value={locale} class="p-1">
								<i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" />
								{locale}
							</option>
						{/each}
					</select>
				</label>
			</div>
			<div>
				<label class="font-medium">
					Log Channel
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="In welchen Channel sollen die Logs geschickt werden?"
					/>
					<select class="form-multiselect input" bind:value={settings.logChannel}>
						<option value="">Keinen</option>
						<option disabled>------------</option>
						{#each channels as channel}
							<option value={channel.id} class="p-1">
								<i class="fa-solid fa-hashtag text-gray-500 dark:text-slate-400" />
								{channel.name}
							</option>
						{/each}
					</select>
				</label>
			</div>
			<div>
				<label class="font-medium">
					Primär Farbe
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="Welche Farbe soll die normale Einbettung haben?"
					/>
					<input type="text" class="form-input input" bind:value={settings.primaryColour} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Als Unbearbeitet markieren
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="Ab wann soll der Bot den Support Erinnern das es ein nicht bearbeitetes Ticket gibt?"
					/>
					<input type="text" class="form-input input" bind:value={settings.staleAfter} />
				</label>
			</div>
			<div>
				<label class="font-medium">
					Erfolg Farbe
					<i
						class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
						title="In welcher Farbe soll der 'Erfolg' dargestellt werden?"
					/>
					<input type="text" class="form-input input" bind:value={settings.successColour} />
				</label>
			</div>
			<div>
				<div class="font-medium grid grid-cols-1 gap-2">
					<div>
						Support Zeiten
						<i
							class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
							title="Wann ist der Support erreichbar/ werden Tickets bearbeitet?"
						/>
						<p
							class="select-none text-gray-500 dark:text-slate-400 hover:text-blurple dark:hover:text-blurple cursor-pointer transition duration-300"
							on:click={() => (expanded.workingHours = !expanded.workingHours)}
						>
							<i
								class="fa-solid {expanded.workingHours
									? 'fa-angle-up'
									: 'fa-angle-down'} float-right text-xl"
							/>
							<span class="text-sm"> Klicken um {expanded.workingHours ? 'einzuklappen' : 'aufzuklappen'}</span>
						</p>
					</div>

					{#if expanded.workingHours}
						<div in:fade out:fade>
							<div class="mx-4">
								<label>
									<p class="text-base">
										Zeitzone
										<Required />
									</p>
									<input
										type="text"
										list="timezones"
										class="form-input input"
										required
										bind:value={settings.workingHours[0]}
									/>
									<datalist id="timezones" class="">
										{#each zones as zone}
											<option value={zone} class="p-1">
												{zone}
											</option>
										{/each}
									</datalist>
								</label>
								{#each days as day, index}
									<label for={day}>
										<p class="text-base">{day}</p>
										<div class="flex items-center">
											<input
												type="time"
												class="form-input m-2 rounded-md shadow-sm bg-gray-100 dark:bg-slate-800 border-transparent focus:border-blurple focus:border-2 focus:bg-white focus:ring-0 font-normal text-center grow"
												bind:value={settings.workingHours[index + 1][0]}
											/>
											<i class="fa-solid fa-arrow-right-long" />
											<input
												type="time"
												class="form-input m-2 rounded-md shadow-sm bg-gray-100 dark:bg-slate-800 border-transparent focus:border-blurple focus:border-2 focus:bg-white focus:ring-0 font-normal text-center grow"
												bind:value={settings.workingHours[index + 1][1]}
											/>
										</div>
									</label>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
		<button
			type="submit"
			disabled={loading}
			class="mt-4 float-right bg-green-300 hover:bg-green-500 hover:text-white dark:bg-green-500/50 dark:hover:bg-green-500 dark:hover:text-white p-2 px-5 rounded-lg font-medium transition duration-300 disabled:cursor-not-allowed"
		>
			{#if loading}
				<i class="fa-solid fa-spinner animate-spin" />
			{/if}
			Speichern
		</button>
	</form>
</div>
