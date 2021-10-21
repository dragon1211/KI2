@extends('admin.layout')

@section('title', '管理者')

@php 
    $routers = ['meeting', 'child', 'parent'];
    foreach ($routers as $router) {
        if(Request::is('admin/'.$router.'*')) {
            break;
        }
    }
@endphp

@section('content')
<div id="admin-app"></div>
<input type="hidden" id="admin_router" value="{{$router}}" />
@endsection
