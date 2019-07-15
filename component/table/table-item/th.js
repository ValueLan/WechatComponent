Component({
  properties: {
    data: Object,
    sort: Object,
    dispatchEvent: {
      type: Function
    }
  },
  methods: {
    changeCheck() {
      this.data.dispatchEvent("checkchange", {
        data: this.data,
        exec: () => {
          this.data.data.check.value = !this.data.data.check.value;
          this.setData({
            data: this.data.data
          });
        }
      })
    },
    sortChange() {
      if (!this.data.data.sort) return;
      this.data.dispatchEvent("sortChange", {
        data: this.data,
        exec: (union = true, callback) => {
          let sort = this.data.sort || {};
          if (sort[this.data.data.key] == 'desc') {
            sort[this.data.data.key] = 'asc'
          } else {
            sort[this.data.data.key] = 'desc'
          }

          this.triggerEvent('sortchange', { name: this.data.data.key, value: sort[this.data.data.key], callback, union});
          this.setData({
            sort
          });
        }
      })
    }
  }
})