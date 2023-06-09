<script>
	export let state;
	import { getContext } from 'svelte';
	import { marked } from 'marked';
	import Required from './Required.svelte';
</script>

<div>
	<label>
		<span class="font-medium">Name</span>
		<Required />
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="Name des Tags (kann auch UNICODE Emojs enthalten -keine Emoji Namen-)"
		/>
		<input type="text" class="form-input input" required bind:value={state.name} />
	</label>
</div>
<div>
	<label>
		<span class="font-medium">Antwort Trigger</span>
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="Optional - Text mit dem der Tag ausgelöst wird"
		/>
		<input type="text" class="form-input input" bind:value={state.regex} />
	</label>
</div>
<div>
	<label class="font-medium">
		<span class="font-medium">Nachricht/ Inhalt</span>
		<Required />
		<i
			class="fa-solid fa-circle-question text-gray-500 dark:text-slate-400 cursor-help"
			title="Nachricht/ Antwort die gesendet werden soll"
		/>
		<textarea class="form-input input h-24" maxlength="1000" required bind:value={state.content} />
	</label>
	{#if state.content}
		<p class="text-sm font-medium">Ausgabe</p>
		<div
			class="block p-3 w-full rounded-md shadow-sm bg-blurple/20 dark:bg-blurple/20 text-sm font-mono break-words"
		>
			{@html marked.parse(
				state.content
					.replace(/\n/g, '\n\n')
					.replace(/{+\s?(user)?name\s?}+/gi, '@' + getContext('user').username)
			)}
		</div>
	{/if}
</div>
