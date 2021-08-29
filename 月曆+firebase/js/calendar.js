; (function () {
  "use strict";
  /**
   * 月曆
   * @method Calendar
   * @constructs
   * @param{{yearText:Element,monthText:Element,dateBody:Element,previousBTN:Element,nextBTN:Element,updateStatus?:function}} obj {yearText:年元素,monthText:月元素,dateBody:放置日期元素,previousBTN:上個月按鈕元素,nextBTN:下個月按鈕元素,updateStatus?:日期更新後執行的函式}
   */
  var Calendar = function (obj) {
    if (obj == undefined) return;
    if (!(this instanceof Calendar)) return new Calendar(obj);
    this.monthName = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    this.date = new Date();
    this.y = 0; //年
    this.m = 0; //月
    this.d = 0; //日
    this.dd = 0; //星期
    this.currentY = document.querySelector(obj.yearText) || document; //年元素
    this.currentM = document.querySelector(obj.monthText) || document; //月元素
    this.dateBody = document.querySelector(obj.dateBody) || document; //日期父元素
    this.previousBTN = document.querySelector(obj.previousBTN) || document; //上一個按鈕元素
    this.nextBTN = document.querySelector(obj.nextBTN) || document; //下一個按鈕元素
    this.dateBTNs = null;//日期按鈕
    this.updateStatus = obj.updateStatus || function () { };//日曆更新後須執行的函式

    /**
     * 初始化
     * @method init
     */
    this.init = function () {
      this.y = this.date.getFullYear();
      this.m = this.date.getMonth();
      this.d = this.date.getDate();
      this.dd = this.date.getDay();
      if (this.currentY != document) {
        this.currentY.innerText = this.y;
      }
      if (this.currentM != document) {
        this.currentM.innerText = this.monthName[this.m];
      }
      this.createDate();
    };

    /**
     * 創建日期
     * @method createDate
     */
    this.createDate = function () {
      if (this.dateBody == document) return;
      this.dateBody.innerHTML = "";
      var d = new Date(this.y, this.m, 1);
      var firstDay = d.getDay();
      d.setMonth(this.m + 1);
      d.setDate(0);
      var lastDate = d.getDate();
      var date = 1;

      for (var i = 0; i < 42; i += 7) {
        var trEle = document.createElement("tr");
        trEle.className = "oneWeek";
        for (var j = 0; j < 7; j++) {
          if (date > lastDate) {
            trEle.innerHTML += "<td><button></button><div style='margin-top:5px;'></div></td>";
          } else if (j < firstDay && i == 0) {
            trEle.innerHTML += "<td><button></button><div style='margin-top:5px;'></div></td>";
          } else {
            if (date == this.d) {
              trEle.innerHTML += "<td style='--i:" + date * 0.02 + "s'><button class='active'>" + (date++) + "</button><div style='margin-top:5px;'></div></td>";
            } else {
              trEle.innerHTML += "<td style='--i:" + (date * 0.02) + "s'><button>" + (date++) + "</button><div style='margin-top:5px;'></div></td>";
            }
          }
        }
        this.dateBody.append(trEle);
      }
      this.dateBTNs = this.dateBody.querySelectorAll(".oneWeek>td>button");
      this.updateStatus();
    };

    /**
     * 下個月按鈕事件
     * @method nextMonth
     */
    this.nextMonth = function () {
      this.date.setMonth(this.m + 1);
      this.init();
    };

    /**
     * 上個月按鈕事件
     * @method previousMonth
     */
    this.previousMonth = function () {
      this.date.setMonth(this.m - 1);
      this.init();
    };

    /**
     * 加入按鈕事件
     * @method addEvent
     */
    this.addEvent = function () {
      var that = this;
      if (this.previousBTN != document) {
        this.previousBTN.onclick = this.previousMonth.bind(this);
      }
      if (this.nextBTN != document) {
        this.nextBTN.onclick = this.nextMonth.bind(this);
      }
      if (this.currentY != document) {
        this.currentY.ondblclick = function () {
          this.innerHTML = "<input type='text' placeholder='2021'/>";
          this.children[0].focus();

          this.children[0].onblur = function () {
            if (this.value == "" || isNaN(Number(this.value)) || this.value < "1900") {
              this.value = that.y;
            }
            that.date.setFullYear(this.value);
            that.init();
          };
        };
      }
    };

    this.init();
    this.addEvent();
  };

  window.Calendar = Calendar;
})();