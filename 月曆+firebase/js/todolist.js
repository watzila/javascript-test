var db = new FirebaseDB();
var message = document.querySelector("#message");
var closeBTN = document.querySelector("#close");
var addForm = document.querySelector("#addForm");
var calendar = new Calendar({
  yearText: "#year",
  monthText: "#month",
  dateBody: "#date",
  previousBTN: "#previous",
  nextBTN: "#next",
  updateStatus: todolist
});

/**
 * 讀取備忘錄
 */
function todolist() {
  var { y, m, dateBTNs } = calendar;
  var todolistData = null;
  var currentDate = null;
  var index = 1;

  db.readData({ year: y, month: m + 1 }, readTodolist);//讀取firebase資料

  Object.keys(dateBTNs).map(function (key) {
    dateBTNs[key].onclick = function () {
      index = 1;
      currentDate = Number(dateBTNs[key].outerText);
      message.innerHTML = "";
      message.parentNode.parentNode.style.display = "block";

      todolistData.map(function (item, i) {
        if (item.year == y && item.date == dateBTNs[key].outerText) {
          var divEle = "<div style='--i:" + (0.1 * i) + "s'><span>" + (index++) + ".</span><p>" + item.msg + "</p><button class='removeBTN' value='" + item.id + "'>X</button></div>";
          message.innerHTML += divEle;
        }
      });
      var removeBTNs = message.querySelectorAll(".removeBTN");
      Object.keys(removeBTNs).map(function (key) {
        removeBTNs[key].onclick = function () {
          db.removeData(this.value);
          db.readData({ year: y, month: m + 1 }, updateMsg);//讀取firebase資料
        }
      });
    };

    addForm.onsubmit = function () {
      db.writeData({ year: calendar.y, month: calendar.m + 1, date: currentDate, msg: this.msg.value });
      this.msg.value = "";
      db.readData({ year: y, month: m + 1 }, updateMsg);//讀取firebase資料
    };
  });

  /**
   * 讀取firebase後執行(初始)
   * @method readTodolist
   * @param {Array} data firebase資料
   */
  function readTodolist(data) {
    todolistData = data;

    data.map(function (item) {
      Object.keys(dateBTNs).map(function (key) {
        if (dateBTNs[key].outerText == item.date) {
          if (!dateBTNs[key].nextSibling.querySelector("i")) {
            dateBTNs[key].nextSibling.innerHTML += "<i style='display:block;width:5px;height:5px;margin:auto;border-radius:50%;background-color:red;'></i>";
          }
        }
      });
    });
  }

  /**
   * 讀取firebase後執行(更新後)
   * @method readTodolist
   * @param {Array} data firebase資料
   */
  function updateMsg(data) {
    message.innerHTML = "";
    index = 1;

    data.map(function (item, i) {
      Object.keys(dateBTNs).map(function (key) {
        if (dateBTNs[key].outerText == item.date) {
          if (!dateBTNs[key].nextSibling.querySelector("i")) {
            dateBTNs[key].nextSibling.innerHTML += "<i style='display:block;width:5px;height:5px;margin:auto;border-radius:50%;background-color:red;'></i>";
          }
        }
      });

      if (item.year == y && item.date == currentDate) {
        var divEle = "<div style='--i:" + (0.1 * i) + "s'><span>" + (index++) + ".</span><p>" + item.msg + "</p><button class='removeBTN' value='" + item.id + "'>X</button></div>";
        message.innerHTML += divEle;
      }
    });
    var removeBTNs = message.querySelectorAll(".removeBTN");
    Object.keys(removeBTNs).map(function (key) {
      removeBTNs[key].onclick = function () {
        db.removeData(this.value);
        this.parentNode.remove();
      }
    });
  }
}

closeBTN.onclick = function () {
  message.parentNode.parentNode.style.display = "none";
};