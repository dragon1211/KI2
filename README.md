# kikikanri
危機管理クラウドアプリ



# 開発環境構築手順
#### １．Docker立ち上げ
```
docker-compose up -d
```

#### ２．appに入る
```
docker-compose exec app bash
```

#### ３．各種インストール
```
npm install
composer install
```

#### ４．npm実行
```
cp .env.example .env
php artisan key:generate
npm run watch　(　npm run dev　)
```

#### ５．DB接続
```
php artisan migrate:fresh --seed
```

#### ６．ストレージのリンク
```
php artisan storage:link
```



# 仕様書
#### ■ 基本情報
https://docs.google.com/spreadsheets/d/1_S9Hbrf3XZcLXBrnTqxTusuoO5_9dmAooTQ2EGsR7mo/edit?usp=sharing

#### ■ フロントエンド
https://docs.google.com/spreadsheets/d/14wR8VARy5geANyMcaXGANRfmBjXs8hZp3O-pFYbzUXo/edit?usp=sharing

#### ■ バックエンド
https://docs.google.com/spreadsheets/d/1UYafqtgnrRErS_O3vWLAHb_UsTO14VOpdqZ07ActeZM/edit?usp=sharing

#### ■ DB
https://docs.google.com/spreadsheets/d/1RBd-o9d_aLiRsopX4rxdgRTo9aPUtrZbLauN7RtLYek/edit?usp=sharing

#### デザイン
https://xd.adobe.com/view/d692dfcb-15f6-4444-9c48-2bbab7b06979-83c1/
