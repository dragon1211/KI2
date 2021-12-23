@component('mail::message')
# KIKIより本登録完了のお知らせ。

本登録が完了しました。
以下のURLからログインして下さい。

<a href="{{ $url }}" class="button button-primary" target="_blank" rel="noopener" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -webkit-text-size-adjust: none; border-radius: 4px; color: #fff; display: inline-block; overflow: hidden; text-decoration: none; background-color: #2d3748; border-bottom: 8px solid #2d3748; border-left: 18px solid #2d3748; border-right: 18px solid #2d3748; border-top: 8px solid #2d3748;">
    {{ $url }}
</a>

ログイン後ホームにブックマーク登録お願いします。
KIKI運営事務局
@endcomponent
