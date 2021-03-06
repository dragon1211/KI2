@extends('common.layout')

@section('title', 'KIKI | 親')

@php 
    $sitelink = config('app.site_url');
    $invitelink = url('/c-account/register-temporary?father_id='.request()->session()->get('fathers')['id']);
@endphp

@section('content')
    <input type="hidden" id="father_image" value="{{ request()->session()->get('fathers')['image'] }}" />
    <input type="hidden" id="dd" value="{{ date('y/m/d') }}">
    <input type="hidden" id="siteurl" value="{{ $sitelink }}">
    <input type="hidden" id="inviteurl" value="{{ $invitelink }}">
    <input type="hidden" id="inviteurl_html" value="{{ urlencode($invitelink) }}">
@endsection
