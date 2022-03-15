@extends('common.layout')

@section('title', 'KIKI｜子')


@section('content')
    <input type="hidden" id="child_image" value="{{ request()->session()->get('children')['image'] }}" />
@endsection
