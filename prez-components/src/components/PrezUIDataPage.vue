<script lang="ts" setup>
import { PrezUIDataPageProps } from '../types';
const props = defineProps<PrezUIDataPageProps>();
</script>
<template>
    <PrezUI v-bind="props" component="PrezUILayouts">
        <PrezUIPageLayout :variant="props.variant">

            <!-- <template #header><PrezUIPageHeader /></template>
            <template #menu><PrezUIPageMenu /></template>
            <template #footer>Footer</template> -->

            <template #body>
                <div class="pz-datapage-body">
                    <PrezUIDataProvider :type="props.type" :url="props.url">
                        <template v-slot="{ profiles, item, list }">
                            <div class="pz-datapage-body-main">
                                <template v-if="type == 'item'">
                                    <PrezUIHeader :term="item" />
                                    <PrezUIItemTable :term="item">
                                        <slot name="custom-widgets"></slot>
                                    </PrezUIItemTable>

                                </template>

                                <template v-else-if="type == 'list'">
                                    <PrezUIItemList :list="list" />
                                </template>
                            </div>
                            <div class="pz-datapage-body-sidepanel">
                                <PrezUIProfiles :profiles="profiles" />
                            </div>
                        </template>
                        <template #loading>
                            <div class="pz-datapage-body-main">
                                <PrezUILoading variant="item" />
                            </div>
                            <div class="pz-datapage-body-sidepanel">
                                <PrezUILoading variant="item" />
                            </div>
                        </template>
                    </PrezUIDataProvider>
                </div>
            </template>

        </PrezUIPageLayout>
    </PrezUI>

</template>
<style lang="scss" scoped>
.pz-datapage-body {
    padding:20px;
    display:flex;
    justify-content: space-between;
}
.pz-datapage-body-sidepanel {
    width: 300px;
}
</style>
