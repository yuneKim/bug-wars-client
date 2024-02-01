<script setup lang="ts">
import Divider from 'primevue/divider';
</script>

<template>
  <div class="demo-container">
    <div class="card-wrapper">
      <div class="card">
        <h1 class="demo-title">DEMO VIDEO</h1>
        <div class="iframe-container">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/EhgqMXemH5M?si=REFb_PV0OcAahV_K"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
      </div>
      <div class="card">
        <h2>OUR PROCESS</h2>
        <div class="content"></div>
        <h3>SERVER-SIDE TECHNOLOGIES AND TOOLS</h3>
        <div class="content">
          <p>
            Our REST server was created with Java Spring Boot using Apache Maven as our build tool.
            We use Spring Data JPA to connect to a PostgreSQL database. Spring Security ensures only
            authorized users can access protected information. Additionally, we have maintained 80%+
            code coverage in every stage of the project through the use of JUnit and Mockito.
          </p>
        </div>
        <Divider />
        <h3>CLIENT-SIDE TECHNOLOGIES AND TOOLS</h3>
        <div class="content">
          <p>
            Our client is built with Vue.js and TypeScript. We use Pinia for global state and Axios
            to make server requests. We have also consistently maintained 80%+ code coverage using
            Vitest.
          </p>
        </div>
        <Divider />
        <h3>DEVELOPMENT OPERATIONS</h3>
        <div class="content">
          <p>
            We've set up a continuous integration/continuous delivery (CI/CD) pipeline using GitHub
            Actions. Whenever a pull request is made, our pipeline ensures that the project builds
            and has sufficient test coverage. Once the pull request is approved and merged, the
            project is automatically deployed. The front end deploys to GitHub Pages, and the back
            end is containerized using Docker and deploys to Render.
          </p>
        </div>
        <Divider />
        <h3>SOFTWARE DEVELOPMENT LIFE CYCLE</h3>
        <div class="content">
          <p>
            In order to build Bug Wars, our team is taking an iterative approach by using the Agile
            framework. Our stories are written in two-week sprints, delivering a demo and receiving
            a review at the end of a sprint cycle. Directly after that, we have a retrospective to
            reflect on both what went well and what could be improved, and we plan out our next
            sprint. This Agile methodology allows us to be adaptable and adjust our plans as needed
            throughout the project.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-block: 50px;
}

.card-wrapper {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding-inline: 10px;
}

.demo-title {
  padding-bottom: 30px;
}

.card {
  background-color: rgba(18, 18, 18, 0.85);
  padding: 50px;
  color: #fff;
  border: 1px solid white;
}

.card h1 {
  margin-block: 0;
  text-align: center;
}

.card h2 {
  font-size: 2rem;
  margin-block: 0;
  text-align: center;
}

.card h3 {
  font-size: 1.5rem;
  margin-block: 20px -30px;
  text-align: center;
}

.card p {
  font-size: 1.2rem;
  line-height: 1.7rem;
}

.content {
  margin-top: 50px;
  display: flex;
  gap: 30px;
  align-items: center;
}

@media screen and (max-width: 600px) {
  .content {
    flex-direction: column-reverse;
  }

  .content p {
    margin-block: 0;
  }
}

.content > p {
  flex: 5;
}

.p-divider {
  margin-block: 50px;
}

.p-divider::before {
  border-color: red;
}

.iframe-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
}
.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
