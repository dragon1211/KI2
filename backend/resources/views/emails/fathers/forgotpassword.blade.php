@component('mail::message')
# パスワードリセットを依頼しました。

サイトへのパスワードリセットを依頼しました。

以下のリンクからパスワードを再設定してください。

@component('mail::button', ['url' => url('/').'/p-account/forgot-password/reset/'.$token])
{{ url('/') }}/p-account/forgot-password/reset/{{ $token }}
@endcomponent
@endcomponent
