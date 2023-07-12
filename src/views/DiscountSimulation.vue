<template>
  <div>
    <h1>할인 시뮬레이션</h1>
  </div>
</template>

<script>
export default {
    name: 'DiscountSimulation',
    data: function() { 
      return {
        product: [1000],
        singleCoupons: [10,20,30,40,50],
        doubleCoupons: [1,2,3,4,5],
        basketCoupons: [100,200,300,400,500],
      }
    },
    created: function() {
      
    }
}
</script>

<style>

</style>