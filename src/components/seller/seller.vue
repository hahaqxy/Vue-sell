<template>
	<div class="seller" ref="sellerContent">
		<div class="seller-wrapper">
			<div class="header">
        <div class="header-top border-1px">
          <h1 class="title">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="36" :score="seller.score"></star>
            <span class="ratingCount">(661)</span>
            <span class="sellCount">月售{{seller.sellCount}}单</span>
          </div>
        </div>
        <div class="delivery-info">
          <div class="desc">
            <div class="text">起送价</div>
            <div class="price">{{seller.minPrice}}<span>元</span></div>
          </div>
          <div class="desc">
            <div class="text">商家配送</div>
            <div class="price">{{seller.deliveryPrice}}<span>元</span></div>
          </div>
          <div class="desc">
            <div class="text">平均配送时间</div>
            <div class="price">{{seller.deliveryTime}}<span>分钟</span></div>
          </div>
        </div>
        <div class="collect" @click="toggleCollect">
          <span class="icon-favorite" :class="{'on': isCollect}"></span>
          <div class="text">{{text}}</div>
        </div>
      </div>
      <split></split>
      <div class="bulletin-content">
        <div class="bulletin-header border-1px">
          <h1 class="title">公告与活动</h1>
          <p class="text">{{seller.bulletin}}</p>
        </div>
        <ul class="supports-list">
          <li v-for="(support, index) in seller.supports" class="support border-1px">
            <span class="icon" :class="classMap[support.type]"></span>
            <span class="desc">{{support.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="seller-img">
        <h1 class="title">商家实景</h1>
        <div class="pics-wrapper" ref="picsContent">
          <ul class="pics-list" ref="picsList">
            <li class="pic" v-for="(pic, index) in seller.pics" :key="index">
              <img :src="pic" />
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="seller-info">
        <h1 class="title border-1px">商家信息</h1>
        <ul class="infos-list">
          <li v-for="(info, index) in seller.infos" :key="index" class="info border-1px">{{info}}</li>
        </ul>
      </div>
    </div>
	</div>
</template>

<script>
  import axios from 'axios'
  import BScroll from 'better-scroll'
  import { saveToLocal , loadFromLocal } from '../../common/js/store.js'
  import star from '../star/star.vue'
  import split from '../split/split.vue'

  export default {
    name: 'seller',
    props: {
      seller: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        isCollect: (() => {
          return loadFromLocal(this.seller.id, 'isCollect', false)
        })()
      }
    },
    computed: {
      text() {
        return this.isCollect === true ? '已收藏' : '收藏'
      }
    },
    methods: {
      toggleCollect() {
        this.isCollect = !this.isCollect
        saveToLocal(this.seller.id, 'isCollect', this.isCollect)
      }
    },
    mounted() {
      if (this.seller.pics) {
        let picWidth = 120
        let margin = 6
        let width = (picWidth + margin) * this.seller.pics.length - margin
        this.$refs.picsList.style.width = width + 'px'
      }
      this.$nextTick(() => {
        if (!this.scroll || !this.scroll2) {
          this.scroll = new BScroll(this.$refs.sellerContent, {
            click: true
          })
          this.scroll2 = new BScroll(this.$refs.picsContent, {
            scrollX: true,
            eventPassthrough: 'verical'
          })
        } else {
          this.scroll.refresh()
          this.scroll2.refresh()
        }
      })
    },
    components: {
      star,
      split
    }
  }
</script>

<style scoped lang="stylus">
  @import '../../common/stylus/index.styl'
  .seller
    position : absolute
    top : 174px
    left : 0
    bottom : 0
    width : 100%
    overflow : hidden
    .seller-wrapper
      .header
        position : relative
        padding-top : 18px
        .header-top
          margin : 0 18px
          padding : 0 0 18px
          border-1px(rgba(7,17,27,0.1))
          .title
            line-height : 14px
            font-size : 14px
            color : rgb(7,17,27)
            margin-bottom : 8px
          .star-wrapper
            font-size : 0
            .star
              display : inline-block
              vertical-align : top
            .ratingCount, .sellCount
              line-height : 18px
              font-size : 10px
              color : rgb(77,85,93)
            .ratingCount
              margin : 0 12px 0 8px
        .delivery-info
          display : flex
          padding : 18px 0
          .desc
            flex : 1
            text-align : center
            border-right : 1px solid rgba(7,17,27,0.1)
            .text
              line-height : 10px
              font-size : 10px
              color : rgb(147,153,159)
              margin-bottom : 4px
            .price
              line-height : 24px
              font-size : 24px
              font-weight : 200
              color : rgb(7,17,27)
              span
                padding-left : 2px
                line-height : 10px
                font-size : 10px
                color : rgb(147,153,159)
        .collect
            position : absolute
            width : 50px
            top : 18px
            right : 11px
            text-align : center
            .icon-favorite
              line-height : 24px
              font-size : 24px
              color : #d4d6d9
              &.on
                color : rgb(240,20,20)
            .text
              margin-top : 4px
              line-height : 10px
              font-size : 10px
              color : rgb(77,85,93)
      .bulletin-content
        padding : 18px 18px 0
        .bulletin-header
          padding-bottom : 16px
          border-1px(rgba(7,17,27,0.1))
          .title
            line-height : 14px
            font-size : 14px
            color : rgb(7,17,27)
            margin-bottom : 8px
          .text
            padding : 0 12px
            line-height : 24px
            font-size : 12px
            color : rgb(240,20,20)
        .supports-list
          .support
            padding : 16px 12px
            font-size : 0
            border-1px(rgba(7,17,27,0.1))
            &:last-child
              border-none()
            .icon
              display : inline-block
              width : 16px
              height : 16px
              vertical-align : top
              margin-right : 6px
              background-size : 16px 16px
              background-repeat : no-repeat
              &.decrease
                bg-image('decrease_4')
              &.discount
                bg-image('discount_4')
              &.special
                bg-image('special_4')
              &.invoice
                bg-image('invoice_4')
              &.guarantee
                bg-image('guarantee_4')
            .desc
              line-height : 16px
              font-size : 12px
              color: rgb(7,17,27)
      .seller-img
        padding : 18px
        .title
          line-height : 14px
          font-size : 14px
          color : rgb(7,17,27)
          padding-bottom : 12px
        .pics-wrapper
          width : 100%
          overflow : hidden
          white-space : nowrap
          .pics-list
            font-size : 0
            // width : 500px
            // height : 90px
            // overflow-x: auto
            // overflow : hidden
            .pic
              // float : left
              display : inline-block
              width : 120px
              height : 90px
              margin-right : 6px
              &:last-child
                margin-right : 0
              img
                width : 120px
                height : 90px
      .seller-info
        padding : 18px 18px 0
        .title
          line-height : 14px
          font-size : 14px
          color : rgb(7,17,27)
          padding-bottom : 12px
          border-1px(rgba(7,17,27,0.1))
        .infos-list
          .info
            padding : 16px 12px
            line-height : 16px
            font-size : 12px
            color : rgb(7,17,27)
            border-1px(rgba(7,17,27,0.1))
            &:last-child
              border-none()
</style>
