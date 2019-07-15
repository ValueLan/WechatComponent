import {
  qaLike,
  qaDelete
} from 'api'
Component({
  properties: {
    data: {
      type: Object,
      observer(o) {
        if (o.answer_type == 'image') {
          let imgReg = /<img.*?(?:>|\/>)/;
          let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
          let imgStr = o.answer.match(imgReg)[0];
          if (imgStr) {
            let src = imgStr.match(srcReg);
            if (src[1]) {
              this.setData({
                bitsrc: src[1]
              })
            }
          }
        }
      }
    },
    last: Boolean,
    index: Number
  },

  data: {
    showFixed: false
  },


  methods: {
    fixedChange() {
      this.setData({
        showFixed: !this.data.showFixed
      })
    },

    gotoDetail() {
      switch (this.data.data.tab) {
        case 'notreply':
        case 'rejected':
          break;
        default:
          wx.navigateTo({
            url: `/pages/interact/detail?id=${this.data.data.id}`
          })
      };
    },
    deleteData() {
      qaDelete({
        qa_id: this.data.data.id
      }).then(() => {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        this.triggerEvent('destory', this.data.index);
      }).catch((e) => {
        wx.showToast({
          title: e.msg,
          icon: 'none'
        })
      })
    },
    switchLike() {
      const {
        data
      } = this.data;
      if (data.qa_like_status == 1) return;
      qaLike({
        qa_id: this.data.data.id
      }).then(() => {
        data.qa_like_status = 1
        data.like_count++;
        this.setData({
          data: data
        })
      }).catch((e) => {
        wx.showToast({
          title: e.msg,
          icon: 'none'
        })
      });
    }
  },
  created() {

  }
})