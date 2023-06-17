<template>
  <div>
    <h1>로직 시뮬레이션</h1>
  </div>
</template>

<script>
export default {
    name: 'LogicSimulation',
    data: function() { 
      return {
        product: [1000],
        singleCoupons: [10,20,30,40,50],
        doubleCoupons: [1,2,3,4,5],
        basketCoupons: [100,200,300,400,500],
      }
    },
    created: function() {
      let result = [this.singleCoupons.length]
      // reulst[] = {i,i,i, calc}
      for(let i = 0; i < this.singleCoupons; i++) {
        result[i] = {
          singleIndex: i,
          doubleIndex: -1,
          basketInex: -1,
          calc: this.product[0] - this.singleCoupons[i]
        }
      }
      
      let minObj = { 
        singleIndex: -1,
        doubleIndex: -1,
        basketInex: -1,
        calc: Number.MAX_SAFE_INTEGER
        };

      for(let i = 0; i < result.length; i ++) {
        if (result[i].calc < minObj[0].calc) {
          minObj.shift(result[i])
        } else {
          
        }
      }

      console.log(minObj)
    }
}
</script>

<style>

</style>