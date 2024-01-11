<script lang="ts">
import { defineComponent } from "vue";
import medias from "@/libs/contacts";

export default defineComponent({
  name: "About",
  filters: {
    capitalize: (string) => string.charAt(0).toUpperCase() + string.slice(1),
  },
  data() {
    return {
      medias,
      version: __APP_VERSION__,
      license: __APP_LICENSE__,
      tools: "Electron & Vue",
    };
  },
});
</script>

<template>
  <div id="about">
    <div id="main">
      <h2>WeakAuras Companion</h2>
      <br />
      <p>
        {{ $t("app.about.tools" /* Developed with */) }} {{ $data.tools }}<br />
        {{ $t("app.about.version" /* Version: */) }} {{ $data.version }}<br />
        {{ $t("app.about.license" /* License: */) }} {{ $data.license }}<br />
        {{ $t("app.about.source" /* Sources on */) }}
        <a
          href="https://github.com/WeakAuras/WeakAuras-Companion"
          target="_blank"
          >GitHub</a
        ><br />
        {{ $t("app.about.author" /* Author */) }} Matthieu Saint Aubin aka
        Buds<br />
        {{ $t("app.about.platersupport" /* Plater support */) }}
        Cont1nuity/Ariani<br />
        {{ $t("app.about.cssby" /* CSS by */) }}
        <a
          href="https://sragia.com/"
          target="_blank"
          >Aigars Bedeicis aka Exality</a
        >
        and
        <a
          href="https://stephanosue.com/"
          target="_blank"
          >Stephano Sue</a
        >
      </p>
      <br />
    </div>
    <div id="links">
      <div style="flex: 50%">
        <div class="title text-xl">WeakAuras</div>
        <div class="items">
          <div
            v-for="media in medias.weakauras"
            :key="media.name"
            class="media-item"
          >
            <a
              :href="media.url"
              target="_blank"
            >
              <i
                :class="`text-xl align-middle i-fa6-brands-${media.name} i-social-${media.name}`"
                :title="media.name"
              />
              {{ media.displayName }}
            </a>
          </div>
        </div>
      </div>
      <div style="flex: 50%">
        <div class="title text-xl">Wago</div>
        <div class="items">
          <div
            v-for="media in medias.wago"
            :key="media.name"
            class="media-item"
          >
            <a
              :href="media.url"
              target="_blank"
            >
              <i
                :class="`text-xl align-middle i-fa6-brands-${media.name} i-social-${media.name}`"
                :title="media.name"
              />
              {{ media.displayName }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
#about {
  padding: 10px 2.35vw;
  text-align: left;
  height: 100%;
  position: relative;
  font-weight: 500;
}

#links a {
  align-items: center;
  vertical-align: middle;
}

#about img {
  margin-right: 10px;
  vertical-align: middle;
  cursor: pointer;
}

#about > .valign {
  flex: 50%;
  align-items: center;
}

#main {
  font-weight: 100;
  text-align: center;
  width: 100%;
  margin: auto;
}

#links {
  display: flex;
  width: 450px;
  margin: auto;
  border-radius: 8px;
  padding-bottom: 5px;
}

.media-item {
  margin: 10px 15px;
  cursor: pointer;
}

.logo {
  opacity: 1;
  width: 25px;
  top: 0;
}

.title {
  border-left: none;
  border-bottom: 2px solid rgb(255, 209, 0);
  border-radius: 8px 8px 0 0;
  text-align: center;
  background-color: rgba(0, 0, 0, 0);
}

a {
  color: #e6e6e6;
}

a:hover {
  color: rgb(255, 209, 0);
}

.fab {
  margin-right: 5px;
  font-size: 22px;
  color: #e6e6e6 !important;
}

.items {
  margin: 0 30px;
}
</style>
