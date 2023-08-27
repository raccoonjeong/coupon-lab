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
        
        // const N1 = this.singleCoupons.length + 1;
        // const N2 = this.doubleCoupons.length + 1;
        // const N3 = this.basketCoupons.length + 1;
        // const R = this.products.length;

        const N1 = 2;
        const N2 = 5;
        const N3 = 5;
        const R = 4;
        // N: 쿠폰 수 / R: 상품 수
        const countPermutationsOrCombinations = function(N, R) {
          if (N < R) {
            return countPermutationsLoop(R, N); // 물건 3개중 쿠폰 먹일 물건 2개, 1개, 0개를 뽑 (순서가 있음. 123 != 321).. 후에 x 쿠폰2장
          } else {
            return countPermutations(N, R); // 쿠폰 3장중 물건에 적용할 2장을 뽑아서 나열 (순서가 있음. 123 != 321)
          }
        }

        const countPermutationsLoop = function(N, R) {
          let result = 0;
          for(let i = 0; i <= R; i++) {
            result += countPermutations(N, i);
          }
          return result;
        }

        // const countCombinations = function(N, R) {
        //   return factorial(N) / (factorial(R) * factorial(N - R))
        // }
        
        const countPermutations = function(N, R) {
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
        
        console.log(countPermutationsOrCombinations(N1, R));

        this.caseNumber = countPermutationsOrCombinations(N1, R) * countPermutationsOrCombinations(N2, R) * factorial(N3);
      },
      getCombinations: function(N, R) {
        // N: 쿠폰 수, R: 상품 수
        // N개의 상품단수쿠폰중에서 R개의 상품 수 만큼의 경우의 수 뽑는다. 순서상관없이. (1,2 == 2,1)
        const data = [1,2]; // N개 (쿠폰 수)
        let res = [];
        let visit = [false, false]; // N개 ? 쿠폰 수?
        let count = 0;
        
        const combinate = (N, R, depth, start) => {
          if (depth === R) {
            console.log('combinate res: ' + res);
            count++;
            return;
          }

          for (let i = start; i < N; i++) {
              if (visit[i] == false) {
                  visit[i] = true;
                  res[depth] = data[i];
                  combinate(N, R, depth + 1, i);
                  visit[i] = false;
              }
          }
        }

        combinate(N, R, 0, 0);
        console.log('combinate count: ' + count);
      },
      getPermutations: function(N, R) {
        const data = [1,2]; // N개 (쿠폰 수)
        let res = [];
        let visit = [false, false]; // N개 ? 쿠폰 수?
        let count = 0;
        const permutate = (N, R, depth) => {
          console.log(N, R, depth);
          if (depth == R) {
              console.log('permutate res:' + res);
              count++;
              return;
          }

          for (let i = 0; i < N; i++) {
              if (visit[i] == false) {
                  visit[i] = true;
                  res[depth] = data[i];
                  permutate(N, R, depth + 1);
                  visit[i] = false;
              }
          }
        }
        permutate(N, R, 0);
        console.log('permutate count: ' + count);
      },
      getPermutationsForProduct: function(N, R, step) {
        console.log('step ' + step + ' start!!!!')
        // this.singleCoupons; // const data = [1,2]; // N개 (쿠폰 수)
        // this.products[0].selectedSigleCoupon; // let res = [];
        let visit = [false, false]; // N개 ? 쿠폰 수?
        let count = 0;
        const permutate = (N, R, depth, step) => {
          // console.log(N, R, depth);
          if (depth == R) {
            if (step === 'S') {
              console.log('permutate res:' + this.products.map(prd => prd.selectedSigleCoupon.cpnNm));
              this.getPermutationsForProduct(2,2, 'D');
            }
            if (step === 'D') {
              console.log('permutate res:' + this.products.map(prd => prd.selectedDoubleCoupon.cpnNm));
            }
            count++;
            return;
          }

          for (let i = 0; i < N; i++) {
              if (visit[i] == false) {
                  visit[i] = true;
                  if (step === 'S') {
                    this.products[depth].selectedSigleCoupon = this.singleCoupons[i];
                  }
                  if (step === 'D') {
                    this.products[depth].selectedDoubleCoupon = this.doubleCoupons[i];
                  }
                  permutate(N, R, depth + 1, step);
                  visit[i] = false;
              }
          }
        }
        permutate(N, R, 0, step);
        console.log('permutate count: ' + count);
      },
      applyProductCoupons: function() {
        this.singleCoupons.forEach(cpn => cpn.selected = false);
        this.doubleCoupons.forEach(cpn => cpn.selected = false);

        this.products.forEach(prd => {
          prd.selectedSigleCoupon.selected = true;
          prd.selectedDoubleCoupon.selected = true;

          prd.selPrcAppliedBenefit = prd.selPrc;

          prd.singleBenefit = this.calculateBenefit(prd.selPrc, prd.selectedSigleCoupon);
          prd.doubleBenefit = this.calculateBenefit(prd.selPrcAppliedBenefit, prd.selectedDoubleCoupon);

          prd.selPrcAppliedBenefit -= prd.singleBenefit;
          prd.selPrcAppliedBenefit -= prd.doubleBenefit;

          this.applyBasketCoupons();
        })
      },
      calculateBenefit: function(selPrc, coupon) {
        let benefit = 0;
        if (coupon.cpnType === '01') {
          benefit += selPrc * coupon.dscRt / 100;
        }
        if (coupon.cpnType === '02') {
          benefit += coupon > selPrc ? selPrc : coupon.dscRt;
        }
        return benefit;
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

      // this.getCombinations(2,2);
      // this.getPermutations(2,2);
      this.getPermutationsForProduct(2, 2, 'S');
    },
    updated: function() {
    }
}
</script>

<style>

</style>