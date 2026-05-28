<!-- src/lib/components/Icons.svelte -->
<script lang="ts">
  export let name: string;
  export let size: number = 24;
  export let className: string = '';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
>
  {#if name === 'LayoutIcon'}
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    <line x1="3" x2="21" y1="9" y2="9"/>
    <line x1="9" x2="9" y1="21" y2="9"/>
  {:else if name === 'MessageSquare'}
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  {:else if name === 'Activity'}
    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
  {:else if name === 'Zap'}
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  {:else if name === 'Code'}
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  {:else if name === 'Cpu'}
    <rect width="16" height="16" x="4" y="4" rx="2"/>
    <rect width="6" height="6" x="9" y="9" rx="1"/>
    <path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>
  {:else if name === 'RefreshCw'}
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M8 16H3v5"/>
  {:else if name === 'Disc'}
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="2"/>
  {:else if name === 'Mail'}
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  {:else if name === 'Linkedin'}
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  {:else if name === 'BrainCircuit'}
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396M19.938 10.5a4 4 0 0 1 .585.396"/>
    <path d="M6 18a4 4 0 0 1-1.97-3.284M17.97 14.716A4 4 0 0 1 16 18"/>
  {:else if name === 'Briefcase'}
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  {:else if name === 'Award'}
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  {:else if name === 'Wifi'}
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
    <line x1="12" x2="12.01" y1="20" y2="20"/>
  {:else if name === 'Heart'}
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  {:else if name === 'ChevronDown'}
    <path d="m6 9 6 6 6-6"/>
  {:else if name === 'ChevronUp'}
    <path d="m18 15-6-6-6 6"/>
  {:else if name === 'InfinityIcon'}
    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"/>
  {:else if name === 'ArrowRight'}
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  {:else if name === 'ArrowLeft'}
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  {:else if name === 'X'}
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  {:else if name === 'Speaker'}
    <rect width="4" height="12" x="2" y="6" rx="2" ry="2"/>
    <path d="M10 6L16 2v20l-6-4"/>
    <path d="M20 12c0-4-3-7.5-7-8M20 12c0 4-3 7.5-7 8"/>
  {:else if name === 'SpeakerOff'}
    <path d="M2 2l20 20M10 6L16 2v20l-6-4"/>
    <rect width="4" height="12" x="2" y="6" rx="2" ry="2"/>
    <path d="M22 14c0-1.5-.6-3-1.7-4.1"/>
  {:else if name === 'Menu'}
    <line x1="4" x2="20" y1="12" y2="12"/>
    <line x1="4" x2="20" y1="6" y2="6"/>
    <line x1="4" x2="20" y1="18" y2="18"/>
  {:else if name === 'MapPin'}
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  {:else if name === 'ExternalLink'}
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  {/if}
</svg>
