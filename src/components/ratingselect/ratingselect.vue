<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block all" :class="{'active': selectType === 2}" @click="handleSelectType(2)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="{'active': selectType === 0}" @click="handleSelectType(0)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span class="block negative" :class="{'active': selectType === 1}" @click="handleSelectType(1)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" @click="toggleOnlyContent">
      <span class="icon-check_circle" :class="{'active': onlyContent}"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2
  export default {
    name: 'ratingselect',
    props: {
      ratings: {
        type: Array,
        default() {
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    },
    methods: {
      handleSelectType(arg) {
        this.$emit('changeSelectType',arg)
      },
      toggleOnlyContent() {
        this.$emit('changeOnlyContent')
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../../common/stylus/index.styl'
  .rating-type
    margin : 0 18px
    padding : 18px 0
    border-1px(rgba(7,17,27,0.1))
    font-size : 0
    .block
      display : inline-block
      padding : 8px 12px
      margin-right : 8px
      line-height : 16px
      font-size : 12px
      border-radius : 1px
      color : rgb(77,85,93)
      .count
        margin-left : 3px
        font-size : 8px
      &.all
        background-color : rgba(0,160,220,0.2)
        &.active
          background-color : rgb(0,160,220)
          color : #fff
      &.positive
        background-color : rgba(0,160,220,0.2)
        &.active
          background-color : rgb(0,160,220)
          color : #fff
      &.negative
        background-color : rgba(77,85,93,0.2)
        &.active
          background-color : rgb(77,85,93)
          color : #fff
  .switch
    padding : 12px 18px
    line-height : 24px
    font-size : 0
    color : rgb(147,153,159)
    border-bottom : 1px solid rgba(7,17,27,0.1)
    .icon-check_circle
      margin-right : 4px
      font-size : 24px
      vertical-align : middle
      &.active
        color : #00c850
    .text
      font-size : 12px
      vertical-align : middle
</style>
