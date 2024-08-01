<script lang="ts" setup>
import { PrezUILoading, PrezUIStaticPage } from 'prez-components';
</script>
<template>
  <div class="about">


    <div style="background-color: white;">
      <fieldset>
        <legend>PrezUILoading component here...</legend>
        <PrezUILoading></PrezUILoading>
      </fieldset>
  </div>

    <PrezUIStaticPage>
      Hello
    </PrezUIStaticPage>


  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
fieldset {
  padding:1rem;
  margin:1rem;
  color: black;
}
</style>
