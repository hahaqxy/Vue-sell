<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="view-left">
          <div class="score">{{seller.score}}</div>
          <div class="score-title">综合评分</div>
          <div class="score-desc">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="view-right">
          <div class="rating-desc">
            <span class="text">商品评分</span>
            <star :size="size" :score="seller.score"></star>
            <span class="foodScore">{{seller.foodScore}}</span>
          </div>
          <div class="rating-desc">
            <span class="text">服务态度</span>
            <star :size="size" :score="seller.score"></star>
            <span class="serviceScore">{{seller.serviceScore}}</span>
          </div>
          <div class="deliveryTime">
            <span class="text">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :ratings="ratings" :selectType="selectType" :onlyContent="onlyContent"
      @changeSelectType='changeSelectType' @changeOnlyContent="changeOnlyContent"></ratingselect>
      <div class="ratings-wrapper">
        <ul class="ratings-list">
          <li class="rating-item border-1px" v-for="(rating, index) in newRatings"
           :key="index" v-show="!onlyContent || rating.text">
            <div class="avatar">
              <img :src="rating.avatar" />
            </div>
            <div class="content">
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <div class="username">{{rating.username}}</div>
              <div class="rating-star">
                <div class="star-component">
                  <star :size="24" :score="rating.score"></star>
                </div>
                <span class="deliveryTime">{{rating.deliveryTime}}<span v-show="rating.deliveryTime">分钟送达</span></span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span v-for="(item, index) in rating.recommend" :key="index" class="item">{{item}}</span>
                <!-- <ul class="recommend-list">
                  <li class="recommend-item" v-for="(item, index) in rating.recommend"
                  :key="index">
                    {{item}}
                  </li>
                </ul> -->
              </div>
            </div>
          </li>
        </ul>
        <div class="no-rating" v-if="!ratings.length">暂无评价</div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import BScroll from 'better-scroll'
  import { _formatDate } from '../../common/js/date.js'
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  import ratingselect from '../ratingselect/ratingselect.vue'

  const ALL = 2
  const POSITIVE = 0
  const NEGATIVE = 1

  export default {
    name: 'ratings',
    props: {},
    data() {
      return {
        seller: {},
        ratings: [],
        size: 36,
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      }
    },
    computed: {
      newRatings() {
        if (this.selectType === ALL) {
          return this.ratings
        } else if (this.selectType === POSITIVE) {
          let Ratings = []
          this.ratings.forEach((rating) => {
            if (rating.rateType === 0) {
              Ratings.push(rating)
            }
          })
          return Ratings
        } else {
          let Ratings = []
          this.ratings.forEach((rating) => {
            if (rating.rateType === 1) {
              Ratings.push(rating)
            }
          })
          return Ratings
        }
      }
    },
    methods: {
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
    created() {
      axios.get('/static/mock/data.json')
      .then((res) => {
        let data = res.data
        this.seller = data.seller
        this.ratings = data.ratings
      })
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        })
      })
    },
    components: {
      star,
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
  .ratings
    position : absolute
    top : 174px
    left : 0
    bottom : 0
    width : 100%
    overflow : hidden
    .overview
      display : flex
      padding : 18px 0
      .view-left
        flex : 0 0 137px
        width : 137px
        padding : 6px 0
        border-right : 1px solid rgba(7,17,27,0.1)
        // 为了适配iPhone5等小屏,使用@media query
        @media only screen and (max-width: 320px)
          flex : 0 0 120px
          width : 120px
        .score
          margin-bottom : 6px
          line-height : 28px
          font-size : 24px
          text-align : center
          color : rgb(255,153,0)
        .score-title
          line-height : 12px
          font-size : 12px
          text-align : center
          color : rgb(7,17,27)
        .score-desc
          margin : 8px 0 6px
          line-height : 10px
          text-align : center
          font-size : 10px
          color : rgba(7,17,27,0.3)
      .view-right
        flex : 1
        align-items : flex-start
        padding : 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left : 6px
        .rating-desc
          margin-bottom : 8px
          line-height : 18px
          font-size : 0
          color : rgb(7,17,27)
          .text
            font-size : 12px
            vertical-align : top
          .star
            display : inline-block
            margin : 0 12px
          .foodScore, .serviceScore
            font-size : 12px
            vertical-align : top
            color : rgb(255,153,0)
        .deliveryTime
          line-height : 18px
          font-size : 0
          .text
            font-size : 12px
            color : rgb(7,17,27)
            margin-right : 12px
          .time
            font-size : 12px
            color : rgb(147,153,159)
    .ratings-wrapper
      .ratings-list
        padding : 0 18px
        .rating-item
          display : flex
          padding : 18px 0
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
          .avatar
            img
              width : 28px
              height : 28px
              border-radius : 50%
              margin-right : 12px
          .content
            flex : 1
            position : relative
            .time
              position : absolute
              top : 0
              right : 0
              line-height : 12px
              font-size : 10px
              color : rgb(147,153,159)
            .username
              line-height : 12px
              font-size : 10px
              color : rgb(7,17,27)
              margin-bottom : 4px
            .rating-star
              font-size : 0
              .star-component
                display : inline-block
              .deliveryTime
                line-height : 12px
                margin-left : 6px
                vertical-align : top
                font-size : 10px
                color : rgb(147,153,149)
            .text
              margin : 6px 0 8px 0
              line-height : 18px
              font-size : 12px
              color : rgb(7,17,27)
            .recommend
              font-size : 0
              .icon-thumb_up
                display : inline-block
                margin-right : 8px
                vertical-align : top
                line-height : 16px
                font-size : 12px
                color : rgb(0,160,220)
              .item
                display : inline-block
                padding : 0 6px
                margin : 0 8px 4px 0
                line-height : 16px
                font-size 9px
                color : rgb(147,153,149)
                background-color : #fff
                border-radius : 1px
                border : 1px solid rgba(7,17,27,0.1)
      .no-rating
        padding: 16px 22px
        font-size: 12px
        color: rgb(147, 153, 159)
</style>
