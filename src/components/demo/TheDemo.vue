<script setup lang="ts"></script>

<template>
  <div class="how-to-play-container">
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
        <Divider />
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
        <h3>LABEL</h3>
        <div class="content">
          <p>
            A <strong>LABEL</strong> serves as a target for a <strong>CONTROL STATEMENT</strong>.
            Define a LABEL like:
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.how-to-play-container {
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

.card strong {
  font-size: 1.4rem;
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

  .content img {
    max-width: 250px;
    margin-block: 0;
  }

  .content p {
    margin-block: 0;
  }
}

.content > p {
  flex: 5;
}

.content img {
  flex: 3;
  min-width: 0;
}

.battleground-content > p {
  flex: 1;
}

.battleground-content img {
  flex: 1;
}

.content .code {
  background: #282828;
  white-space: pre-wrap;
  font-family: var(--editor-font-family);
  font-size: 1rem;
  line-height: var(--editor-line-height);
  padding: 10px;
}

.table {
  margin-top: 30px;
}

.table table {
  border-collapse: collapse;
}

.table th,
td {
  font-size: 1.2rem;
  line-height: 1.7rem;
  padding: 6px;
}

.table th:first-child,
td:first-child {
  border-right: 1px solid #535353;
}

.table th {
  text-align: left;
  font-size: 1.5rem;
  font-weight: 500;
  border-bottom: 1px solid #535353;
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
