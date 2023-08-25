<template>
  <div>
    <h1>쿠폰 시뮬레이션</h1>
    <div v-for="prd in products" :key="prd.prdNo">
      <h3>{{ prd.prdNm }}</h3> 판매가: {{ prd.selPrc }} ||| 
      단수쿠폰: 
      <select v-model="prd.selectedSigleCoupon" @change="applyProductCoupons">
        <option :value="{}">선택하세요.</option>
        <option v-for="cpn in prd.productSingleCoupons" :key="cpn.cpnNo" :value="cpn" :disabled="cpn.selected">
          {{ cpn.cpnNm }}
        </option>
      </select>
      ||| 
      복수쿠폰: 
      <select v-model="prd.selectedDoubleCoupon" @change="applyProductCoupons">
        <option :value="{}">선택하세요.</option>
        <option v-for="cpn in prd.productDoubleCoupons" :key="cpn.cpnNo" :value="cpn" :disabled="cpn.selected">
          {{ cpn.cpnNm }}
        </option>
      </select>
      ||| 
      할인혜택: 
      {{ prd.singleBenefit + prd.doubleBenefit }}
    </div>
    <hr>
    <div>
      장바구니쿠폰: 
      <select v-model="selectedBasketCoupon" @change="applyBasketCoupons">
        <option :value="{}">선택하세요.</option>
        <option v-for="cpn in basketCoupons" :key="cpn.cpnNo" :value="cpn">
          {{ cpn.cpnNm }}
        </option>
      </select>
      |||
      할인혜택  
      {{ basketCouponBenefit }}
    </div>
    <hr>
    <h3>합계</h3>
    {{ totalPrcAppliedBenefit }}
    <hr>
    <button @click="countCaseNumber">경우의 수 구하기!</button>
    {{ caseNumber }}
    <hr>
    <button>쿠폰 시뮬레이션!</button>
  </div>
</template>

<script>
export default {
    name: 'CouponSimulation',
    computed: {
      totalPrcAppliedBenefit: function() {
        return this.products.map(prd => prd.selPrcAppliedBenefit).reduce((a, b) => a + b) - this.basketCouponBenefit;
      }
    },
    data: function() {
      return {
        caseNumber: 0,

        products: [
          {
            prdNo: 1,
            prdNm: '스윙칩',
            selPrc: 1000,
            productSingleCoupons: [],
            productDoubleCoupons: [],
            singleBenefit: 0,
            doubleBenefit: 0,
            selPrcAppliedBenefit: 1000,
            selectedSigleCoupon: {},
            selectedDoubleCoupon: {}
          },
          {
            prdNo: 2,
            prdNm: '콜라',
            selPrc: 2000,
            productSingleCoupons: [],
            productDoubleCoupons: [],
            singleBenefit: 0,
            doubleBenefit: 0,
            selPrcAppliedBenefit: 2000,
            selectedSigleCoupon: {},
            selectedDoubleCoupon: {}
          }
        ],
        // 자동적용쿠폰도 고려해야함, 적용 무제한임
        singleCoupons: [
          {
            cpnNo: 1,
            cpnNm: '상품단수 10% 정률쿠폰 조건없음',
            cpnType: '01', // 01: 정률, 02: 정액
            dscRt: 10,
            targetProductNos: [1, 2],
            selected: false
          },
          {
            cpnNo: 2,
            cpnNm: '상품단수 150원 정액쿠폰 조건없음',
            cpnType: '02', // 01: 정률, 02: 정액
            dscRt: 150,
            targetProductNos: [1, 2],
            selected: false
          },
        ],
        doubleCoupons: [
          {
            cpnNo: 3,
            cpnNm: '상품복수 200원 정액쿠폰 조건없음',
            cpnType: '02', // 01: 정률, 02: 정액
            dscRt: 200,
            targetProductNos: [1, 2],
            selected: false
          },
          {
            cpnNo: 4,
            cpnNm: '상품복수 20% 정률쿠폰 조건없음',
            cpnType: '01', // 01: 정률, 02: 정액
            dscRt: 20,
            targetProductNos: [1, 2],
            selected: false
          },
        ],
        basketCoupons: [
          {
            cpnNo: 5,
            cpnNm: '장바구니 300원 정액쿠폰 조건없음',
            cpnType: '02', // 01: 정률, 02: 정액
            dscRt: 300,
            targetProductNos: [1, 2],
            selected: false
          },
          {
            cpnNo: 6,
            cpnNm: '장바구니 30% 정률쿠폰 조건없음',
            cpnType: '01', // 01: 정률, 02: 정액
            dscRt: 30,
            targetProductNos: [1, 2],
            selected: false
          },
        ],
        basketCouponBenefit: 0,
        selectedBasketCoupon: {}
      }
    },
    methods: {
      // https://herong.tistory.com/entry/CaseOfNumber-%EC%A1%B0%ED%95%A9-%EC%A4%91%EB%B3%B5%EC%A1%B0%ED%95%A9
      countCaseNumber: function() {
        
        const N1 = this.singleCoupons.length + 1;
        const N2 = this.doubleCoupons.length + 1;
        const N3 = this.basketCoupons.length + 1;
        const R = this.products.length;

        // const N1 = 5;
        // const N2 = 5;
        // const N3 = 5;
        // const R = 5;

        const permutationsOrCombinations = function(N, R) {
          if (N < R) {
            return permutate(R, N);
          } else {
            return combinate(N, R);
          }
        }

        const combinate = function(N, R) {
          return factorial(N) / (factorial(R) * factorial(N - R))
        }
        
        const permutate = function(N, R) {
          return factorial(N) / factorial(N - R);
        }

        const factorial = function(number) {

          if (number == 0) {
            return 1;
          }
          if (number == 1) {
            return number;
          }
          return number * factorial(number - 1);
        }

        this.caseNumber = permutationsOrCombinations(N1, R) * permutationsOrCombinations(N2, R) * factorial(N3);
      },
      
      applyProductCoupons: function() {
        this.singleCoupons.forEach(cpn => cpn.selected = false);
        this.doubleCoupons.forEach(cpn => cpn.selected = false);

        this.products.forEach(prd => {
          // if (!prd.selectedSigleCoupon || prd.selectedSigleCoupon == {}) {
          //   return;
          // }
          prd.selectedSigleCoupon.selected = true;
          prd.selectedDoubleCoupon.selected = true;

          prd.selPrcAppliedBenefit = prd.selPrc;
          prd.singleBenefit = 0;
          prd.doubleBenefit = 0;
          // 단수쿠폰
          // 정률
          if (prd.selectedSigleCoupon.cpnType === '01') {
            prd.singleBenefit += prd.selPrc * prd.selectedSigleCoupon.dscRt / 100;
          }

          // 정액
          if (prd.selectedSigleCoupon.cpnType === '02') {
            prd.singleBenefit += prd.selectedSigleCoupon.dscRt > prd.selPrc ? prd.selPrc : prd.selectedSigleCoupon.dscRt;
          }
          prd.selPrcAppliedBenefit -= prd.singleBenefit;

          // if (!prd.selectedDoubleCoupon || prd.selectedDoubleCoupon == {}) {
          //   return;
          // }
          // 복수쿠폰
          // 정률
          if (prd.selectedDoubleCoupon.cpnType === '01') {
            prd.doubleBenefit = prd.selPrcAppliedBenefit * prd.selectedDoubleCoupon.dscRt / 100;
          }

          // 정액
          if (prd.selectedDoubleCoupon.cpnType === '02') {
            prd.doubleBenefit = prd.selectedDoubleCoupon.dscRt > prd.selPrcAppliedBenefit ? prd.selPrcAppliedBenefit : prd.selectedDoubleCoupon.dscRt;
          }
          prd.selPrcAppliedBenefit -= prd.doubleBenefit;

          this.applyBasketCoupons();
        })
      },
      applyBasketCoupons: function() {
        this.basketCouponBenefit = 0;

        if (this.selectedBasketCoupon.cpnType === '01') {
          this.basketCouponBenefit = this.totalPrcAppliedBenefit * this.selectedBasketCoupon.dscRt / 100;
        }

        // 정액
        if (this.selectedBasketCoupon.cpnType === '02') {
          this.basketCouponBenefit = this.selectedBasketCoupon.dscRt > this.totalPrcAppliedBenefit ? this.totalPrcAppliedBenefit : this.selectedBasketCoupon.dscRt;
        }

      },
      settingProductCoupons: function() {
        this.products.forEach(prd => { 
          this.singleCoupons.forEach(
            cpn => { 
              if (cpn.targetProductNos.includes(prd.prdNo)) {
                prd.productSingleCoupons.push(cpn);
              }
          });
          this.doubleCoupons.forEach(
            cpn => { 
              if (cpn.targetProductNos.includes(prd.prdNo)) {
                prd.productDoubleCoupons.push(cpn);
              }
          });
        });
       
      }
    },
    created: function() {
      this.settingProductCoupons();
    },
    updated: function() {
    }
}
</script>

<style>

</style>