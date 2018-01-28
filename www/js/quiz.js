// This is a JavaScript file

//ページの初期化が完了したら実行される
$(function (){
    console.log("init!");
    selectQuizDB();

    //クイズを表示するイベントを登録
    //$(document.body).on('pageinit', '#answer_page', function() {refreshQuiz();});
    $(document.body).on('pageinit', '#answer_page', function() {getQuiz();});
    //クイズ作成ボタンを表示するイベトを登録
    //HTMLに記述したボタンはJSで操作できない
    $(document.body).on('pageinit', '#create_quiz_page', function() {displayButton();});
    $(document.body).on('pageinit', '#answer_page', function() {displayAnsButton();});

});

//クイズを検索する
var quizSize = 0;
var quizText = new Array();
var answer = new Array();
var options = new Array();
var setumei= new Array();

function selectQuizDB(){
    //クイズを検索するNCMB.Queryクラスのインスタンスを作成する
    var QuizClass = NCMB.Object.extend("Quiz");
    //var QuizClass = ncmb.DataStore("Quiz");
    var quizQuery = new NCMB.Query(QuizClass);
    //指定された条件に合致するクイズの件数を調べる
    quizQuery.count({
        success: function(count) {
            //登録されたクイズの数を保持する
            //QuizClass.count().fetchAll();
            console.log("count:" + count);
            quizSize = count;
        },
        error: function(error) {
            // エラー
            alert("error:" + error.message);
        }
    });
    //作成したクエリに条件を設定する
    quizQuery.skip(Math.floor(Math.random() * 30));
    quizQuery.limit(10);
    
    quizQuery.find({
        success: function (results){
            var idx;
            for (var i=0 ; i<10 ; i++){
                quizText[i] = results[i].get("quizText");
                answer[i] = results[i].get("answer");
                options[i] = results[i].get("options");
                setumei[i] = results[i].get("setumei");
            }
        },
        error: function (error){
            console.log("error:" + error.message);
        }
    });
}
//クイズを表示するメソッド
var indexQ=0;
var array = new Array();
function getQuiz(){
    var intQ ;
    intQ = indexQ+1;
    $("#question").text("第" + intQ + "問:" + quizText[indexQ]);
    //$("#question").show();
    //選択肢を表示する部分が見えるようにする
    $("#answer_options").show();
    $("#ans_button_area").show();
    $("#c_btn").show();

    $("#answer_result").hide();

    cur.first();
    //選択肢が入っている配列の末尾に正解を追加する
    console.log("insertQuiz"+options[indexQ]);
    var arryOpt = String(options[indexQ]);
    array = arryOpt.split(",");
    array[3] = answer[indexQ];
    
    //正解とダミーの選択肢をランダムに入れ替える
    var index = Math.floor(Math.random() * 3);
    var tmp = array[index];
    array[index] = array[3];
    array[3] = tmp;

    //正解を含んだ選択肢の配列を表示する
    for (var i = 0; i < 4; i++){
        $("#c"+i).text( "(" + (i+1) + "):" + array[i]);
        console.log(array[i]);
    }
    
    //選択肢がタッチされたときに正誤判定を行うため、正解を保持する
    answerText = answer[indexQ];
    setumeiText = setumei[indexQ];

    //ローカルテーブルから問題取得
    indexQ = indexQ + 1;
}

//ログイン済みかを確認する
    //画面遷移時のアニメーションを設定
function checkCurrentUser(){
    var options = {
        animation: 'lift', // アニメーションの種類
        onTransitionEnd: function() {} // アニメーションが完了した際によばれるコールバック
    };
    
    //if (NCMB.User.current()){
        //ログイン済みであればメニューの表示
        quizNavi.pushPage("menu.html", options);
    //} else {
        //未ログインの場合はログイン画面を表示
    //    quizNavi.pushPage("login.html", options)
    //}
}
var quizSize = 0;

//クイズ作成画面に登録ボタンを設置する
//var array ;
//クイズ回答画面にボタンを設置する
function displayAnsButton(){
    console.log("display2");
    var btn = $("<ons-button id='ans_quiz_button' modifier='large' onclick='answerQuiz()'>回答</ons-button>");
    btn.appendTo($("#ans_button_area"));
    ons.compile(btn[0]);
}

//クイズ画面をリフレッシュする
function refreshQuiz(){
    //$("#answer_options").html("");
    console.log("refreshQuiz");    
    selectQuiz();
    //displayAnsButton();
    console.log("refreshQuiz2");    
}

//連続正解数を保持するグローバル変数
var score = 0;
var kaisuu = 0;
//正誤判定を行う
    //選択肢を非表示にする
function answerQuiz(){
    //console.log("TEST");    
    
    var kotae ;
    console.log(array[cur.getActiveCarouselItemIndex()]);    

    kotae=array[cur.getActiveCarouselItemIndex()];

    $("#answer_options").hide();
    $("#ans_button_area").hide();
    $("#c_btn").hide();
    kaisuu++;

    $("#answer_result").show();

    if (answerText === kotae) {//selectedOptions) {
        //正解時に○を出す
        //$("#question").append("<br/><img id='I1' src='images/maru.png'><br/>" + (score+1) + "問正解中！<br/>"+ setumeiText +"<br/>");
        $("#answer_result").html("<p class='res'>アタリ</p>正解:<br/>"+ answerText + "<br/><br/>あなたの回答:<br/>" + kotae +"<br/><br/>" + (score+1) + "問正解中！<br/>"+ setumeiText +"<br/><br/>");
        
        //連続正解数を更新する
        score++;
    } else {
        //間違い時に×を出す
        //$("#question").append("<br/><img id='I1' src='images/batsu.png'><br/><br/>"+ setumeiText +"<br/>");
        $("#answer_result").html("<p class='res'>ハズレ</p>正解:<br/>"+ answerText + "<br/><br/>あなたの回答:<br/>" + kotae +"<br/><br/>" + "<br/>"+ setumeiText +"<br/><br/>");
        
        //間違い時に端末を振動させる
        //navigator.notification.vibrate(1000);
        console.log("端末を振動させる");
    }
    if (kaisuu > 9){
        $("#question").append("<br/>" + kaisuu + "問中"+ score +"正解！<br/>");
        var btn = $("<ons-button modifier='large' onclick='quizNavi.resetToPage(\"home.html\")'>メニューに戻る</ons-button>");
        //btn.appendTo($("#question"));
        btn.appendTo($("#answer_result"));

        ons.compile(btn[0]);
        selectQuizDB();
        kaisuu = 0;
        score=0;
        indexQ=0;
    } else {
//        var btn = $("<ons-button onclick='refreshQuiz()'>次の問題</ons-button>");

        var btn = $("<ons-button  modifier='large' onclick='getQuiz()'>次の問題</ons-button>");

        //btn.appendTo($("#question"));
        btn.appendTo($("#answer_result"));

        ons.compile(btn[0]);
    }        
}

function setCur(iSel){
    console.log("iSel=" + iSel);
    if (iSel==1){
        cur.first();
    }
    if (iSel==2){
        cur.setActiveCarouselItemIndex(1);;
    }
    if (iSel==3){
        cur.setActiveCarouselItemIndex(2);
    }

    if (iSel==4){
        cur.last();
    }

}

//mobile backendから取得したクイズの正解を保持する変数
var answerText = null;
var setumeiText = null;
