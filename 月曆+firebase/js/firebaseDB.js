/**
       * firebase連線
       * @constructs
       */
function FirebaseDB() {
  var firebaseConfig = {
    projectId: "todolist-4eb21"
  }
  firebase.initializeApp(firebaseConfig);

  this.database = firebase.firestore();
  this.ref = this.database.collection("message");
}

/**
 * 讀取資料
 * @method readData
 * @param{{year:number,month:number}} t {year:年,month:月}
 * @param{Function} read callback
 */
FirebaseDB.prototype.readData = function (t, read) {
  var d = [];

  if (t.year !== undefined && !isNaN(t.month)) {
    this.ref.where("year", "==", t.year).where("month", "==", t.month).get().then(function (result) {
      result.forEach(function (item) {
        var id = item.id;
        var { year, month, date, msg } = item.data();

        d.push({ id, year, month, date, msg });
      });

      read(d);
    });
  }
};

/**
 * 寫入資料
 * @method writeData
 * @param{{year:number,month:number,date:number,msg:string}} data {year:年,month:月,date:日,msg:訊息}
 */
FirebaseDB.prototype.writeData = function (data) {
  this.ref.add(data).then(function () {
    console.log("ok");
  });
};

/**
 * 刪除資料
 * @method removeData
 * @param{String} key 資料ID
 */
FirebaseDB.prototype.removeData = function (key) {
  this.ref.doc(key).delete().then(function () {
    console.log("ok");
  });
};