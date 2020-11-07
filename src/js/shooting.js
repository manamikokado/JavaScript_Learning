"use strict"

// 全体で使用する変数を定義
let canvas, ctx;
// FPS管理に使用するパラメータを定義
let FPS = 30;
let MSPF = 1000 / FPS;
// キー状態管理変数の定義（256以上のキーコードは無い…はず）
let KEYS = new Array(256);
// キーの状態を false （押されていない）で初期化
for (let i = 0; i < KEYS.length; i++) {
    KEYS[i] = false;
}

const ENEMIES = 10;
let img_player;
let img_enemy;
let player_x, player_y;

// enemyの現在位置（配列）を保持する変数を定義し
// ENEMIES分だけ要素数を持つ配列を代入
let enemies_x = new Array(ENEMIES);
let enemies_y = new Array(ENEMIES);

// 再描画用関数
const redraw = function () {
    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 新しい位置にプレイヤーを配置
    ctx.drawImage(img_player, player_x, player_y);
    // enemy画像を(img_enemy, enemies_x[i], enemies_y[i])の位置に表示
    for (let i = 0; i < ENEMIES; i++) {
        ctx.drawImage(img_enemy, enemies_x[i], enemies_y[i]);
    }
}

const movePlayer = function () {
    // 上下左右の移動速度を定義
    const SPEED = 2;

    // キー番号だとわかりにくいため予め変数に格納
    const RIGHT =  39;
    const LEFT = 37;

    // 左右の移動処理を定義（canvasの内側の場合）
    if (KEYS[RIGHT] && player_x + img_player.width < canvas.width) {
        player_x += SPEED;
    }
    if (KEYS[LEFT] && player_x > 0) {
        player_x -= SPEED;
    }

    // プレイヤーがはみ出してしまった場合は強制的に中に戻す
    if (player_x < 0) {
        player_x = 0;
    } else if (player_x + img_player.width > canvas.width) {
        player_x = canvas.width - img_player.width;
    }
}

const moveEnemies = function (e) {
    const SPEED = 2;

    // 各敵キャラごとに処理を行う
    for (let i = 0; i < ENEMIES; i++) {
        // 敵キャラのｙ座標を少し増やす
        enemies_y[i] += SPEED;

        // 敵キャラが下画面にはみ出した場合は上に戻す
        if (enemies_y[i] > canvas.height) {
            enemies_y[i] = -img_enemy.height;
            // せっかくなので x座標を再度ランダムに設定
            enemies_x[i] = Math.random() * (canvas.width - img_enemy.width);
        }
    }
}


// メインループを定義
const mainloop = function () {
    // 処理開始時間を保存
    let startTime = new Date();
    
    // プレイヤーの移動処理
    movePlayer();

    // 敵キャラの移動処理
    moveEnemies();

    // 描画処理
    redraw();

    // 処理経過時間および次のループまでの間隔を計算
    let deltaTime = (new Date()) - startTime;
    let interval = MSPF - deltaTime;
    if (interval > 0) {
        // 処理が早すぎるので次のループまで少し待つ
        setTimeout(mainloop, interval)
    } else {
        // 処理が遅すぎるので即時次のループを実行する
        mainloop();
    }

}

// キーが押された時に呼び出される処理を指定
window.onkeydown = function (e) {
    KEYS[e.keyCode] = true;
}
// キーが離された時に呼び出される処理を指定
window.onkeyup = function (e) {
    KEYS[e.keyCode] = false;
}


// ページロード時に呼び出される処理を指定
window.onload = function () {
    canvas = document.getElementById('screen');
    ctx = canvas.getContext('2d');
    img_player = document.getElementById('player');
    img_enemy = document.getElementById('enemy');
    
    // Playerの初期値を指定
    player_x = (canvas.width - player.width) / 2; // 左右中央
    player_y = (canvas.height - player.height) - 20; // 底から20px上

    // Enemyの初期値を指定
    for (let i = 0; i < ENEMIES; i++) {
        enemies_x[i] = Math.random() * (canvas.width - img_enemy.width);
        enemies_y[i] = Math.random() * (canvas.height - img_enemy.height);
    }

    // 描画する
    redraw();

    // メインループを呼び出し
    mainloop();
}