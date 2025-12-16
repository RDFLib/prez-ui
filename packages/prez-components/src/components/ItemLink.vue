<script lang="ts" setup>
import { RouterLink } from "vue-router"; 
import { ExternalLink, MoveRight } from "lucide-vue-next";
import { ItemLinkProps } from "@/types";
import { cn } from "@/lib/utils";
import CopyButton from "./CopyButton.vue";

const props = withDefaults(defineProps<ItemLinkProps>(), {
    target: '_blank',
    rel: 'noopener noreferrer',
    _components: () => {
        return {
            copyButton: CopyButton,
        }
    }
});

let hideSecondaryLink = props.hideSecondaryLink || false;
// let hideUnderline = props.hideUnderline || false;
let hideTitle = props.hideTitle || false;
let target = props.target;

// scenarios
// 1. to is a URL string, optionally we can have an externalTo string / PrezNode
// 2. to is a PrezNode, value will be the externalTo, if prez:link is present, it will be used as the main URL
// 3. to is a PrezNode, externalTo is a string, externalTo will be used as the external link, prez:link will be used as the main URL (if present)

switch (props.variant) {
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
        // hideUnderline = true;
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

/** determine the url is an external link */
const isExtLink = url ? url.startsWith('http') || url.startsWith('mailto') : false;

/** check the external link is really an external link */
const isSecondaryExtLink = secondaryUrl ? secondaryUrl.startsWith('http') || secondaryUrl.startsWith('mailto') : false;

// If we have a nuxt environment, use the nuxt link
// const navigateToLink = (event: Event, path: string) => {
//     if (path.startsWith('/')) {
//         event.preventDefault();
//         try {
//             const router = useRouter();
//             router.push(path);
//         } catch (ex) {
//             console.error(ex);
//         }
//     }
// };
</script>

<template>
    <!-- ItemLink -->
    <slot name="wrapper" :url="url" :title="props.title" :secondaryUrl="secondaryUrl" :target="target">
        <span class="inline-flex gap-1 items-center">
            <template v-if="url && !props.hidePrimaryLink">
                <a v-if="isExtLink"
                    :class="cn('item-link', props.class)"
                    :href="url" :title="hideTitle ? undefined : props.title" 
                    :target="props.target" :rel="props.rel"
                >
                    <slot />
                </a>
                <RouterLink v-else
                    :class="cn('item-link', props.class)"
                    :to="url" :title="hideTitle ? undefined : props.title" 
                >
                    <slot />
                </RouterLink>
            </template>
            <span v-else :class="cn('item-link', props.class)">
                <slot />
            </span>
            <template v-if="secondaryUrl && !hideSecondaryLink">
                <a v-if="isSecondaryExtLink"
                    :href="secondaryUrl" :title="hideTitle ? undefined : props.title"
                    :target="props.target" :rel="props.rel"
                    :class="cn('item-link', props.class)"
                >
                    <ExternalLink class="w-4 h-4" />
                </a>
                <RouterLink v-else 
                    :to="secondaryUrl" :title="hideTitle ? undefined : props.title"
                    :class="cn('item-link', props.class)"
                >
                    <!-- unlikely scenario, but we if our secondary link points internal show an arrow not window out -->
                    <MoveRight class="w-4 h-4" />
                </RouterLink>
            </template>
            
            <component
	            :is="props._components.copyButton"
	            v-if="props.copyLink"
	            icon-only
	            :value="typeof(copyLink) == 'string' ? copyLink : url || secondaryUrl"
	            size="icon"
	            variant="outline"
            />
        </span>
    </slot>
</template>
