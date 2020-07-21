<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul class="menu">
        <li v-for="(item, index) in goods" :key="index" class="item border-1px"
          :class="{'current': currentIndex === index}" @click="selectedMenu(index)"
        >
          <span class="text">
            <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="index" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food, index) in item.foods" :key="index"
             class="food-item" @click="selectFood(food)">
              <div class="icon">
                <img :src="food.icon" width="57" height="57" />
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="new">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add="addFood" :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :selectedFoods="selectedFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
    <food :food="selectedFood" ref="foodDetail"></food>
  </div>
</template>

<script>
  import axios from 'axios'
  import BScroll from 'better-scroll'
  import shopcart from '../shopcart/shopcart.vue'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import food from '../food/food.vue'

  export default {
    name: 'goods',
    props: {
    },
    data() {
      return {
        seller: {},
        goods: [],
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    computed: {
      currentIndex() {
        for(let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i+1]
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      selectedFoods() {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if(food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        })
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          click: true
        })
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for(let i=0; i < foodList.length; i ++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectedMenu(index) {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName("food-list-hook")
        let el = foodList[index]
        this.foodsScroll.scrollToElement(el, 300)
      },
      addFood(target) {
        //优化体验，异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target)
        })
      },
      selectFood(food) {
        this.selectedFood = food
        this.$refs.foodDetail.show()
      }
    },
    created() {
      axios.get('/static/mock/data.json')
        .then((res) => {
          this.goods = res.data.goods
          this.seller = res.data.seller
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        })
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  }
</script>

<style scoped lang="stylus">
  @import '../../common/stylus/mixin'
  .goods
    display : flex
    position : absolute
    top : 174px
    bottom : 46px
    width : 100%
    overflow : hidden
    .menu-wrapper
      flex : 0 0 80px
      width : 80px
      background-color : #f3f5f7
      .item
        display : table
        width : 80px
        height : 54px
        line-height : 14px
        border-1px(rgba(7,17,27,0.1))
        font-size : 0
        &.current
          position : relative
          margin-top : -1px
          z-index : 10
          font-weight : 700
          background-color : #fff
          border-none()
        .text
          display : table-cell
          width : 56px
          text-align : center
          vertical-align : middle
          padding : 0 12px
          font-size : 12px
          .icon
            display : inline-block
            width : 12px
            height : 12px
            vertical-align : top
            background-size : 12px 12px
            background-repeat : no-repeat
            margin-right : 2px
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
    .foods-wrapper
      flex : 1
      .title
        line-height : 26px
        font-size : 12px
        border-left : 2px solid #d9dde1
        background-color : #F3F5F7
        padding-left : 14px
        color : rgb(147,153,159)
      .food-item
        display : flex
        margin : 18px
        padding-bottom : 18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          padding-bottom : 0
        .icon
          flex : 0 0 57px
          margin-right : 10px
        .content
          // position : relative
          flex : 1
          .name
            line-height : 14px
            font-size : 14px
            color : rgb(7,17,27)
            padding-top : 2px
          .desc, .extra
            line-height : 10px
            font-size : 10px
            color : rgb(147,153,159)
          .desc
            margin : 8px 0
            line-height : 12px
          .extra
            .count
              margin-right : 12px
          .price
            line-height : 24px
            font-weight : 700
            .new
              font-size : 14px
              color : rgb(240,20,20)
              margin-right : 8px
            .old
              font-size : 10px
              color : rgb(147,153,159)
              text-decoration : line-through
          .cartcontrol-wrapper
            position : absolute
            right : 0
            bottom : 12px
</style>
