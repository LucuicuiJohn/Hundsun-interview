<template>
  <div class="h-body">
    <h-head></h-head>
    <h-Main></h-Main>
    <h-Foot></h-Foot>
  </div>
</template>

<script>
import hHead from './components/HsbHead'
import hMain from './components/HsbMain'
import hFoot from './components/HsbFoot'
export default {
  name: 'layout',
  components: {
    hHead,
    hFoot,
    hMain
  }
}
</script>

<style scoped>
</style>
