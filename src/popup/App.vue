<template>
  <div style="width: 200px;">
    <p>Hello world!!</p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    console.log(this.$browser);
  },
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>
