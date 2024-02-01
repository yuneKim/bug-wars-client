<script setup lang="ts">
import Divider from 'primevue/divider';

const sampleScript = `:START
    ifEnemy ATTACK # a comment
    ifWall TURN_RIGHT
    mov
    goto START

:ATTACK
    att
    goto EAT

:EAT
    eat
    goto START

:TURN_RIGHT
    rotr
    goto START
`;

const sampleActions = `att
mov
`;

const sampleControls = `ifEnemy SOME_LABEL
goto ANOTHER_LABEL
`;

const sampleLabel1 = `:MY_LABEL`;
const sampleLabel2 = `:MY_LABEL
    att
    mov
    goto MY_LABEL
`;

const sampleComment = `# comments will not be executed
:START
  att # a comment
  mov
  goto START`;
</script>

<template>
  <div class="how-to-play-container">
    <div class="card-wrapper">
      <div class="card">
        <h1>HOW TO PLAY</h1>
      </div>
      <div class="card">
        <h2>OVERVIEW</h2>
        <div class="content">
          <p>
            <strong>BUG WARS</strong> allows you to create your own bug army and lead it to victory
            over enemy swarms. Write a script in an assembly-like language to give your bugs their
            own unique behavior. Explore, fight, and eat your way to swarm superiority in a variety
            of different battlegrounds!
          </p>
          <img src="@/assets/base/logo.png" alt="Bug Wars Logo" />
        </div>
      </div>
      <div class="card">
        <h2>BATTLEGROUND</h2>
        <div class="content battleground-content">
          <img src="https://i.imgur.com/NXFJ90l.png" alt="Battleground Sample Image" />
          <p>
            This is a <strong>BATTLEGROUND</strong>. There are a number of different battlegrounds,
            designed for two or four swarms. Your bugs will have a number of ways to gather
            information about and interact with the battleground. Each battleground presents a
            unique scenario for your swarm to conquer.
          </p>
        </div>
        <Divider />
        <div class="content">
          <p>
            This is a <strong>BUG</strong>. Each battleground will determine how many bugs comprise
            your swarm. All of the bugs in a swarm will share a script and perform individual
            actions based on the contents of that script. A bug can move forward, turn, attack, and
            eat.
          </p>
          <img src="@/assets/img/bug-green-lg.png" alt="Bug" />
        </div>
        <Divider />
        <div class="content food-content">
          <img src="@/assets/img/food-large.png" alt="Food (pizza)" />
          <p>
            This is <strong>FOOD</strong>. When a bug dies, it drops food. Food might also be
            scattered throughout the battleground. When a bug eats food, a new bug of the same swarm
            is spawned on its location. Food can be destroyed by bug attacks, so be careful!
          </p>
        </div>
      </div>
      <div class="card">
        <h2>SCRIPT CREATION</h2>
        <div class="content">
          <p>
            This is a <strong>SCRIPT</strong>. A script is composed of actions, conditionals, and
            labels. Actions affect the world. Conditionals allow you to alter the flow of your
            script, allowing you to control when your bugs perform actions. Each conditional has a
            target label. If the condition is met, the script will jump to the target label.
            Otherwise, it will skip to the next line. Labels are used to mark locations in your
            script.
          </p>
          <p class="code">
            {{ sampleScript }}
          </p>
        </div>
        <Divider />
        <h3>ACTION STATEMENT</h3>
        <div class="content">
          <p>
            An <strong>ACTION STATEMENT</strong> is the simplest command. It executes an action. It
            has no arguments. Each action takes 1 game tick to execute.
          </p>
          <p class="code">{{ sampleActions }}</p>
        </div>
        <div class="table">
          <table>
            <thead>
              <tr>
                <th>ACTION</th>
                <th>DESCRIPTION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>mov</td>
                <td>Move forward one grid square if it is unoccupied.</td>
              </tr>
              <tr>
                <td>att</td>
                <td>
                  Attack in the direction the bug is facing. If an enemy is present, they will be
                  destroyed and become food.
                </td>
              </tr>
              <tr>
                <td>eat</td>
                <td>
                  Attempt to eat from the grid square the bug is facing. If this action is
                  successful, a new friendly bug will spawn.
                </td>
              </tr>
              <tr>
                <td>rotl</td>
                <td>Rotate counterclockwise.</td>
              </tr>
              <tr>
                <td>rotr</td>
                <td>Rotate clockwise.</td>
              </tr>
              <tr>
                <td>noop</td>
                <td>Perform no action.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Divider />
        <h3>CONTROL STATEMENT</h3>
        <div class="content">
          <p>
            A <strong>CONTROL STATEMENT</strong> accepts a <strong>LABEL</strong> as a target. goto
            will always begin code execution at its LABEL. All other CONTROL STATEMENTs will
            conditionally jump to their LABEL.
          </p>
          <p class="code">{{ sampleControls }}</p>
        </div>
        <div class="table">
          <table>
            <thead>
              <tr>
                <th>CONTROL</th>
                <th>DESCRIPTION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ifEnemy</td>
                <td>
                  Jump to target LABEL if an enemy is in the square directly in front of the bug.
                </td>
              </tr>
              <tr>
                <td>ifAlly</td>
                <td>
                  Jump to target LABEL if an ally is in the square directly in front of the bug.
                </td>
              </tr>
              <tr>
                <td>ifFood</td>
                <td>Jump to target LABEL if food is in the square directly in front of the bug.</td>
              </tr>
              <tr>
                <td>ifEmpty</td>
                <td>Jump to target LABEL if the square directly in front of the bug is empty.</td>
              </tr>
              <tr>
                <td>ifWall</td>
                <td>Jump to target LABEL if there is a wall directly in front of the bug.</td>
              </tr>
              <tr>
                <td>goto</td>
                <td>Jump to target LABEL.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Divider />
        <h3>LABEL</h3>
        <div class="content">
          <p>
            A <strong>LABEL</strong> serves as a target for a <strong>CONTROL STATEMENT</strong>.
            Define a LABEL like:
          </p>
          <p class="code">{{ sampleLabel1 }}</p>
        </div>
        <div class="content">
          <p>
            And then use it as a target. This code will cause the bug to attack and move. It will
            then jump back to the LABEL, attack again, and so on. A LABEL must be composed of
            capital letters, numbers, and/or underscores.
          </p>
          <p class="code">{{ sampleLabel2 }}</p>
        </div>
        <Divider />
        <h3>COMMENT</h3>
        <div class="content">
          <p>Place a <strong>COMMENT</strong> in your code using the # symbol.</p>
          <p class="code">{{ sampleComment }}</p>
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

  .battleground-content,
  .food-content {
    flex-direction: column;
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
</style>
