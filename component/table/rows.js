Component({
  properties: {
    index: Number,
    data: {
      type: Object,
      observer(data) {
        if (this.notFirst) {
          this.syncUpdate();
        }
      }
    }
  },

  data: {
    height: undefined
  },

  ready() {
    this.query = wx.createSelectorQuery().in(this);
    this.rootBox = this.query.select('#rows-view');
    this.notFirst = false;
    this.syncUpdate()
  },
  methods: {
    syncUpdate(isFirst) {
      const fn = () => {
        this.notFirst = true;
        this.rootBox.boundingClientRect().exec((res) => {
          this.triggerEvent('sync', {
            index: this.data.index,
            height: res[0].height,
            payload: this.syncHeight,
            time: (new Date).valueOf() / 1000,
            target: this
          });
        });
      }
      if (this.notFirst) {
        return this.setData({
          height: ''
        }, () => {
          fn();
        })
      }
      fn();

    },
    syncHeight(height) {
      this.setData({
        height
      })
    }
  }
})