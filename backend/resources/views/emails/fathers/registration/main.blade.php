@component('mail::message')
# 本登録が完了しました。

サイトへのアカウント本登録が完了しました。

以下のリンクからログインしてくださいませ。

@component('mail::button', ['url' => url('/').'/p-account/login'])
{{ url('/') }}/p-account/login
@endcomponent
@endcomponent
