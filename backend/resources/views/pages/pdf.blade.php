@extends('common.layout')

@section('title', 'KIKI｜PDF')

@section('content')
    <div id="pdf-preview"></div>
    <input type="hidden" value={{ $path }} id="pdf-url">
@endsection