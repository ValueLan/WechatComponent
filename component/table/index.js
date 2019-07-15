Component({
  properties: {
    data: {
      type: Array
    },
    column: {
      type: Array,
      observer(data, old) {
        this.resetHead(data);
      }
    },
    sort: {
      type: Object
    }
  },

  data: {
    fixed: false,
    scrollLeft: 0,
    fixedColumn: [],
    normalColumn: [],
    recordRow: {},
    fixHeadWidth: undefined
  },

  created() {
    this.setData({
      dispatchEvent: (type, ...arg) => {
        this.triggerEvent(type, arg)
      }
    })
  },
  ready() {
    this.thead = this.selectComponent('#thead')
    let selectorQuery = wx.createSelectorQuery().in(this);
    selectorQuery.selectAll('#scroll-head-item').boundingClientRect().exec((res) => {
      let fixHeadWidth = res[0].reduce((pre, now) => {
        return pre + now.width
      }, 0);
      this.setData({
        fixHeadWidth
      });
    });
  },
  methods: {
    resetHead(column) {
      let fixedColumn = [];
      let normalColumn = [];

      column.map((item) => {
        if (item.fixed) {
          fixedColumn.push(item);
        } else {
          normalColumn.push(item);
        }
      });
      this.setData({
        fixedColumn,
        normalColumn
      })
    },
    sortchange(e) {
      const {
        callback,
        name,
        value,
        union
      } = e.detail;
      let nowOrder = value == 'asc';
      let orderDiff = nowOrder ? 1 : -1;
      let data = this.data.data.sort((prev, next) => {
        if (callback) return callback(prev, next, this.data.data, name, orderDiff);
        if (prev[name] > next[name]) return 1 * orderDiff
        if (prev[name] < next[name]) return -1 * orderDiff
        return 0;
      })

      this.setData({
        data: data
      })
    },
    updateRows(e) {
      let curr = e.detail;
      let prev = this.data.recordRow[curr.index]
      if (!prev || curr.target == prev.target || Math.abs(prev.time - curr.time) > 1) {
        this.data.recordRow[curr.index] = curr;
        return;
      }

      if (prev.height == curr.height) return;
      if (prev.height > curr.height) return curr.payload.call(curr.target, prev.height);

      prev.payload.call(prev.target, curr.height);
    },
    getRect() {
      if (this.tableTop) return;
      this.query = wx.createSelectorQuery().in(this);
      this.rootBox = this.query.select('#root-box');
      this.rootBox.boundingClientRect()
      this.query.selectViewport().scrollOffset()
      this.getRectPromise = new Promise((resolve) => {
        this.query.exec((res) => {
          this.tableTop = res[0].top + res[1].scrollTop
          resolve();
        })
      })
    },
    scrollView(e) {
      if (this.data.fixed) {
        this.thead.setLeft({
          scrollLeft: e.detail.scrollLeft
        });
      }
      this.data.scrollLeft = e.detail.scrollLeft;
    },
    async scrollEvent(data) {
      await this.getRect();
      if (this.tableTop <= data.scrollTop && !this.data.fixed) {
        this.setData({
          fixed: true,
          scrollLeft: this.data.scrollLeft
        })
        this.thead.setLeft({
          fixed: true,
          scrollLeft: this.data.scrollLeft
        });
        return;
      }
      if (this.tableTop > data.scrollTop && this.data.fixed) {
        this.setData({
          fixed: false
        })
        this.thead.setLeft({
          fixed: false
        });
      }
    }
  }
})