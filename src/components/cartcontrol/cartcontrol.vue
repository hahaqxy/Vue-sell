<template>
  <div class="cartcontrol">
    <div class="cart-decreace icon-remove_circle_outline"
     v-show="this.food.count > 0" @click.stop.prevent="decreaceCart">
    </div>
    <div class="cart-count" v-show="this.food.count > 0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    name: 'cartcontrol',
    props: {
      food: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    methods: {
      addCart() {
        if(!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count ++
        }
        this.$emit('add', event.target);
      },
      decreaceCart() {
        if(this.food.count > 0) {
          this.food.count --
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '../../common/stylus/index.styl'
  .cartcontrol
    font-size : 0
    .cart-decreace, .cart-add
      display : inline-block
      padding : 6px
      line-height : 24px
      font-size : 24px
      color : rgb(0,160,220)
    .cart-count
      display : inline-block
      line-height : 24px
      vertical-align : top
      font-size : 10px
      padding : 6px 0
      color : rgb(147,153,159)
</style>
