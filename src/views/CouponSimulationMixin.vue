<!--
// <template>
//   <div>
//     <h1>쿠폰 시뮬레이션</h1>
//     <div v-for="prd in products" :key="prd.prdNo">
//       <h3>{{ prd.prdNm }}</h3> 판매가: {{ prd.selPrc }} ||| 
//       단수쿠폰: 
//       <select v-model="prd.selectedSigleCoupon" @change="applyCoupons">
//         <option v-for="cpn in prd.productSingleCoupons" :key="cpn.cpnNo" :value="cpn" :disabled="cpn.cpnNo > 0 && cpn.selected">
//           {{ cpn.cpnNm }}
//         </option>
//       </select>
//       ||| 
//       복수쿠폰: 
//       <select v-model="prd.selectedDoubleCoupon" @change="applyCoupons">
//         <option v-for="cpn in prd.productDoubleCoupons" :key="cpn.cpnNo" :value="cpn" :disabled="cpn.cpnNo > 0 && cpn.selected">
//           {{ cpn.cpnNm }} 
//         </option>
//       </select>
//       ||| 
//       할인혜택: 
//       {{ prd.singleBenefit + prd.doubleBenefit }}
//     </div>
//     <hr>
//     <div>
//       장바구니쿠폰: 
//       <select v-model="selectedBasketCoupon" @change="applyCoupons">
//         <option v-for="cpn in basketCoupons" :key="cpn.cpnNo" :value="cpn">
//           {{ cpn.cpnNm }}
//         </option>
//       </select>
//       |||
//       할인혜택  
//       {{ basketCouponBenefit }}
//     </div>
//     <hr>
//     <h3>할인가 합계</h3>
//     {{ totalPrcAppliedBenefit }}
//     <h3>혜택 합계</h3>
//     {{ totalBenefit }}
//     <hr>
//     <button @click="countCaseNumber">(쿠폰 조건 생각 안하고)최대 경우의 수 계산하기!</button>
//     {{ caseNumber }}
//     <hr>
//     <button @click="couponSimulaion">쿠폰 시뮬레이션!</button>
//   </div>
// </template>
-->
<script>
export default {
    name: 'CouponSimulationMixin',
    computed: {
      totalPrcAppliedBenefit: function() {
        return this.products.length > 0 ? this.products.map(prd => prd.selPrcAppliedBenefit).reduce((a, b) => a + b) - this.basketCouponBenefit : 0;
      }
    },
    data: function() {
      return {
        caseCount: 0,
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
            selectedDoubleCoupon: {},
            simulatedSingleCoupon: {},
            simulatedDoubleCoupon: {}
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
            selectedDoubleCoupon: {},
            simulatedSingleCoupon: {},
            simulatedDoubleCoupon: {}
          },
          {
            prdNo: 3,
            prdNm: '요거트',
            selPrc: 2500,
            productSingleCoupons: [],
            productDoubleCoupons: [],
            singleBenefit: 0,
            doubleBenefit: 0,
            selPrcAppliedBenefit: 2500,
            selectedSigleCoupon: {},
            selectedDoubleCoupon: {},
            simulatedSingleCoupon: {},
            simulatedDoubleCoupon: {}
          }
        ],
        // 자동적용쿠폰도 고려해야함, 적용 무제한임
        singleCoupons: [
          { 
            cpnNo: 0,
            cpnNm: '선택해주세요' 
          },
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
            targetProductNos: [1, 2, 3],
            selected: false
          },
        ],
        doubleCoupons: [
          { 
            cpnNo: 0, 
            cpnNm: '선택해주세요' 
          },
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
          {
            cpnNo: 7,
            cpnNm: '상품복수 30% 정률쿠폰 조건없음',
            cpnType: '01', // 01: 정률, 02: 정액
            dscRt: 30,
            targetProductNos: [1, 2, 3],
            selected: false
          },
          {
            cpnNo: 8,
            cpnNm: '상품복수 30% 정률쿠폰 조건없음',
            cpnType: '01', // 01: 정률, 02: 정액
            dscRt: 30,
            targetProductNos: [1, 2, 3],
            selected: false
          },
        ],
        basketCoupons: [
          { 
            cpnNo: 0,
            cpnNm: '선택해주세요'  
          },
          {
            cpnNo: 5,
            cpnNm: '장바구니 300원 정액쿠폰 조건없음',
            cpnType: '02', // 01: 정률, 02: 정액
            dscRt: 300,
            targetProductNos: [1, 2, 3],
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
        selectedBasketCoupon: {},
        simulatedBasketCoupon: {},
        totalBenefit: 0,
        maxBenefit: 0,
      }
    },
    methods: {
      // https://herong.tistory.com/entry/CaseOfNumber-%EC%A1%B0%ED%95%A9-%EC%A4%91%EB%B3%B5%EC%A1%B0%ED%95%A9
      countCaseNumber: function() {
        
        const N1 = this.singleCoupons.length;
        const N2 = this.doubleCoupons.length;
        const N3 = this.basketCoupons.length;
        const R = this.products.length;

        // const N1 = 5;
        // const N2 = 5;
        // const N3 = 5;
        // const R = 5;
        // N: 쿠폰 수 / R: 상품 수
        const countCase = function(N, R) {
          if (N < R) {
            return countCaseWhenRGrater(R, N); // R, N 주의
          } else {
            return countCaseWhenNGrater(N, R);
          }
        }

        // N: 쿠폰 수 / R: 상품 수
        const countCaseWhenNGrater = function(N, R) {
          // 쿠폰의 수가 상품의 수보다 더 클 때
          // 쿠폰목록에서 상품 수 만큼 중복없이 쿠폰을 골라내는 배열의 수
          // "쿠폰선택안함"의 경우는 중복이 가능해야함
          // 중복 없는 순열 + 중복 있는 순열에서 "쿠폰선택안함"의 경우가 중복을 차지하는 경우
          // nPr + (n∏r - nPr) / n
          return countPermutations(N, R) + (countDoublePermutaions(N,R) - countPermutations(N, R)) / N;
        }

        // N: 상품 수 / R: 쿠폰 수
        const countCaseWhenRGrater = function(N, R) {
          // 쿠폰의 수가 상품의 수보다 더 적을 때 
          // 순열만으로 계산이 불가능하므로 조합 활용하여 계산.
          // 거꾸로 생각한다.
          // 상품목록에서 적용할 쿠폰 수 만큼 중복없이 상품을 골라내는 배열의 수 X 적용할 쿠폰의 순열
          let result = 0;
          for(let i = 0; i <= R; i++) {
            result += (countCombinations(N, i) * countPermutations(R, i));
          }
          return result
        }

        const countCombinations = function(N, R) {
          return countPermutations(N, R) / factorial(R)
        }
        
        const countPermutations = function(N, R) {
          return factorial(N) / factorial(N - R);
        }

        const countDoublePermutaions = function(N, R) {
          return Math.pow(N, R)
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
        this.caseNumber = countCase(N1, R) * countCase(N2, R) * N3;
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
      getCaseForProduct: function(N, R, step) {
        // DFS 알고리즘 활용하여 경우의 수 구함
        console.log('step ' + step + ' start!!!!')
        let visit = []; // N개 ? 쿠폰 수?
        for (let i = 0; i < N; i++) {
          visit.push(false);
        }
        const arrange = () => {
          for(let i = 0; i < this.basketCoupons.length; i++) {
            if (this.isAvailableCoupon('B', this.basketCoupons[i])) {
              this.selectedBasketCoupon = this.basketCoupons[i];
              this.caseCount++;            
              console.log('단수쿠폰:' + this.products.map(prd => prd.selectedSigleCoupon.cpnNm));
              console.log('  복수쿠폰:' + this.products.map(prd => prd.selectedDoubleCoupon.cpnNm));
              console.log('    장바구니쿠폰:' + this.selectedBasketCoupon.cpnNm);
              this.applyCoupons();
              this.findMaxBenefit();
              console.log('--------------------------------------')
            }
          }
        }
        const permutate = (N, R, depth, step) => {
          if (depth == R) {
            if (step === 'S') {
              this.getCaseForProduct(this.doubleCoupons.length, this.products.length, 'D');
            }
            if (step === 'D') {
              console.log('==================');
              arrange();  
            }
            return;
          }

          for (let i = 0; i < N; i++) {
              if (visit[i] === false) {
                  if (step === 'S') {
                    
                    if (!this.isAvailableCoupon('S', this.singleCoupons[i], [this.products[depth]])) {
                      continue;
                    }
                    if (this.singleCoupons[i].cpnNo > 0) {
                      visit[i] = true; // cpnNo == 0(선택안함)일때는 중복 가능하므로 visit[i] = false 유지한다.
                    }
                    this.products[depth].selectedSigleCoupon = this.singleCoupons[i];
                    this.applyCoupons();
                  }
                  if (step === 'D') {
                    if (!this.isAvailableCoupon('D', this.doubleCoupons[i], [this.products[depth]])) {
                      continue;
                    }
                     if (this.doubleCoupons[i].cpnNo > 0) {
                      visit[i] = true; // cpnNo == 0(선택안함)일때는 중복 가능하므로 visit[i] = false 유지한다.
                    }
                    this.products[depth].selectedDoubleCoupon = this.doubleCoupons[i];
                    this.applyCoupons();
                  }
                  permutate(N, R, depth + 1, step); // 다음 상품으로 넘어간다.
                  console.log('************************');
                  visit[i] = false;
              }
          }
        }
        permutate(N, R, 0, step);
      },
      isAvailableCoupon: function(type, coupon, products = this.products) {
        if (coupon.cpnNo === 0) {
          return true;
        }

        if (type === 'S') {
          // 상품 단수쿠폰
          if (products[0].productSingleCoupons.map(cpn => cpn.cpnNo).includes(coupon.cpnNo)) {
            return true;
          }
        }
        if (type === 'D') {
          // 상품 복수쿠폰
          if (products[0].productDoubleCoupons.map(cpn => cpn.cpnNo).includes(coupon.cpnNo)) {
            return true;
          }
        }
        if (type === 'B') {
          // 장바구니 쿠폰
          return true;
        }
        return false;
      },
      applyCoupons: function() {
        this.applyProductCoupons();
        this.applyBasketCoupons();
        this.showTotalBenefit();
      },
      settingMaxBenefitCoupon: function() {
          this.products.forEach(prd => {
            prd.selectedSigleCoupon = prd.simulatedSingleCoupon;
            prd.selectedDoubleCoupon = prd.simulatedDoubleCoupon;
          });
          this.selectedBasketCoupon = this.simulatedBasketCoupon;
          this.applyCoupons();
      },
      findMaxBenefit: function() {
        if (this.maxBenefit < this.totalBenefit) {
          this.products.forEach(prd => {
            prd.simulatedSingleCoupon = prd.selectedSigleCoupon;
            prd.simulatedDoubleCoupon = prd.selectedDoubleCoupon;
          });
          this.simulatedBasketCoupon = this.selectedBasketCoupon;

          this.maxBenefit = this.totalBenefit;
          console.log('이시점 최고혜택!!!');
        }
        if (this.maxBenefit === this.totalBenefit) {
          // 쿠폰 우선순위에 따라 처리,,,??
        }
      },
      showTotalBenefit: function() {
        this.totalBenefit = this.products.map(prd => prd.singleBenefit + prd.doubleBenefit).reduce((a, b) => a + b);
        this.totalBenefit += this.basketCouponBenefit;
      },
      applyProductCoupons: function() {
        this.singleCoupons.forEach(cpn => { 
          if (cpn.cpnNo > 0) {
            cpn.selected = false;
          }
        });
        this.doubleCoupons.forEach(cpn => { 
          if (cpn.cpnNo > 0) {
            cpn.selected = false;
          }
        });
        this.products.forEach(prd => {
          prd.singleBenefit = 0;
          prd.doubleBenefit = 0;
          prd.selPrcAppliedBenefit = prd.selPrc;
        })

        this.products.forEach(prd => {
          if (prd.selectedSigleCoupon.cpnNo > 0){
            prd.selectedSigleCoupon.selected = true;
          }
          if (prd.selectedDoubleCoupon.cpnNo > 0){
            prd.selectedDoubleCoupon.selected = true;
          }


          prd.singleBenefit = this.calculateBenefit(prd.selPrc, prd.selectedSigleCoupon);
          prd.doubleBenefit = this.calculateBenefit(prd.selPrcAppliedBenefit, prd.selectedDoubleCoupon); // todo hs: selPrc여도 되지않나?

          prd.selPrcAppliedBenefit -= prd.singleBenefit;
          prd.selPrcAppliedBenefit -= prd.doubleBenefit;

        })

      },
      applyBasketCoupons: function() {
        this.basketCouponBenefit = 0;

        if (this.selectedBasketCoupon.cpnType === '01') {
          this.basketCouponBenefit = this.totalPrcAppliedBenefit * this.selectedBasketCoupon.dscRt / 100;
        }

        if (this.selectedBasketCoupon.cpnType === '02') {
          this.basketCouponBenefit = this.selectedBasketCoupon.dscRt > this.totalPrcAppliedBenefit ? this.totalPrcAppliedBenefit : this.selectedBasketCoupon.dscRt;
        }
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
      settingProductCoupons: function() {
        this.products.forEach(prd => { 
          prd.productSingleCoupons = [];
          prd.productDoubleCoupons = [];
          this.singleCoupons.forEach(
            cpn => { 
              if (cpn.cpnNo == 0 || cpn.targetProductNos.includes(prd.prdNo)) {
                prd.productSingleCoupons.push(cpn);
              }
          });
          this.doubleCoupons.forEach(
            cpn => { 
              if (cpn.cpnNo == 0 || cpn.targetProductNos.includes(prd.prdNo)) {
                prd.productDoubleCoupons.push(cpn);
              }
          });
        });
      },
      couponSimulaion: function() {
        let start = new Date()
        this.getCaseForProduct(this.singleCoupons.length, this.products.length, 'S');
        this.settingMaxBenefitCoupon();
        let end = new Date();
        console.log('getCaseForProduct COUNT: ' + this.caseCount);
        console.log(end-start);
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