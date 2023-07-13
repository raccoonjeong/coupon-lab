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
        products: [
          { prdNm: 'A', price: 1000 }, 
          { prdNm: 'B', price: 1000 }
        ],
        discounts: [
          { dscNm: 'X', rate: 0, target: ['A', 'B']},
          { dscNm: 'GA', rate: 0.1, target: ['A', 'B']},
          { dscNm: 'NA', rate: 0.2, target: ['A', 'B']},
          { dscNm: 'DA', rate: 0.3, target: ['A', 'B']},
          { dscNm: 'LA', rate: 0.4, target: ['A', 'B']}
        ],
        result: [],
        count: 0
      }
    },
    methods: {
      matchDiscount: function(n, m, depth) {
      
        if (depth == m) {
          console.log(this.result);
          this.count++;
          return;
        }

        for(let i = 0; i < n; i++) {
          this.result[depth] = this.discounts[i]?.dscNm;
          this.matchDiscount(n, m, depth + 1);
        }
        
      }
    },
    created: function() {
      this.matchDiscount(5, 2, 0);
      console.log(this.count);
    }
}
</script>

<style>

</style>