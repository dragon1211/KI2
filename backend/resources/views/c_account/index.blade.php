@extends('c_account.layout')

@section('title', '子')

@php 
    $routers = ['meeting', 'parent', 'search', 'profile'];
    foreach ($routers as $router) {
        if(Request::is('c-account/'.$router.'*')) {
            break;
        }
    }
@endphp

@section('content')
<div id="c-app"></div>
<input type="hidden" id="c_router" value="{{$router}}" />
<input type="hidden" id="child_id" value="1" />
@endsection
