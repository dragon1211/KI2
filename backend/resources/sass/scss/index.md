## TOC（目次）

```scss
/**
 * VARIABLE
 * global...サイト全体に使用するサイズや数値に関する変数です。
 * breakpoint...メディアクエリで使用するブレイクポイントです。
 * font-family...font-family指定をまとめています。
 * color...グローバルに使用する色指定です。
 * z-index...z-indexの並び順を管理します。
 * easing...cubic-bezier関数を使用したタイミング関数を定義しています。
 *
 * FUNCTION
 * strip-unit...pxやremなどの単位を取り除きます。
 * em...pxをemに変換します。
 * rem...pxをremに変換します。
 * tint...白色を加えて明度を明るくします。
 * shade...黒色を加えて明度を暗くします。
 * z-index...z-indexの並び順を管理します。
 * tracking...Photoshopのカーニングをemに変換します。
 *
 * MIXIN
 * mq-up...メディアクエリを`min-width`で挿入します。
 * mq-down...メディアクエリを`max-width`で挿入します。
 * responsive...レスポンシブ対応クラスを生成します。
 * clearfix...floatの解除をします。
 * on-event...:hover, :active, :focusをまとめて指定します。
 * sr-only...非表示にしてスクリーンリーダーにだけ読み上げさせます。
 *
 * BASE
 * normalize...Normalize.cssをインポートしています。
 * base...タイプセレクタと属性セレクタのデフォルトスタイルです。
 *
 * LAYOUT
 * header...ヘッダーエリアのコンテナブロックのスタイルです。
 * footer...フッターエリアのコンテナブロックのスタイルです。
 * main...コンテンツエリアのコンテナブロックのスタイルです。
 * side...サイドバーエリアのコンテナブロックのスタイルです。
 * section...`<section>`要素を使うようなセクションの余白を管理します。
 *
 * COMPONENT
 * wrapper...最大幅を指定します。
 * layout...汎用的なレイアウトオブジェクトです。グリッドレイアウトなどに使用できます。
 * media...画像とテキストが横並びになるオブジェクトです。
 * list-unstyled...`<ul>`と`<ol>`でデフォルトスタイルをリセットします。
 * embed...Youtubeなどをアスペクト比を固定してレスポンシブ対応させる場合に使用します。
 * table...tableのレイアウトアルゴリズムの変更、余白の変更をします。
 *
 * PROJECT
 * icon...アイコンフォントです。テンプレートから自動で生成されます。
 * icon-extend...アイコンフォントを拡張するModifierです。
 * button...ボタンコンポーネントです。
 * breadcrumb...パンくずリストコンポーネントです。
 * label...インラインのラベルコンポーネントです。
 * badge...投稿数のような数値を表示するバッジコンポーネントです。
 * card...カードタイプのコンポーネントです。
 * split...定義リストをブロックからインラインにするコンポーネントです。
 * notification...お知らせエリアのコンポーネントです。
 *
 * SCOPE
 * blog...ブログページのスタイルです。
 *
 * UTILITY
 * text...テキストのスタイルに関する汎用クラスです。
 * image...画像のレイアウトに関する汎用クラスです。
 * margin...マージンで余白の管理をします。常に下方向にだけ余白をとります。
 * display...要素の表示や改行をコントロールする場合に使用します。
 * width...おもにグリッドで使用する`width`を指定する汎用クラスです。
 * offset...おもにグリッドで使用する`margin-right`を指定する汎用クラスです。
 * percent...`width`プロパティを5%刻みで指定する汎用クラスです。
 */
```

## CSS構成

```scss
/**
 * このスタイルシートは[FLOCSS](https://github.com/hiloki/flocss)をベースにしています。
 * 定義されているレイヤー以外にもThemeやTestなどのレイヤーを追加することもできます。
 * 詳しくは[CSSコーディングルール](https://github.com/manabuyasuda/styleguide/blob/master/css-coding-rule.md#flocss)を参照してください。
 */

/* =============================================================================
   #Foundation
   ========================================================================== */
//
// Sassの変数と関数を定義します。
// 変数は用途ごとにモジュール化、関数は機能ごとにモジュール化をします。
// プレフィックス（接頭辞）として`_`をつけます。
//
@import "foundation/variable/_global";
@import "foundation/variable/_breakpoint";
@import "foundation/variable/_font-family";
@import "foundation/variable/_color";
@import "foundation/variable/_z-index";
@import "foundation/variable/_easing";

@import "foundation/function/_strip-unit";
@import "foundation/function/_em";
@import "foundation/function/_rem";
@import "foundation/function/_tint";
@import "foundation/function/_shade";
@import "foundation/function/_z-index";
@import "foundation/function/_tracking";

@import "foundation/mixin/_mq-up";
@import "foundation/mixin/_mq-down";
@import "foundation/mixin/_responsive";
@import "foundation/mixin/_clearfix";
@import "foundation/mixin/_on-event";
@import "foundation/mixin/_sr-only";

/**
 * Foundationレイヤーでは`html`や`body`のような広範囲にわたるベーススタイル、
 * `h2`や`ul`のような基本的なタイプセレクタのデフォルトスタイルを定義します。
 * 装飾的なスタイルは避けて、できる限り低詳細度に保ちます。idセレクタやclassセレクタは使用しません。
 */
@import "foundation/base/_normalize";
@import "foundation/base/_base";

/* =============================================================================
   #Layout
   ========================================================================== */
/**
 * Layoutレイヤーはヘッダーやフッターのような、ページを構成するコンテナブロックのスタイルを定義します。
 * 目安としてはワイヤーフレームに書かれるような大きな単位のブロックです。
 * 汎用性のあるグリッドシステムは次のObject/Componentレイヤーで定義します。
 * グローバルナビゲーションやコピーライトのようなコンポーネントは、Object/Projectレイヤーで定義します。
 * 基本的にはclass属性を使用しますが、id属性を使用することもできます。
 * プレフィックス（接頭辞）として`l-`をつけます。
 */
@import "layout/_header";
@import "layout/_footer";
@import "layout/_main";
@import "layout/_sidebar";
@import "layout/_section";

/* =============================================================================
   #Object
   ========================================================================== */
/**
 * Objectレイヤーはプロジェクトにおけるビジュアルパターンです。抽象度や詳細度、
 * 拡張性などによって、4つのレイヤーにわけられます。
 * それぞれのレイヤーにはプレフィックス（接頭辞）をつけます。
 * 1. Component（`c-`）
 * 2. Project（`p-`）
 * 3. Scope(`s-`)
 * 4. Utility（`u-`）
 *
 * ランディングページのようにページ特有のスタイルを多く含む場合は、
 * ページ専用のCSSファイルを作成することもできます。
 * ページ専用のスタイルは、そのページにだけ読み込ませることでスコープをつくり、
 * プレフィックス（接頭辞）をつけないことで名前の重複を防ぎます。
 */

/* -----------------------------------------------------------------------------
   #Component
   -------------------------------------------------------------------------- */
/**
 * Componentレイヤーは多くのプロジェクトで横断的に再利用のできるような、小さな単位のモジュール（機能）です。
 * OOCSSの構造（structure）の機能を担うため、装飾的なスタイルをできるだけ含めないようにします。
 * また、`width`や`margin`といったレイアウトに影響を与えるプロパティもできるだけ含めないようにします。
 * 例えばgridやmediaといったレイアウトパターンが該当します。
 * プレフィックス（接頭辞）として`c-`をつけます。
 */
@import "object/component/_wrapper";
@import "object/component/_layout";
@import "object/component/_media";
@import "object/component/_list-unstyled";
@import "object/component/_embed";
@import "object/component/_table";

/* -----------------------------------------------------------------------------
   #Project
   -------------------------------------------------------------------------- */
/**
 * Projectレイヤーはプロジェクト固有のパターンで、複数のページで使い回せるようなコンポーネントです。
 * 具体的なスタイルを持つUI（ユーザーフェイス）で、追加されるコンポーネントのほとんどはこのレイヤーに置かれます。
 * もし、このレイヤーで同じパターンが3箇所で使われていたら、別のコンポーネントとしてまとめられないか検討しましょう。
 * プレフィックス（接頭辞）として`p-`をつけます。
 */
@import "object/project/_icon";
@import "object/project/_icon-extend";
@import "object/project/_button";
@import "object/project/_breadcrumb";
@import "object/project/_label";
@import "object/project/_badge";
@import "object/project/_card";
@import "object/project/_split";

/* -----------------------------------------------------------------------------
   #Scope
   -------------------------------------------------------------------------- */
/**
 * ComponentレイヤーやProjectレイヤーのようなコンポーネント単位ではなく、
 * ページ単位や任意の範囲（スコープ）でのスタイルを定義します。1箇所でしか使わないような特異なスタイルや、
 * ページ単位でComponentやProjectレイヤーのスタイルを微調整したい場合に使用してもかまいません。
 * 例えばブログページのスタイルとして_blog.scssを作成します。
 * このレイヤーでは`.s-blog p`のような要素セレクタとの結合子も使うこともできます。
 * もし、このレイヤーで同じパターンが3箇所で使われていたら、
 * ProjectレイヤーやUtilityレイヤーでまとめられないか検討しましょう。
 * プレフィックス（接頭辞）として`s-`をつけます。
 */
@import "object/scope/_blog";

/* -----------------------------------------------------------------------------
   #Utility
   -------------------------------------------------------------------------- */
/**
 * Utilityレイヤーはいわゆる汎用クラスで、ほとんどの場合は単一のスタイルをもっています。
 * コンポーネント間の間隔を調整したり、BEMのModifierが増えすぎるのを防ぎます。
 * `.mb10`のような具体的な名前より`.mb-small`のような相対的な名前にしたり、
 * pxよりもemや%で指定することを推奨します。
 * 確実にスタイルを適応させるために`!important`を使用します。
 * プレフィックス（接頭辞）として`u-`をつけます。
 */
@import "object/utility/_text";
@import "object/utility/_image";
@import "object/utility/_margin";
@import "object/utility/_display";
@import "object/utility/_width";
@import "object/utility/_offset";
@import "object/utility/_percent";
```
