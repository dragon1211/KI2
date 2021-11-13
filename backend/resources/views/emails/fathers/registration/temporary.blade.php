@component('mail::message')
# 仮登録が完了しました。

サイトへのアカウント仮登録が完了しました。

以下のリンクからログインして、本登録を完了させてください。

@component('mail::button', ['url' => url('/').'/p-account/register/'.$token])
{{ url('/') }}/p-account/register/{{ $token }}
@endcomponent
@endcomponent
