Component({
  properties: {
    getList: {
      type: Function,
      observer(fn) {
        this.getData = fn;
      }
    }
  },
  data: {
    page: 0,
    hasNext: true,
    page_size: 10,
    loading: false,
    origin: [],
    firstLoading: true
  },

  methods: {
    dispatch(e) {
      this.triggerEvent(e.detail.type, e.detail.data)
    },
    refresh() {
      if (this.data.loading) return;
      this.data.loading = true;
      let pageinfo = {
        page: this.data.page = 1,
        page_size: this.data.page_size
      }
      this.data.origin = [];

      this.getData(pageinfo).then((res) => {
        this.data.origin.push(...res.data.list);
        let isEmpty = this.data.origin.length == 0;
        this.setData({
          firstLoading: isEmpty,
          err: isEmpty ? {
            msg: '没有更多数据了',
            type: 'empty'
          } : null,
          origin: this.data.origin,
          hasNext: res.data.list.length == this.data.page_size
        });
        this.data.loading = false;
        wx.stopPullDownRefresh();
      }).catch((err) => {
        this.data.loading = false;
        this.setData({
          err,
          firstLoading: true
        });
        wx.stopPullDownRefresh();
      })
    },
    destory(e) {
      this.data.origin.splice(e.detail, 1);
      this.setData({
        origin: this.data.origin
      })
    },
    pull(isFirst) {
      if (this.data.loading || !this.data.hasNext) return;
      this.data.loading = true;
      let pageinfo = {
        page: ++this.data.page,
        page_size: this.data.page_size
      }
      this.getData(pageinfo).then((res) => {
        this.data.origin.push(...res.data.list);
        let data = {
          origin: this.data.origin,
          hasNext: res.data.list.length == this.data.page_size
        };
        this.setData(data);
        this.data.loading = false;
      }).catch((err) => {
        this.data.loading = false;
        if (isFirst) {
          this.setData({
            err
          });
        }
      })
    }
  },
  ready() {
    this.getData = this.data.getList;
    this.refresh();
  }
})