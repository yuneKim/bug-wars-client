<template>
  <div class="loading-spinner">
    <div class="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.loading-spinner {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 160px;
  height: 160px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
  width: 26px;
  height: 26px;
  border: 1px solid white;
  background: var(--button-red);
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 16px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 16px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 64px;
  animation: lds-ellipsis2 0.6s infinite;
  z-index: 1;
}
.lds-ellipsis div:nth-child(4) {
  left: 112px;
  animation: lds-ellipsis3 0.6s infinite;
  z-index: 0;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(48px, 0);
  }
}
</style>
