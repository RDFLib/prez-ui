<script lang="ts" setup>
import CopyButton from "../components/CopyButton.vue";
import Node from "../components/Node.vue";
import ItemLink from "../components/ItemLink.vue";
import Loading from "../components/Loading.vue";
import Message from "../components/Message.vue";
import Literal from "../components/Literal.vue";
import { literal, node } from "prez-lib";

const term = node({
    value: "https://example.com",
    label: literal("node"),
    links: [
        {
            value: "/"
        }
    ],
});
</script>

<template>
    <div class="p-3 flex flex-col gap-1">
        <h1 class="text-3xl mb-4">Prez UI Component Library</h1>

        <h2 class="text-2xl mb-3">Colours</h2>
        <p class="mb-2">The available Tailwind variables to override and use in classes. Note that "link" and "foreground" illustrate the colour of the text, not the background.</p>
        <div class="grid grid-cols-4 gap-3">
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-primary text-primary-foreground p-2">primary</div>
                    <div class="dark bg-primary text-primary-foreground p-2">primary dark</div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    The first accent colour for your colour palette. Available as the default button colour.
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-secondary text-secondary-foreground p-2">secondary</div>
                    <div class="dark bg-secondary text-secondary-foreground p-2">secondary dark</div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    The second accent colour for your colour palette. Available as a button colour.
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-tertiary text-tertiary-foreground p-2">tertiary</div>
                    <div class="dark bg-tertiary text-tertiary-foreground p-2">tertiary dark</div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    The third accent colour for your colour palette.
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-background text-link p-2">link</div>
                    <div class="dark bg-background text-link p-2">link dark</div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    For links in page content
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-accent text-accent-foreground p-2">accent</div>
                    <div class="dark bg-accent text-accent-foreground p-2">accent dark</div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    Used as the background colour in dropdowns and the "ghost" & "outline" variants of buttons. (Not to be confused with an "accent colour")
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-muted text-muted-foreground p-2">muted</div>
                    <div class="dark bg-muted text-muted-foreground p-2">muted dark</div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    For subtitles or captions where you want less emphasis on the text. Also for softer backgrounds.
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-destructive text-destructive-foreground p-2">destructive</div>
                    <div class="dark bg-destructive text-destructive-foreground p-2">destructive dark</div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    For highlighting destructive actions or danger alerts. Available as a button colour.
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-card text-card-foreground p-2">card</div>
                    <div class="dark bg-card text-card-foreground p-2">card dark</div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    The background of cards - not used in Prez
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-popover text-popover-foreground p-2">popover</div>
                    <div class="dark bg-popover text-popover-foreground p-2">popover dark</div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    The background of popovers - not used in Prez
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-background text-foreground p-2">foreground</div>
                    <div class="dark bg-background text-foreground p-2">foreground dark</div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    The colour of all general text
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-background text-foreground p-2">background</div>
                    <div class="dark bg-background text-foreground p-2">background dark</div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    The background colour of the website
                </div>
            </div>

            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-background p-2">
                        <div class="border border-border rounded-md text-foreground p-2">border</div>
                    </div>
                    <div class="dark bg-background p-2">
                        <div class="border border-border rounded-md text-foreground p-2">border dark</div>
                    </div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    The colour of borders, excluding input fields
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-background p-2">
                        <div class="border rounded-md border-input text-foreground p-2">input</div>
                    </div>
                    <div class="dark bg-background p-2">
                        <div class="border rounded-md border-input text-foreground p-2">input dark</div>
                    </div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    The border colour of input fields
                </div>
            </div>
            <div class="flex flex-col">
                <div class="grid grid-cols-2">
                    <div class="bg-background p-2">
                        <div class="ring-2 ring-offset-2 ring-ring ring-offset-background border rounded-md border-input text-foreground p-2">ring</div>
                    </div>
                    <div class="dark bg-background p-2">
                        <div class="ring-2 ring-offset-2 ring-ring ring-offset-background border rounded-md border-input text-foreground p-2">ring dark</div>
                    </div>
                </div>
                <div class="text-muted-foreground text-sm italic">
                    The outline colour of focused input fields. Defaults to the primary colour
                </div>
            </div>
        </div>
        
        <h2 class="text-2xl mb-3">Components</h2>
        <CopyButton value="copybuttonvalue" class="self-start" />
        <ItemLink to="/" copyLink>item link</ItemLink>
        <div>
            Loading concept
            <Loading variant="concept" />
        </div>
        <Message text="Error text" severity="error" />

        <h2 class="text-2xl mb-3">RDF Components</h2>
        <Node :term="term" />
        <Literal :term="literal('literal')" textOnly renderHtml renderMarkdown />
    </div>
</template>

