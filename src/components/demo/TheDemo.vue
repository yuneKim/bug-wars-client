<script setup lang="ts">
import Divider from 'primevue/divider';
</script>

<template>
  <div class="demo-container">
    <div class="card-wrapper">
      <div class="card">
        <h1>DEMO VIDEO</h1>
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
            Our server was created in Java, using Lombok to help keep our code concise and precise.
            We incorporated JPA to achieve object relational mapping to our PostgreSQL database. Our
            plugins are provided through Apache Maven and our dependencies through Spring Boot, and
            our communication with the front end is consistent with REST API standards. Our security
            features are incorporated using Spring Security. Additionally, we have maintained 80%+
            code coverage in every stage of the project through the use of JUnit and Mockito.
          </p>
        </div>
        <Divider />
        <h3>CLIENT-SIDE TECHNOLOGIES AND TOOLS</h3>
        <div class="content">
          <p>
            Our client is built in a Node.js environment, featuring TypeScript. We have utilized the
            Vue.js composition API to create a single-page application, incorporating Pinia to
            handle state management. We use Axios to communicate with our server. We have also
            consistently maintained 80%+ code coverage using Vite’s Vitest in our client.
          </p>
        </div>
        <Divider />
        <h3>DEVELOPMENT OPERATIONS</h3>
        <div class="content">
          <p>
            To ensure that our application will run regardless of the particular environment our
            developers are using, Bug Wars is containerized using Docker. Bug Wars was created in a
            CI/CD pipeline. CI/CD stands for continuous integration & continuous development. This
            means exactly what it sounds like! We work in small subsections of code called stories,
            that are broken in even smaller parts called tasks. Once a developer or team of
            developers completes a story in their local branch, they then make a pull request. Their
            pull request is both checked by another member of our team and also triggers automatic
            builds to check that test coverage is complete and the new code is compatible with the
            existing codebase. After those steps, it’s moved to delivery and deployed to production.
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
  margin-block: 0 30px;
  text-align: center;
}

.card h3 {
  font-size: 1.5rem;
  margin-block: 70px -30px;
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
