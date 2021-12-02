@component('mail::message')
# 【KIKIkan】会員登録のご案内

KIKIkanサービスの会員登録のご案内です。

KIKIkanシステムのご利用ありがとうございます。

※本登録完了後にホーム画面もしくはブックマークに登録してください。<br />
ログインする際に利用します。

下記URLにアクセスし、必要情報をご入力頂き<br />
ユーザー登録を完了してください。

@component('mail::button', ['url' => url('/').'/p-account/register/'.$token])
{{ url('/') }}/p-account/register/{{ $token }}
@endcomponent

なお、URLの有効期限は8時間となります。<br />
URLの有効期限を過ぎると、再登録が必要になりますので、ご注意ください。

※このメールに心当たりがない場合は下記のメールにご連絡ください。

■□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□■

KIKIkan運営事務局<br />
56@zotman.jp<br />
{{ url('/') }}/

■□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□■
@endcomponent
