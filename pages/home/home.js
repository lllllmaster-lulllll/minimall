// pages/home/home.js
import {
  getMultiData,
  getGoodsData
} from "../../service/home.js"

const types=['pop','new','sell']  
const TOP_DISTANCE=1

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    recommends:[],
    titles: ['流行', '新款', '精选'],
    goods:{
    'new': { page: 0, list: [] },
    'pop': { page: 0, list: [] },
    'sell': { page: 0, list: [] },
    },
    currentType:'pop',
    isShow:false,
    isTabFixed:false,
    tabScrollTop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 请求轮播图及推荐数据
    this._getMultipleData()
    // 请求商品数据
    this._getGoodsData('pop')
    this._getGoodsData('new')
    this._getGoodsData('sell')

  },
  onShow(){
    
    
  },
  // ------------------网络请求函数-----------------------------------
  _getMultipleData(){
    getMultiData().then(res => {
      console.log(res)
      const banners = res.data.data.banner.list;
      const recommends = res.data.data.recommend.list;
      this.setData({
        banners: banners,
        recommends: recommends
      })
    })
  },

  _getGoodsData(type){
    // 获取页码
    const page=this.data.goods[type].page+1
    
    // 请求数据
    getGoodsData(type,page).then(res=>{
      const list=res.data.data.list
      // 将数据设置到对应type的list中
      const oldList=this.data.goods[type].list
      oldList.push(...list)
      // this.data.goods[type].list.push(...list)
      // 将数据设置到data中的goods中
      const typeKey=`goods.${type}.list`
      const pageKey=`goods.${type}.page`
      this.setData({
        [typeKey]: oldList,
        [pageKey]: page
      })
    })

  },
  // ----------------------事件监听函数-------------------
  handleTabClick(event){
    // 取出index
    const index=event.detail.index
    console.log(index)
    // 设置currentType
    const type=types[index]
    this.setData({
      currentType:type
    })
  },
  onReachBottom(){
    this._getGoodsData(this.data.currentType)
  },
  onPageScroll(options){
    // 取出scrollTop
    const scrollTop=options.scrollTop

    // 修改showBackTop属性
    const flag1 = scrollTop >= TOP_DISTANCE
    if(flag1!=this.data.isShow){
      this.setData({
      isShow: flag1
      })

    }
    // 修改isTabFixed属性
    const flag2=scrollTop>=this.data.tabScrollTop
    if(flag2!=this.data.isTabFixed){
      this.setData({
        isTabFixed:flag2
      })
    }
  },
  handleImageLoad(){
    wx.createSelectorQuery().select('#tab-control').boundingClientRect(rect => {
      this.data.tabScrollTop = rect.top 
    }).exec()
    
    
  }
  
})