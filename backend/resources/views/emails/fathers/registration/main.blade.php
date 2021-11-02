@component('mail::message')
# 本登録が完了しました。

サイトへのアカウント本登録が完了しました。

以下のリンクからログインしてくださいませ。

@component('mail::button', ['url' => env('APP_URL').'/p-account/login'])
{{ env('APP_URL') }}/p-account/login
@endcomponent
@endcomponent
