<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="foodContent">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" />
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sellCount">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="new">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count" @click.stop.prevent="addList">加入购物车</div>
          </transition>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
        </div>
        <split v-show="food.info"></split>
        <div class="food-introduce" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="info">{{food.info}}</p>
        </div>
        <split></split>
        <div class="ratings">
          <h1 class="title">商品评价</h1>
          <ratingselect :ratings="food.ratings" :selectType="selectType"
          :onlyContent="onlyContent" :desc="desc"
           @changeSelectType='changeSelectType' @changeOnlyContent="changeOnlyContent"></ratingselect>
          <div class="ratings-wrapper">
            <ul class="ratings-list" v-show="food.ratings && food.ratings.length">
              <li class="rating-item border-1px" v-for="(rating, index) in ratings" :key="index" v-if="onlyContent ? rating.text : true">
                <div class="rating-header">
                  <div class="time">{{rating.rateTime | formatDate}}</div>
                  <div class="user">
                    <span class="username">{{rating.username}}</span>
                    <img :src="rating.avatar" />
                  </div>
                </div>
                <div class="rating-content">
                  <span class="thumb-icon" :class="rating.rateType === 0 ? 'icon-thumb_up' : 'icon-thumb_down'"></span>
                  <span v-show="rating.text" class="text">{{rating.text}}</span>
                </div>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Vue from 'vue'
  import BScroll from 'better-scroll'
  import { _formatDate } from '../../common/js/date.js'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'

  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2

  export default {
    name: 'food',
    props: {
      food: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    computed: {
      ratings() {
        if (this.selectType === ALL) {
          return this.food.ratings
        } else if (this.selectType === POSITIVE) {
          let newRatings = []
          this.food.ratings.forEach((rating) => {
            if (rating.rateType === 0) {
              newRatings.push(rating)
            }
          })
          return newRatings
        } else {
          let newRatings = []
          this.food.ratings.forEach((rating) => {
            if (rating.rateType === 1) {
              newRatings.push(rating)
            }
          })
          return newRatings
        }
      }
    },
    methods: {
      show() {
        this.showFlag = true
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.foodContent, {
            click: true
          })
        })
      },
      hide() {
        this.showFlag = false
      },
      addList() {
        if(this.food.count === 0) {
          this.food.count = 1
        } else {
          Vue.set(this.food, 'count', 1)
        }
      },
      changeSelectType(arg) {
        this.selectType = arg
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      changeOnlyContent() {
        this.onlyContent = !this.onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    },
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return _formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../../common/stylus/index.styl'
  .food
    position : fixed
    top : 0
    left : 0
    bottom : 48px
    z-index : 30
    width : 100%
    background : #fff
    &.move-enter, &.move-leave-to
      transform : translate3d(100%,0,0)
    &.move-enter-active, &.move-leave-active
      transition : all 0.2s linear
    .image-header
      position : relative
      width : 100%
      height : 0
      padding-bottom : 100%
      img
        position : absolute
        top : 0
        left : 0
        width : 100%
        height : 100%
      .back
        position : absolute
        top : 10px
        left : 0
        .icon-arrow_lift
          display : block
          padding : 10px
          font-size : 20px
          color : #FFFFFF
    .content
      position : relative
      padding : 18px
      .title
        line-height : 14px
        margin-bottom : 8px
        font-size : 14px
        font-weight : 700
        color : rgb(7,17,27)
      .detail
        line-height : 10px
        font-size : 0
        margin-bottom : 18px
        color : rgb(147,153,159)
        .sellCount
          font-size : 10px
          padding-right : 12px
        .rating
          font-size : 10px
      .price
        line-height : 24px
        font-weight : 700
        .new
          font-size : 14px
          color : rgb(240,20,20)
        .old
          font-size : 12px
          color : rgb(147,153,159)
          text-decoration : line-through
      .buy
        position : absolute
        right : 18px
        bottom : 18px
        z-index : 30
        padding : 6px 12px
        line-height : 12px
        font-size : 10px
        color : #FFFFFF
        border-radius : 12px
        background-color : rgb(0,160,220)
        &.fade-enter, &.fade-leave-to
          opacity : 0
        &.fade-enter-active, &.fade-leave-active
          transition : opacity 0.2s
      .cartcontrol-wrapper
        position : absolute
        right : 12px
        bottom : 12px
        z-index : 20
    .food-introduce
      padding : 18px
      .title
        margin-bottom : 12px
        line-height : 14px
        font-size : 14px
        font-weight : 500
        color : rgb(7,17,27)
      .info
        padding : 0 8px
        line-height : 24px
        font-size : 12px
        color : rgb(77,85,93)
    .ratings
      padding : 18px 0
      .title
        line-height : 14px
        margin 0 18px
        font-size : 14px
        font-weight : 500
        color : rgb(7,17,27)
      .ratings-wrapper
        .ratings-list
          padding : 0 18px
          .rating-item
            padding : 16px 0
            border-1px(rgba(7,17,27,0.1))
            &:last-child
              border-none()
            .rating-header
              height : 12px
              line-height : 12px
              font-size : 10px
              color : rgb(147,153,159)
              margin-bottom : 6px
              .time
                float : left
              .user
                float : right
                font-size : 0
                .username
                  font-size : 10px
                  margin-right : 6px
                  vertical-align : top
                img
                  width : 12px
                  height : 12px
                  border-radius : 50%
            .rating-content
              font-size : 0
              .thumb-icon
                line-height : 24px
                font-size : 12px
                color : rgb(147,153,159)
                margin-right : 4px
                &.icon-thumb_up
                  color : rgb(0,160,220)
              .text
                line-height : 16px
                font-size : 12px
                color : rgb(7,17,27)
        .no-rating
          padding: 16px
          font-size: 12px
          color: rgb(147, 153, 159)
</style>
