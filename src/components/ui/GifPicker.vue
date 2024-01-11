<script lang="ts">
import { defineComponent, ref } from "vue";
import { useConfigStore } from "../../stores/config";

export default defineComponent({
  directives: {
    scroll: {
      created: (el, binding) => {
        const f = function () {
          if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
            binding.value();
          }
        };
        el.addEventListener("scroll", f);
      },
    },
  },
  props: {
    apiKey: {
      type: String,
      required: true,
    },
  },
  emits: ["send"],
  setup() {
    const config = useConfigStore();
    return {
      locale: ref(config.lang),
    };
  },
  data() {
    return {
      search: "",
      results: [],
      tags: [],
      next: null,
    };
  },
  watch: {
    search: "onSearch",
  },
  mounted() {
    fetch(
      `https://g.tenor.com/v1/categories?key=${this.apiKey}&locale=${this.locale}`,
    )
      .then((res) => res.json())
      .then(({ tags }) => (this.tags = tags));
  },
  methods: {
    loadMore() {
      const pos = this.next || 1;
      this.get(`search?q=${this.search}&limit=32&pos=${pos}`, "results", true);
    },
    onSearch(key) {
      this.get(`search?q=${key}&limit=32`, "results");
    },
    renderSmallGif({ tinygif }) {
      return tinygif.url;
    },
    renderHugeGif({ mediumgif }) {
      return mediumgif.url;
    },
    get(query, key, additive?) {
      fetch(`https://g.tenor.com/v1/${query}&key=${this.apiKey}`)
        .then((res) => res.json())
        .then((data) => {
          if (additive) {
            data[key].forEach((element) => {
              this[key].push(element);
            });
          } else {
            this[key] = data[key];
          }
          this.next = data.next;
        });
    },
    send(result) {
      const gif = result.media[0];
      const title = result.content_description;
      const id = result.id;

      fetch(
        `https://g.tenor.com/v1/registershare?key=${this.apiKey}&locale=${this.locale}&id=${id}`,
      );

      this.$emit("send", {
        url: this.renderHugeGif(gif),
        send: true,
        type: "gif",
        title,
        tenorID: id,
      });
      this.search = null;
    },
  },
});
</script>

<template>
  <div class="gifpicker">
    <header>
      <div>
        <span
          :class="{ invisible: search === '' }"
          class="i-mdi-arrow-back mr-[0.25em] cursor-pointer text-2xl color-white"
          @click="search = ''"
          >arrow_back</span
        >
        <div>
          <input
            v-model="search"
            :placeholder="$t('gifpicker.searchtenor' /* Search Tenor */)"
          />
          <span class="i-mdi-search text-2xl color-white">search</span>
        </div>
      </div>
    </header>
    <div class="gifpicker_container">
      <div>
        <div>
          <div
            v-if="search !== '' && results && results.length"
            v-scroll="loadMore"
            class="grid"
          >
            <div
              v-for="(result, r) in results"
              :key="r"
              class="grid_images"
              :style="`background-image: url(${result.media[0].tinygif.url})`"
              @click="send(result)"
            />
          </div>
          <div
            v-else-if="tags && tags.length"
            class="grid"
          >
            <div
              v-for="(tag, t) in tags"
              :key="t"
              class="grid_images"
              :style="`background-image: url(${tag.image})`"
              @click="search = tag.searchterm"
            >
              <div class="searchterm" />
              {{ tag.searchterm }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.gifpicker {
  height: calc(100% - 9px);
}

header {
  position: relative;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-top: 0.5rem;
  padding-bottom: 1.25rem;
  background-color: var(--gif-picker-light-bg);
  width: 100%;
  height: 60px;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  -webkit-app-region: no-drag;
}

header div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

header div div {
  display: flex;
  overflow: hidden;
  padding-right: 0.5rem;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-radius: 0.375rem;
  background-color: var(--gif-picker-dark-bg);
}

header div div input {
  all: unset;
  text-align: left;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  color: white;
  background-color: var(--gif-picker-dark-bg);
  font-size: 0.875rem;
  line-height: 1.25rem;
  width: 100%;
  outline: 2px solid transparent;
  outline-offset: 2px;
  user-select: all;
  pointer-events: all;
}

span.invisible {
  all: unset;
  opacity: 0;
}

.gifpicker_container {
  display: flex;
  height: calc(100% - 50px);
}

.gifpicker_container div {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: var(--gif-picker-dark-bg);
}

.gifpicker_container div div {
  overflow: auto;
  position: relative;
  padding: 1rem;
  width: 100%;
  height: 100%;
}

.gifpicker_container div div .grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  grid-auto-flow: row;
  grid-auto-rows: auto;
}

.gifpicker_container div div .grid .grid_images {
  width: 200px;
  display: flex;
  overflow: hidden;
  position: relative;
  background-size: cover;
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform;
  transition-duration: 300ms;
  color: white;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 7rem;
  border-radius: 0.5rem;
  border-width: 1px;
  border-color: transparent;
}

.gifpicker_container div div .grid .grid_images:hover {
  border-color: var(--gif-picker-border-blue);
  border-style: solid;
}

.gifpicker_container div div .grid .grid_images .searchterm {
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  transition-property: background-color, border-color, color, fill, stroke,
    opacity, box-shadow, transform;
  transition-duration: 300ms;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.gifpicker_container div div .grid .grid_images .searchterm:hover {
  opacity: 70%;
}
</style>
