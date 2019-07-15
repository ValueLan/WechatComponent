Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    styles: {
      type: String
    },
    show: {
      type: Boolean,
      value: false
    }
  },
  data: {
    fullHeight: 0,
    originHeight: 0,
    status: 0 // 0: 加载最小高 1: 加载最大高 2:加载完成
  },
  methods: {
    async initHeight() {
      if (this.data.status != 0) {
        await new Promise((reslove) => {
          this.setData({
            status: 0
          }, () => {
            reslove();
          });
        })
      }
      await new Promise((reslove) => {
        wx.createSelectorQuery().in(this).select('#animate-box').boundingClientRect((res) => {
          this.setData({
            status: 1,
            originHeight: res.height
          }, () => {
            reslove();
          });
        }).exec();
      });

      wx.createSelectorQuery().in(this).select('#animate-box').boundingClientRect((res) => {
        this.setData({
          fullHeight: res.height,
          status: 2
        });
      }).exec();
    },
  },
  ready() {
    this.initHeight()
  }
})