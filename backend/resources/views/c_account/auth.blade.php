@extends('common.layout')

@section('title', 'KIKI｜子')

@section('content')
<div id="c-auth"></div>

@if (Request::is('c-account/register-temporary'))
    <input type="hidden" value={{ $father_id }} id="father_token">
@endif

@endsection