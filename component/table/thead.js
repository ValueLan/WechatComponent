// miniprogram_npm/components/table/thead.js
Component({
  properties: {
    fixHeadWidth: Number
  },

  data: {

  },
  ready() {},
  methods: {
    setLeft(data) {
      this.setData({
        data: { ...this.data.data, ...data}
      })
    }
  }
})