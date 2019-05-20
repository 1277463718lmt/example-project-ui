<template>
    <div class="error-page">
        <div class="error-code">不<span>存</span>在</div>
        <div class="error-desc">( ^_^ ) 敬请期待！( ^_^ )</div>
    </div>   
</template>

<script>
export default {
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
    .error-page {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background: #f3f3f3;
      box-sizing: border-box;
    }
    .error-code {
      line-height: 1;
      font-size: 250px;
      font-weight: bolder;
      color: #f02d2d;
    }
    .error-code span {
      color: #00a854;
    }
    .error-desc {
      font-size: 30px;
      color: #777;
    }
</style>
