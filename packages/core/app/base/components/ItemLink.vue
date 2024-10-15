<script lang="ts" setup>
import type { PrezNode } from '../lib';

interface Props {
    variant?: 'item-table' | 'item-list' | 'item-header' | 'search-results' | 'item-profiles';
    /** the link href to use or PrezNode to get link info from, internal links may be controlled */
    to?: string | PrezNode;
    /** an override secondary href to include on the secondary link icon, or a PrezNode to get link info from, alternatively this will populate from the ":to" param */
    secondaryTo?: string | PrezNode;
    /** optional title tooltip to use */
    title?: string;
    /** target window for external links */
    target?: string;
    /** rel attribute */
    rel?: string;

    class?: string;
    copyLink?: boolean | string;
    hidePrimaryLink?: boolean;
    hideSecondaryLink?: boolean;
    hideUnderline?: boolean;
    hideTitle?: boolean;
    useSecondaryLinkOnly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {target: '_blank', rel: 'noopener noreferrer'});

let hideSecondaryLink = props.hideSecondaryLink || false;
let hideUnderline = props.hideUnderline || false;
let hideTitle = props.hideTitle || false;
let target = props.target;

// scenarios
// 1. to is a URL string, optionally we can have an externalTo string / PrezNode
// 2. to is a PrezNode, value will be the externalTo, if prez:link is present, it will be used as the main URL
// 3. to is a PrezNode, externalTo is a string, externalTo will be used as the external link, prez:link will be used as the main URL (if present)

switch(props.variant) {
    case 'item-table':
        break;
    case 'item-list':
        break;
    case 'item-header':
        break;
    case 'search-results':
        hideTitle = true;
        break;
    case 'item-profiles':
        hideUnderline = true;
        break;
    default:
        break;
}

/* the primary link is either the prez internal link, or the provided to string */
const url = typeof(props.to) == 'string' ? props.to : props.to?.links ? props.to?.links[0]?.value : undefined;

/* the secondary link, if provided, is either the externalTo string, or the externalTo PrezNode value */
const secondaryUrl = props.secondaryTo !== undefined 
    ? (typeof(props.secondaryTo) == 'string' ? props.secondaryTo : props.secondaryTo?.value || '')
    : props.to && typeof(props.to) == 'object' ? props.to.value : '';


/** determine the secondary link url */
// const secondaryUrl = usePrimaryLinkOnly ? primaryLink : secondaryLink;

/** determine the primary url */
// const url = (useSecondaryLinkOnly ? secondaryUrl : primaryLink || secondaryLink) || '';

/** determine the url is an external link */
const isExtLink = url ? url.startsWith('http') || url.startsWith('mailto') : false;

/** check the external link is really an external link */
const isSecondaryExtLink = secondaryUrl ? secondaryUrl.startsWith('http') || secondaryUrl.startsWith('mailto') : false;

// If we have a nuxt environment, use the nuxt link
const navigateToLink = (event: Event, path: string) => {
    if (path.startsWith('/')) {
        event.preventDefault();
        try {
            const router = useRouter();
            router.push(path);
        } catch (ex) {
            console.error(ex);
        }
    }
};

const defaultClasses = 'border-b-[2px] hover:no-underline hover:border-orange-500 ' + 
    (hideUnderline ? 'border-transparent' : 'border-gray-300 border-dashed hover:border-solid');

const linkClass = props.class ? defaultClasses + ' ' + props.class : defaultClasses;

</script>

<template>
    <!-- ItemLink -->
    <slot name="wrapper" :url="url" :title="props.title" :secondaryUrl="secondaryUrl" :target="target">
        <span>
            <a v-if="url && !hidePrimaryLink" 
                :class="linkClass"
                :href="url" :title="hideTitle ? undefined : props.title" 
                :target="isExtLink ? props.target : undefined" :rel="isExtLink ? props.rel : undefined"
                @click="(e:Event)=>navigateToLink(e, url!)">
                <slot />
            </a>
            <span v-else class="border-b-[2px] border-transparent">
                <slot />
            </span>
            <a v-if="secondaryUrl && !hideSecondaryLink"
                :href="secondaryUrl" :title="hideTitle ? undefined : props.title"
                :target="isSecondaryExtLink ? props.target : undefined" :rel="isSecondaryExtLink ? props.rel : undefined"
                :class="linkClass"
                @click="(e:Event)=>navigateToLink(e, secondaryUrl)">

                <i v-if="isSecondaryExtLink" class="pi pi-external-link ml-1 text-xs" />
                <!-- unlikely scenario, but we if our secondary link points interal show an arrow not window out -->
                <i v-else class="pi pi-angle-right ml-1 text-xs" />
            </a>
            <CopyButton v-if="props.copyLink" icon-only :value="typeof(copyLink) == 'string' ? copyLink : url || secondaryUrl" />
        </span>
    </slot>
</template>

<style scoped>
</style>