@extends('p_account.layout')
@section('title', '親')
@php 
    $routers = ['child', 'favorite', 'search', 'profile', 'meeting'];
    foreach ($routers as $router) {
        if(Request::is('p-account/'.$router.'*')) {
            break;
        }
    }
@endphp
@section('content')
<div id="p-app"></div>
<input type="hidden" id="p_router" value="{{$router}}" />
<input type="hidden" id="father_id" value="{{ request()->session()->get('fathers')['id'] }}" />
<input type="hidden" id="father_image" value="{{ request()->session()->get('fathers')['image'] }}" />
@endsection
