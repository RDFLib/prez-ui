<template>
  <main>
    <h1>01-DataProvider examples</h1>
    <h2>Lists</h2>
    <ol>
      <li><NuxtLink to="/prez-list">Vanilla PrezList</NuxtLink></li>
      <li><NuxtLink to="/prez-list2">Modified PrezList</NuxtLink></li>
      <li><NuxtLink to="/custom-list">Custom list</NuxtLink></li>
    </ol>
    <h2>Object</h2>
    <ol>
      <li><NuxtLink to="/prez-object">Vanilla PrezObject</NuxtLink></li>
      <li><NuxtLink to="/custom-item">Custom item</NuxtLink></li>
      <li><NuxtLink to="/custom-item2">Custom item2</NuxtLink></li>
    </ol>
  </main>
</template>


<style scoped>
ol {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin: 1em 0;
  counter-reset: list-counter;
}
ol li {
  margin: 0.5em 0;
  padding: 0.5em;
  background-color: #f9f9f9;
  border-radius: 5px;
  position: relative;
}
ol li::before {
  position: absolute;
  left: -1.5em;
  font-weight: bold;
  color: #007bff;
}
ol ol {
  list-style-type: lower-alpha;
  margin: 0.5em 0;
}
ol ol li {
  background-color: #e9ecef;
  padding-left: 1.2em;
}
a { 
  text-decoration: none;
  color:black;
}
</style>