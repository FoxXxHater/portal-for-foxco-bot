<script>
	export let user;
	export let isDark;

	import { base } from '$app/paths';
	import cookie from 'cookie';
	import ms from 'ms';

	const toggle = () => {
		document.cookie = cookie.serialize('theme', isDark ? 'light' : 'dark', {
			maxAge: ms('1y') / 1000,
			path: '/',
			sameSite: 'lax'
		});
		window.location = window.location; // eslint-disable-line
	};
</script>

<div class="bg-white dark:bg-slate-700 my-8 p-4 rounded-xl shadow-sm">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:mx-8">
		<div>
			<a href={base + '/settings'} class="flex justify-center md:justify-start">
				<!-- <img src="/logo.png" class="h-8" alt="Discord Tickets" /> -->
				<img
					src="https://foxco-network.de/wp-content/uploads/2021/11/logo-print-hd-transparent.png"
					class="h-8"
					alt="FoxCo - Network Logo"
				/>
			</a>
		</div>
		<div>
			<div
				class="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left md:float-right flex items-center justify-center md:justify-end"
			>
				<a
					href={`/auth/logout`}
					class="flex items-center justify-center md:justify-end hover:font-medium"
					title="Ausloggen"
				>
					<img
						src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`}
						class="h-8 rounded-full"
						alt="Discord Tickets"
					/>
					<span class="ml-3">{user.username}</span>
				</a>
				<div class="ml-4">
					{#if isDark}
						<i
							class="fa-solid fa-moon text-lg p-1 cursor-pointer hover:text-blurple transition duration-300"
							title="Wechsel in den hellen Modus"
							on:click={() => toggle()}
						/>
					{:else}
						<i
							class="fa-solid fa-sun text-lg p-1 cursor-pointer hover:text-blurple transition duration-300"
							title="Wechsel in den dunklen Modus"
							on:click={() => toggle()}
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
