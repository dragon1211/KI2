@extends('common.layout')

@section('title', 'KIKI｜PDF')

@section('content')
    <div id="pdf"></div>
    <input type="hidden" value={{ $path }} id="pdf-url">
@endsection