<template>
  <div class="shortcut">
    <div class="form-parent">
      <h1 id="plugin-title">{{title}}</h1>
      <form v-on:submit="submit">
        <input id="query" uxp-quiet="true" v-model="message" placeholder="Search XD Shortcuts" style="width: 100%;"/>
        <div class="button-flex">
          <div style="width:100px;" v-if="this.message.length >= 0 ? true : false">
            <button v-on:click="showAll" uxp-primary="cta">Show All</button>
          </div>
          <div style="width:100px;">
            <button v-on:click="submit" uxp-variant="cta">Search</button>
          </div>
        </div>
      </form>
    </div>
    <div v-html="noResults"></div>
    <div v-if="this.userType">
      <div class="copy-element">
        <div v-for="item in items" :key="item.id">
          <div class="copy-element__item">
            <h4 class="shortcut-name">{{item.name}}</h4>
            <p class="shortcut-command">{{item.macshortcut}}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="copy-element">
        <div v-for="item in items" :key="item.id">
          <div class="copy-element__item">
            <h4 class="shortcut-name">{{item.name}}</h4>
            <p class="shortcut-command">{{item.pcshortcut}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let url =
  "https://raw.githubusercontent.com/atokad5/keyboard-shortcut-list/master/endpoint.json";

// Fetch local shortcuts
let shortcuts = require("./shortcuts.js");

// Check Operating System
const os = require("os");
let userOs = os.platform();
let isMacUser = userOs === "darwin"; // true || false (depends on user)

// Search Filter lib
let Fuse = require("fuse.js");

module.exports = {
  data() {
    return {
      connectionType: true,
      userType: isMacUser,
      message: "",
      title: "Keyboard Shortcuts",
      items: shortcuts, //  array of local data
      noResults: ""
    };
  },
  methods: {
    showAll: function() {
      this.message = "";
      this.noResults = "";
      this.items = shortcuts;
    },
    submit: function(event) {
      let fuse = new Fuse(shortcuts, {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 10,
        maxPatternLength: 32,
        minMatchCharLength: 0,
        keys: ["name", "tags"]
      });
      this.items = fuse.search(this.message);
      if (this.items.length >= 1) {
        this.noResults = "";
      } else {
        if(this.message.length >= 1) {
          this.noResults = `No results for <span id="result-error">${this.message}</span>.`; 
        } else {
          this.noResults = `Please enter a search in the form field.`; 
        }
      }
    }
  }
};
</script>


