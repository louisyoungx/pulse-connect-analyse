<template>
  <router-view/>
</template>

<style>
.record-container {
    height: 100%;
    transform: translateY(0.6em);
}

.record {
    height: 80%;
}

.main-container {
    background: linear-gradient(
        60deg,
        rgba(84, 58, 183, 1) 0%,
        rgba(0, 172, 193, 1) 100%
    );
}

.chart-main {
    background-color: #fff;
}

.args-container {
    margin: 0 auto;
    width: 90vw;
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5vw;
    filter: drop-shadow(0px 20px 10px rgba(0, 0, 0, 0.3));
    background: linear-gradient(
        60deg,
        rgb(0, 54, 121) 0%,
        rgba(0, 172, 193, 1) 100%
    );
}

.args-content {
    margin: 0;
    width: 85vw;
    height: 20vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.args-div {
    color: #fff;
    font-size: 20px;
}

.args-colomn {
    width: 70%;
    padding-left: 25%;
}

.args-div p {
    margin: 0;
}

.cell-title {
    margin: 0;
    padding: 15px 16px 5px;
    color: rgba(69, 90, 100, 0.6);
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
}

.offset-top {
    transform: translateY(-4vh);
}

.last-element {
    margin-bottom: 54px !important;
}
</style>
