<script lang="ts" setup>
import type { PrezUIDataPageProps } from '../types';
import PrezUIBreadcrumb from './PrezUIBreadcrumb.vue';
import PrezUIDataConceptScheme from './PrezUIDataConceptScheme.vue';
import PrezUIDataProvider from './PrezUIDataProvider.vue';
import PrezUIHeader from './PrezUIHeader.vue';
import PrezUIItemTable from './PrezUIItemTable.vue';
import PrezUIPageLayout from './PrezUIPageLayout.vue';
const props = defineProps<PrezUIDataPageProps>();
</script>
<template>
    <PrezUIPageLayout :variant="props.variant">

        <!-- <template #header><PrezUIPageHeader /></template>
        <template #menu><PrezUIPageMenu /></template>
        <template #footer>Footer</template> -->

        <template #body>
            <div class="pz-datapage-body">
                <PrezUIDataProvider :type="props.type" :url="props.url">
                    <template #default="{ profiles, item, list, parents }">
                        <div class="pz-datapage-body-main">

                            <!-- main item page -->
                            <template v-if="type == 'item'">
                                <PrezUIBreadcrumb :parents="parents" />
                                <PrezUIHeader :term="item" />
                                <PrezUIItemTable :term="item">
                                    <template #bottom>
                                        <PrezUIDataConceptScheme :item="item" :url="props.url" variant="table"/>
                                    </template>
                                </PrezUIItemTable>
                            </template>

                            <template v-else-if="type == 'list'">
                                <PrezUIBreadcrumb :parents="parents" />
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
