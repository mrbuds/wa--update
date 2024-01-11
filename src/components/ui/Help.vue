<template>
  <div id="help">
    <div class="title text-xl">
      {{ $t("app.help.title" /* Setup Steps */) }}
    </div>
    <ol class="follow">
      <li>
        {{
          $t(
            "app.help.s1" /* Configure WeakAuras Companion, you will need to at least set your World of Warcraft folder and account. */,
          )
        }}
      </li>
      <li>
        {{
          $t(
            "app.help.s2" /* Click on 'Fetch Updates', this is also done automatically once every hour. */,
          )
        }}
        <ol class="follow">
          <li>
            {{
              $t(
                "app.help.s2_1" /* Companion creates a list of your auras that contain a link to Wago. */,
              )
            }}
          </li>
          <li>
            {{ $t("app.help.s2_2" /* Companion sends the list to Wago. */) }}
          </li>
          <li>
            {{
              $t(
                "app.help.s2_3" /* Wago sends updated import strings and Companion compares the versions. */,
              )
            }}
          </li>
          <li>
            {{
              $t(
                "app.help.s2_4" /* Companion creates a new "WeakAurasCompanion" addon automatically, this is where new import strings are saved. */,
              )
            }}
          </li>
          <li>
            {{ $t("app.help.s2_5" /* Reload your UI. */) }}
          </li>
        </ol>
      </li>
      <li>
        {{
          $t(
            "app.help.s3" /* The first time you start WeakAuras Companion, you will have to reload your UI for it to be able to load the addon. */,
          )
        }}
      </li>
      <li class="reset">
        {{
          $t(
            "app.help.s4_1" /* Update your auras in-game by clicking the update button next to them in the WeakAuras options. */,
          )
        }}
        <br />
        <img
          src="../../assets/ingame.png"
          class="center"
        />
        <br />
      </li>
      <li>
        {{
          $t(
            "app.help.s5" /* You can always skip a version or just ignore updates completely. */,
          )
        }}
        <br />
        <img
          src="../../assets/ingame2.png"
          class="center"
        />
      </li>
    </ol>
    <br />
    <br />
    <div class="title text-xl">
      {{ $t("app.help.auraAuthorsTitle" /* Tips for Authors */) }}
    </div>
    <div class="paragraph">
      {{
        $t(
          "app.help.auraAuthorsText1" /* If you publish auras on Wago, we recommend these settings: */,
        )
      }}
      <ul>
        <li>
          {{
            $t(
              "app.help.auraAuthorsText2" /* In the Companion app, add your Wago username in the "Wago Account" setting. */,
            )
          }}
        </li>
        <li>
          {{
            $t(
              "app.help.auraAuthorsText3" /* In WeakAuras, select the "Ignore all Updates" option for any aura you've modified heavily. */,
            )
          }}
        </li>
      </ul>
      <br />
      <br />
    </div>
    <div class="title text-xl">
      {{ $t("app.help.foundbug" /* Found a bug? */) }}
    </div>
    <div class="paragraph">
      {{
        $t(
          "app.help.bug" /* If you encounter a bug, please create a ticket on */,
        )
      }}
      <a
        target="_blank"
        href="https://github.com/WeakAuras/WeakAuras-Companion/issues/new?template=bug_report.md"
      >
        GitHub
      </a>
      {{ $t("app.help.bugend" /* containing: */) }}
      <br />
      <ul>
        <li>
          {{ $t("app.help.bug.s1" /* A description of your problem. */) }}
        </li>
        <li>{{ $t("app.help.bug.s2" /* The steps to reproduce it. */) }}</li>
        <li>
          {{
            $t(
              "app.help.bug.s3" /* A screenshot, if it helps to understand your issue. */,
            )
          }}
        </li>
        <li>
          {{
            $t(
              "app.help.bug.s4" /* Error logs, type Ctrl+Shift+I to access the console and copy any error that might show up. */,
            )
          }}
        </li>
      </ul>
    </div>
    <br />
    <br />
    <div class="title text-xl">
      {{ $t("app.help.support.title" /* Support */) }}
    </div>
    <div class="paragraph">
      {{
        $t(
          "app.help.support.text1" /* If you need more help come talk with us on WeakAuras's */,
        )
      }}
      <a
        href="https://discord.gg/weakauras"
        target="_blank"
        >Discord</a
      >
      {{
        $t("app.help.support.text2" /* in the #companion-support channel. */)
      }}
    </div>
    <br />
    <br />
  </div>
</template>

<style scoped lang="css">
#help {
  padding: 10px 2.35vw;
  text-align: left;
  height: 100%;
  position: relative;
  overflow: auto;
  font-weight: 500;
}

#help > ol {
  margin-left: 15px;
  padding-left: 0;
}

ol,
ul {
  font-size: 15px;
  margin-left: 30px;
}

.follow {
  counter-reset: item;
}

.follow > li {
  display: block;
  margin-top: 5px;
}

.follow > li:before {
  content: counters(item, ".") ". ";
  counter-increment: item;
}

li > img {
  transform: translate(0, 8px);
}

.center {
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  margin: 20px 0 0;
  max-width: 100%;
}

#help a {
  color: rgb(255, 209, 0);
  font-weight: 700;
}

#help a:hover {
  color: rgb(255, 228, 106);
}

.reset {
  margin-top: 0px !important;
}

.paragraph {
  margin-left: 15px;
}
</style>
