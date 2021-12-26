<!doctype html>
<html lang="ja">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>@yield('title')</title>
        <link rel="shortcut icon" href="{{ asset('assets/img/common/icon.png') }}">

        <!-- iOS -->
        <link rel="apple-touch-icon" href="{{ asset('assets/img/common/apple/Icon-100.png') }}">
        <link rel="apple-touch-icon" sizes="29x29" href="{{ asset('assets/img/common/apple/Icon-29.png') }}">
        <link rel="apple-touch-icon" sizes="40x40" href="{{ asset('assets/img/common/apple/Icon-40.png') }}">
        <link rel="apple-touch-icon" sizes="50x50" href="{{ asset('assets/img/common/apple/Icon-50.png') }}">
        <link rel="apple-touch-icon" sizes="57x57" href="{{ asset('assets/img/common/apple/Icon-57.png') }}">
        <link rel="apple-touch-icon" sizes="58x58" href="{{ asset('assets/img/common/apple/Icon-58.png') }}">
        <link rel="apple-touch-icon" sizes="60x60" href="{{ asset('assets/img/common/apple/Icon-60.png') }}">
        <link rel="apple-touch-icon" sizes="72x72" href="{{ asset('assets/img/common/apple/Icon-72.png') }}">
        <link rel="apple-touch-icon" sizes="76x76" href="{{ asset('assets/img/common/apple/Icon-76.png') }}">
        <link rel="apple-touch-icon" sizes="80x80" href="{{ asset('assets/img/common/apple/Icon-80.png') }}">
        <link rel="apple-touch-icon" sizes="87x87" href="{{ asset('assets/img/common/apple/Icon-87.png') }}">
        <link rel="apple-touch-icon" sizes="100x100" href="{{ asset('assets/img/common/apple/Icon-100.png') }}">
        <link rel="apple-touch-icon" sizes="114x114" href="{{ asset('assets/img/common/apple/Icon-114.png') }}">
        <link rel="apple-touch-icon" sizes="120x120" href="{{ asset('assets/img/common/apple/Icon-120.png') }}">
        <link rel="apple-touch-icon" sizes="144x144" href="{{ asset('assets/img/common/apple/Icon-144.png') }}">
        <link rel="apple-touch-icon" sizes="152x152" href="{{ asset('assets/img/common/apple/Icon-152.png') }}">
        <link rel="apple-touch-icon" sizes="167x167" href="{{ asset('assets/img/common/apple/Icon-167.png') }}">
        <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('assets/img/common/apple/Icon-180.png') }}">
        <link rel="apple-touch-icon" sizes="1024x1024" href="{{ asset('assets/img/common/apple/Icon-1024.png') }}">

        <!-- Android -->
        <link rel="icon" type="image/png" sizes="192x192"  href="{{ asset('assets/img/common/android/Icon-xxxhdpi.png') }}">
        <link rel="icon" type="image/png" sizes="144x144" href="{{ asset('assets/img/common/android/Icon-xxhdpi.png') }}">
        <link rel="icon" type="image/png" sizes="96x96" href="{{ asset('assets/img/common/android/Icon-xhdpi.png') }}">
        <link rel="icon" type="image/png" sizes="72x72" href="{{ asset('assets/img/common/android/Icon-hdpi.png') }}">
        <link rel="icon" type="image/png" sizes="48x48" href="{{ asset('assets/img/common/android/Icon-mdpi.png') }}">
        <link rel="icon" type="image/png" sizes="36x36" href="{{ asset('assets/img/common/android/Icon-ldpi.png') }}">

        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    </head>

    <body>
        @yield('content')
    </body>


    <script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.7/es5-shim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/es5-shim/4.5.7/es5-sham.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/json3/3.3.2/json3.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-shim.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.2/es6-sham.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv-printshiv.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script>
        if (window.Promise === undefined) {
            document.write('<scr'+'ipt src="https://cdnjs.cloudflare.com/ajax/libs/es6-promise/3.2.2/es6-promise.js"></scr'+'ipt>');
        }
    </script>
    <script src="{{ asset('js/app.js') }}"></script>
</html>
