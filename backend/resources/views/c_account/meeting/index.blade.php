@extends('c_account.layout')

@section('title', 'ミーティング一覧')

@section('content')
<div id="c-app"></div>
<input type="hidden" id="c_router" value="meeting" />
<input type="hidden" id="child_id" value="1" />
@endsection
