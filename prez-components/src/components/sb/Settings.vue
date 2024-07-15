<script lang="ts" setup>
import { getDebug, getStyle, getTheme, setDebug, setStyle, setTheme, styles, themes } from '../../settingsManager';
import { ref } from 'vue';

const currentTheme = ref(getTheme());
const currentStyle = ref(getStyle());
const debug = ref(getDebug());

// Function to change the theme
const changeTheme = () => {
  setTheme(currentTheme.value);
};

// Function to change the style
const changeStyle = () => {
  setStyle(currentStyle.value);
};

// Function to toggle debug mode
const toggleDebug = () => {
  setDebug(debug.value);
};

// Watchers to apply changes immediately
//watch(currentTheme, changeTheme);
//watch(debug, toggleDebug);

// Initial application of settings
//changeTheme();
//toggleDebug();

</script>

<template>
    <div class="config-settings">
      <h2>System settings</h2>
      <fieldset>
        <legend>Change settings</legend>
        <p>
        <label>
            Theme: 
            <select v-model="currentTheme" @change="changeTheme">
                <option v-for="(label, theme) in themes" :key="theme" :value="theme">{{ label }}</option>
            </select>
        </label>
        </p>
        <p>
        <label>
            Style: 
            <select v-model="currentStyle" @change="changeStyle">
                <option v-for="(label, style) in styles[currentTheme]" :key="style" :value="style">{{ label }}</option>
            </select>
        </label>
        </p>
        <p>
            <label>
                Debug: &nbsp;
                <input type="checkbox" v-model="debug" @change="toggleDebug" />
            </label>
        </p>
      </fieldset>
  
      <div class="debug-option">
      </div>
    </div>
  </template>
    
  <style scoped>
  .config-settings {
    padding: 10px;
    font-size:x-large;
  }
  
  .config-settings h3 {
    margin-bottom: 10px;
  }
  
  .config-settings select {
    margin-bottom: 10px;
    font-size:x-large;
  }

  .config-settings input {
    transform: scale(2);
  }
  
  .debug-option {
    margin-top: 10px;
  }
  </style>