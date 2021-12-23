@component('mail::message')
# 【KIKI】会員登録のご案内

KIKIサービスの会員登録のご案内です。

KIKIシステムのご利用ありがとうございます。

下記URLにアクセスし、必要情報をご入力頂きユーザー登録を完了してください。

<a href="{{ $url }}" class="button button-primary" target="_blank" rel="noopener" style="box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; position: relative; -webkit-text-size-adjust: none; border-radius: 4px; color: #fff; display: inline-block; overflow: hidden; text-decoration: none; background-color: #2d3748; border-bottom: 8px solid #2d3748; border-left: 18px solid #2d3748; border-right: 18px solid #2d3748; border-top: 8px solid #2d3748;">
    {{ $url }}
</a>

なお、URLの有効期限は8時間となります。<br />
URLの有効期限を過ぎると、再登録が必要になりますので、ご注意ください。

※このメールに心当たりがない場合は下記のメールにご連絡ください。

■□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□■

KIKI運営事務局<br />
56@zotman.jp<br />
{{ url('/') }}/

■□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□■
@endcomponent
