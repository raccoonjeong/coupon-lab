<template>
  <div>
    <h1>💳💰💎💸🎟️🎫쿠폰 시뮬레이션🎫🎟️💸💎💰💳</h1>
    <h2>⚠️새로고침하면 데이터가 모두 삭제됩니다.⚠️</h2>
    <div style="display: flex; flex-direction: row">
    <div class="container1" style="width: 50%">
      <h2>상품목록(주문서 개념)</h2>
      <div v-for="prd in products" :key="prd.prdNo">
        <h3>{{ prd.prdNo }}.{{ prd.prdNm }}({{ prd.selPrc }}원)</h3> 판매가합: {{ prd.selPrc * prd.qty }} ||| 
        단수쿠폰: 
        <select v-model="prd.selectedSigleCoupon" @change="applyCoupons">
          <option v-for="cpn in prd.productSingleCoupons" :key="cpn.cpnNo" :value="cpn" :disabled="cpn.cpnNo > 0 && cpn.selected">
            {{ cpn.cpnNm }}
          </option>
        </select>
        ||| 
        복수쿠폰: 
        <select v-model="prd.selectedDoubleCoupon" @change="applyCoupons">
          <option v-for="cpn in prd.productDoubleCoupons" :key="cpn.cpnNo" :value="cpn" :disabled="cpn.cpnNo > 0 && cpn.selected">
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
        <select v-model="selectedBasketCoupon" @change="applyCoupons">
          <option v-for="cpn in basketCoupons" :key="cpn.cpnNo" :value="cpn">
            {{ cpn.cpnNm }}
          </option>
        </select>
        |||
        할인혜택  
        {{ basketCouponBenefit }}
      </div>
      <hr>
      판매가 합계: {{ totalSelPrc }} ||| 할인가 합계: {{ totalPrcAppliedBenefit }} ||| 혜택 합계: {{ totalBenefit }}
      <hr>
      <button @click="countCaseNumber">(쿠폰 조건 생각 안하고)최대 경우의 수 계산하기!</button>
      {{ caseNumber }}
      <hr>
      <button @click="couponSimulaion">쿠폰 시뮬레이션!</button> 소요시간: {{ simulationTime }} ms(밀리초)
      <hr>
      <h3>상품단수쿠폰 목록</h3>
      <div>
        <div>
          쿠폰명 ||| 쿠폰타입 ||| 할인율/할인액 ||| 대상상품번호
        </div>
      </div>
      <div v-for="cpn in singleCoupons" :key="cpn.cpnNo">
        <div v-if="cpn.cpnNo > 0">
          {{ cpn.cpnNm }} ||| {{ getCouponTypes(cpn.cpnType) }} ||| {{ cpn.dscRt }} ||| {{ cpn.targetProductNos }}
        </div>
      </div>
      <h3>상품복수쿠폰 목록</h3>
      <div>
        <div>
          쿠폰명 ||| 쿠폰타입 ||| 할인율/할인액 ||| 대상상품번호
        </div>
      </div>
      <div v-for="cpn in doubleCoupons" :key="cpn.cpnNo">
        <div v-if="cpn.cpnNo > 0">
          {{ cpn.cpnNm }} ||| {{ cpn.cpnType }} ||| {{ cpn.dscRt }} ||| {{ cpn.targetProductNos }}
        </div>
      </div>
      <h3>장바구니쿠폰 목록</h3>
      <div>
        <div>
          쿠폰명 ||| 쿠폰타입 ||| 할인율/할인액 ||| 대상상품번호
        </div>
      </div>
      <div v-for="cpn in basketCoupons" :key="cpn.cpnNo">
        <div v-if="cpn.cpnNo > 0">
          {{ cpn.cpnNm }} ||| {{ cpn.cpnType }} ||| {{ cpn.dscRt }} ||| {{ cpn.targetProductNos }}
        </div>
      </div>
    </div>
    <div class="container2" style="width: 50%">
      <h2>상품 등록하기(주문 개념)</h2>
      <div>상품명 <input type="text" v-model="inputProduct.prdNm"></div>
      <div>판매가 <input type="number" v-model="inputProduct.selPrc"></div>
      <div>수량 <input type="number" v-model="inputProduct.qty"></div>
      <button @click="registerProduct">상품 등록</button>
      <hr>
      <h2>쿠폰 등록하기</h2>
      <div v-if="products.length > 0">
        <div>
          쿠폰명 
          <input type="text" v-model="inputCoupon.cpnNm">
        </div>
        <div>
          쿠폰타입 
          <input type="radio" name="cpnType" value="01" v-model="inputCoupon.cpnType"> 정률
          <input type="radio" name="cpnType" value="02" v-model="inputCoupon.cpnType"> 정액
        </div>
        <div>
          할인율(%)/할인가(원)<input type="number" v-model="inputCoupon.dscRt"></div>
        <div>
          쿠폰종류 
          <input type="radio" name="cpnSpec" value="S" v-model="inputCoupon.cpnSpec"> 상품단수
          <input type="radio" name="cpnSpec" value="D" v-model="inputCoupon.cpnSpec"> 상품복수 
          <input type="radio" name="cpnSpec" value="B" v-model="inputCoupon.cpnSpec"> 장바구니
        </div>
        <div>
          최소주문금액 
          <input type="checkbox" v-model="inputCoupon.minOrdAmtYn"> 최소주문금액 적용
          <input type="text" v-model="inputCoupon.minOrdAmt" :disabled="!inputCoupon.minOrdAmtYn">원 이상 구매시 쿠폰사용 가능
        </div>
        <div>
          최소주문수량 
          <input type="checkbox" v-model="inputCoupon.minOrdQtyYn"> 최소주문수량 적용
          <input type="text" v-model="inputCoupon.minOrdQty" :disabled="!inputCoupon.minOrdQtyYn">개 이상 구매시 쿠폰사용 가능
        </div>
        <div>
          대상상품 
          <div v-for="(prd, idx) in products" :key="idx" >
            <input type="checkbox" v-model="inputCoupon.targetProductNos" :value="prd.prdNo"> {{ prd.prdNm }} 
          </div>
        </div>
        <button @click="registerCoupon">쿠폰 등록</button>
      </div>
      <div v-else>
        쿠폰을 등록하려면 1개 이상의 상품이 등록되어야 합니다.
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import CouponSimulationMixin from './CouponSimulationMixin.vue';
export default {
    name: 'CouponSimulationTest',
    mixins: [CouponSimulationMixin],
    data: function() {
        return {
          simulationTime: 0,
          products: [],
          inputProduct: {
            prdNo: 0,
            prdNm: '',
            selPrc: 0,
            productSingleCoupons: [],
            productDoubleCoupons: [],
            singleBenefit: 0,
            doubleBenefit: 0,
            selPrcAppliedBenefit: 0,
            selectedSigleCoupon: { 
              cpnNo: 0,
              cpnNm: '선택해주세요' 
            },
            selectedDoubleCoupon: { 
              cpnNo: 0,
              cpnNm: '선택해주세요' 
            },
            simulatedSingleCoupon: {},
            simulatedDoubleCoupon: {},
            qty: 1,
          },
          inputProductSeq: 0,
          singleCoupons: [{ 
            cpnNo: 0,
            cpnNm: '선택해주세요' 
          }],
          doubleCoupons: [{ 
            cpnNo: 0,
            cpnNm: '선택해주세요' 
          }],
          basketCoupons: [{ 
            cpnNo: 0,
            cpnNm: '선택해주세요' 
          },],
          inputCoupon: {
            cpnNo: 0,
            cpnNm: '',
            cpnType: '', // 01: 정률, 02: 정액
            dscRt: 0,
            targetProductNos: [],
            selected: false,
            cpnSpec: '', // S D B
            minOrdAmtYn: false,
            minOrdAmt: 0,
            minOrdQtyYn: false,
            minOrdQty: 0,
          },
          inputCouponSeq: 0,
          basketCouponBenefit: 0,
          selectedBasketCoupon: { 
            cpnNo: 0,
            cpnNm: '선택해주세요' 
          },
          simulatedBasketCoupon: {},
          totalBenefit: 0,
          maxBenefit: 0,
        }
    },
    methods: {
      getCouponTypes: function(cpnType) {
        if (cpnType === '01')
          return '정률';
        if (cpnType === '02')
          return '정액';
      },
      deleteAll: function() {
        if (confirm('모두 삭제하시겠습니까?')) { 
          this.products = this.$options.data().products;
          this.coupons = this.$options.data().coupons;
        }
      
      },
      registerProduct: function() {
        this.inputProduct.prdNo = ++this.inputProductSeq;
        this.products.push(this.inputProduct);
        this.inputProduct = this.$options.data().inputProduct;
        this.applyCoupons();
        this.settingProductCoupons();
      },
      registerCoupon: function() {

        this.inputCoupon.cpnNo = ++this.inputCouponSeq;  
        if (this.inputCoupon.cpnSpec === 'S') {
          this.singleCoupons.push(this.inputCoupon);
        } 
        if (this.inputCoupon.cpnSpec === 'D') {
          this.doubleCoupons.push(this.inputCoupon);
        } 
        if (this.inputCoupon.cpnSpec === 'B') {
          this.basketCoupons.push(this.inputCoupon);
        } 
        this.inputCoupon = this.$options.data().inputCoupon;
        this.settingProductCoupons();
      },
      // @Override
      couponSimulaion: function() {
        if (this.products.length < 1) { 
          alert('1개 이상의 상품을 먼저 등록하세요.')
          return;
        }
        let start = new Date()
        this.getCaseForProduct(this.singleCoupons.length, this.products.length, 'S');
        this.settingMaxBenefitCoupon();
        let end = new Date();
        console.log('getCaseForProduct COUNT: ' + this.caseCount);
        console.log(end-start);
        this.simulationTime = end-start;
      },
      // @Override
      isAvailableCoupon: function(type, coupon, products = this.products) {
        if (coupon.cpnNo === 0) {
          return true;
        }

        if (type === 'S') {
          // 상품 단수쿠폰
          if (!products[0].productSingleCoupons.map(cpn => cpn.cpnNo).includes(coupon.cpnNo)) {
            return false;
          }
          if (coupon.minOrdAmtYn) {
            if (coupon.minOrdAmt > products[0].selPrcAppliedBenefit) {
              return false;
            }
          }
          if (products[0].selPrcAppliedBenefit < this.calculateBenefit(products[0].selPrcAppliedBenefit, coupon)) {
              return false;
          }
        }
        if (type === 'D') {
          // 상품 복수쿠폰
          if (!products[0].productDoubleCoupons.map(cpn => cpn.cpnNo).includes(coupon.cpnNo)) {
            return false;
          }
          if (coupon.minOrdAmtYn) {
            if (coupon.minOrdAmt > products[0].selPrcAppliedBenefit) {
              return false;
            }
          }
          if (products[0].selPrcAppliedBenefit < this.calculateBenefit(products[0].selPrcAppliedBenefit, coupon)) {
              return false;
          }
        }
        // if (type === 'B') {
        //   // 장바구니는 하나라도 조건에 맞으면 적용되고 대상인 상품에만 비례배분되어서 적용된다.
        //   // 장바구니 쿠폰
        //   return true;
        // }
        return true;
      },
    },
    created: function() {

    }
}
</script>