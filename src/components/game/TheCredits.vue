<script setup lang="ts">
import Button from 'primevue/button';
</script>

<template>
  <div class="credits-container">
    <div class="logo-container">
      <img
        class="crusader-games-logo"
        src="@/assets/base/crusader-games-logo.png"
        alt="crusader-games-logo"
      />
      <img
        class="team-doomity-logo"
        src="@/assets/base/team-doomity-logo.png"
        alt="team-doomity-logo"
      />
    </div>

    <div class="card-container">
      <div class="card">
        <img class="portrait" src="@/assets/portraits/yune.jpg" alt="Yune Kim's profile picture" />
        <h3>Yune Kim - Tech Lead</h3>
        <a href="https://www.linkedin.com/in/yunekimdev/" target="_blank"
          ><Button icon="pi pi-linkedin" label="LinkedIn"
        /></a>
        <a href="https://github.com/yuneKim" target="_blank"
          ><Button icon="pi pi-github" label="GitHub"
        /></a>
        <a href="bug-wars-client/resumes/Yune_Kim_Resume.pdf" download
          ><Button icon="pi pi-paperclip" label="Resume"
        /></a>
      </div>

      <div class="card">
        <img
          class="portrait"
          src="@/assets/portraits/christopher.jpg"
          alt="Christopher Bandurski's profile picture"
        />
        <h3>Christopher Bandurski</h3>
        <a href="https://www.linkedin.com/in/christopherbandurski/" target="_blank"
          ><Button icon="pi pi-linkedin" label="LinkedIn"
        /></a>
        <a href="https://github.com/Ferrington" target="_blank"
          ><Button icon="pi pi-github" label="GitHub"
        /></a>

        <a href="bug-wars-client/resumes/Christopher_Bandurski_Resume.pdf" download>
          <Button icon="pi pi-paperclip" label="Resume"></Button>
        </a>
      </div>

      <div class="card">
        <img
          class="portrait"
          src="@/assets/portraits/keaton.jpg"
          alt="Keaton Kido's profile picture"
        />
        <h3>Keaton Kido</h3>
        <a href="https://www.linkedin.com/in/keatonkido/" target="_blank"
          ><Button icon="pi pi-linkedin" label="LinkedIn"
        /></a>
        <a href="https://github.com/kido8013" target="_blank"
          ><Button icon="pi pi-github" label="GitHub"
        /></a>
        <a href="bug-wars-client/resumes/Keaton_Kido_Resume.pdf" download>
          <Button icon="pi pi-paperclip" label="Resume"></Button>
        </a>
      </div>

      <div class="card">
        <img
          class="portrait"
          src="@/assets/portraits/chris.jpg"
          alt="Chris Ratsabout's profile picture"
        />
        <h3>Chris Ratsabout</h3>
        <a href="https://www.linkedin.com/in/christopherratsabout/" target="_blank"
          ><Button icon="pi pi-linkedin" label="LinkedIn"
        /></a>
        <a href="https://github.com/chrisratsabout" target="_blank"
          ><Button icon="pi pi-github" label="GitHub"
        /></a>
        <!-- need resume -->
      </div>

      <div class="card">
        <img
          class="portrait"
          src="@/assets/portraits/alissa.jpg"
          alt="Alissa Reynolds's profile picture"
        />
        <h3>Alissa Reynolds</h3>
        <a href="https://www.linkedin.com/in/alissa-reynolds-957810291/" target="_blank"
          ><Button icon="pi pi-linkedin" label="LinkedIn"
        /></a>
        <a href="https://github.com/alissareynolds" target="_blank"
          ><Button icon="pi pi-github" label="GitHub"
        /></a>
        <a href="bug-wars-client/resumes/Alissa_Reynolds_Resume.pdf" download>
          <Button icon="pi pi-paperclip" label="Resume"></Button>
        </a>
      </div>

      <div class="card">
        <img
          class="portrait"
          src="@/assets/portraits/kirk.jpg"
          alt="Kirk Reynolds's profile picture"
        />
        <h3>Kirk Reynolds</h3>
        <a href="https://www.linkedin.com/in/kirk-reynolds-78baa9a1/" target="_blank"
          ><Button icon="pi pi-linkedin" label="LinkedIn"
        /></a>
        <a href="https://github.com/km6805" target="_blank"
          ><Button icon="pi pi-github" label="GitHub"
        /></a>
        <!-- need resume -->
        <a href="bug-wars-client/resumes/Kirk_Reynolds_Resume.pdf" download>
          <Button icon="pi pi-paperclip" label="Resume"></Button>
        </a>
      </div>

      <div class="card">
        <img
          class="portrait"
          src="@/assets/portraits/clint.jpg"
          alt="Clint Simmons's profile picture"
        />
        <h3>Clint Simmons</h3>
        <a href="https://www.linkedin.com/in/clintasimmons/" target="_blank"
          ><Button icon="pi pi-linkedin" label="LinkedIn"
        /></a>
        <a href="https://github.com/simmca" target="_blank"
          ><Button icon="pi pi-github" label="GitHub"
        /></a>
        <a href="bug-wars-client/resumes/Clint_Simmons_Resume.pdf" download>
          <Button icon="pi pi-paperclip" label="Resume"></Button>
        </a>
      </div>

      <div class="card">
        <img
          class="portrait"
          src="@/assets/portraits/sam.jpg"
          alt="Samantha Stinchcomb's profile picture"
        />
        <h3>Samantha Stinchcomb</h3>
        <a href="https://www.linkedin.com/in/samantha-stinchcomb/" target="_blank"
          ><Button icon="pi pi-linkedin" label="LinkedIn"
        /></a>
        <a href="https://github.com/ThePudgyPigeon" target="_blank"
          ><Button icon="pi pi-github" label="GitHub"
        /></a>
        <a href="bug-wars-client/resumes/Samantha_Stinchcomb_Resume.pdf" download
          ><Button icon="pi pi-paperclip" label="Resume"
        /></a>
      </div>

      <div class="card">
        <img
          class="portrait"
          src="@/assets/portraits/stephanie.jpg"
          alt="Stephanie Strano's profile picture"
        />
        <h3>Stephanie Strano</h3>
        <a href="https://www.linkedin.com/in/stephanie-strano/" target="_blank"
          ><Button icon="pi pi-linkedin" label="LinkedIn"
        /></a>
        <a href="https://github.com/stephnicoledev" target="_blank"
          ><Button icon="pi pi-github" label="GitHub"
        /></a>
        <a href="bug-wars-client/resumes/Stephanie_Strano_Resume.pdf" download
          ><Button icon="pi pi-paperclip" label="Resume"
        /></a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.credits-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-container {
  margin-top: 50px;
  display: flex;
  align-items: center;
}

.crusader-games-logo {
  width: 200px;
}

.team-doomity-logo {
  width: 500px;
}

.card-container {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  margin: 50px 0;
}

.card {
  display: flex;
  flex-direction: column;
  color: #fff;
  text-transform: uppercase;
  border: 0.5px solid white;
  background-color: rgba(18, 18, 18, 0.85);
  border-radius: 2px;
  padding: 20px;
  gap: 12px;
  align-items: center;
}

.card h3 {
  margin: 0;
}

.portrait {
  width: 250px;
  border-radius: 2px;
}

Button {
  width: 142px;
  height: 31px;
  border-color: rgb(117, 117, 117);
}
@media screen and (max-width: 600px) {
  .logo-container {
    flex-direction: column;
    max-width: 100%;
  }

  .logo-container img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
  }
}
</style>
