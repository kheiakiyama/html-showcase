html-showcase
=============

# HTML-ShowCase について

街で見かけるフライヤーのショーケースをHTMLで表現しました。
時間経過でコンテンツが切り替わる電子掲示板として利用できます。

# demo
デモは[コチラ](https://dl.dropboxusercontent.com/u/76767589/html-showcase/index.html)
デモ上のフライヤー画像は[コチラ](http://www.digitalroom.com/flyer-printing.html)を利用しています。

# code

HTML ShowCase は以下のライブラリを利用しています。

- jQuery
- [Slidy](http://www.w3.org/Talks/Tools/#slidy)

## example

```index.html
<link rel="stylesheet" href="./lib/html-showcase.css">
<link rel="stylesheet" href="./vendor/slidy.css">
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="./vendor/slidy.js"></script>
<script type="text/javascript" src="./lib/html-showcase.js"></script>
<script>
    var showcase = new ShowCase($("#showcase"), [
      { url: "test1.html", previewtime: "* * * * *" },
      { url: "test2.html", previewtime: "* 8-17 * * *" },
      { url: "test3.html", previewtime: "* 12,17 * * *" }
    ]);
</script>
```

## options
### url
表示するコンテンツです。
### previewtime
コンテンツを表示する時間帯です。
Cron のスケジュール記法とほぼ同じです。
default:"* * * * *"

```
var showcase = new ShowCase($("#showcase"), [
   { url: "test1.html", previewtime: "* * * * *" },
   { url: "test2.html", previewtime: "* 8-17 * * *" },//8〜17時台のみ表示
   { url: "test3.html", previewtime: "* 12,17 * * *" }//12,17時台のみ表示
]);
```

### reloadtime
コンテンツを再読み込みする時間（秒）です。
default:3600
### playtime
コンテンツを表示する時間（秒）です。
default:60
### priority
コンテンツを表示する優先度です。
数値が小さいほど優先して表示します。
default:100

```
var showcase = new ShowCase($("#showcase"), [
   { url: "test1.html", previewtime: "* 12 * * *", priority:10 },//12時台はこのコンテンツのみ表示
   { url: "test2.html", previewtime: "* 8-17 * * *" },//8〜17時台に表示（12時台を除く）
   { url: "test3.html", previewtime: "* * * * *" },12時台以外に表示
]);
```

