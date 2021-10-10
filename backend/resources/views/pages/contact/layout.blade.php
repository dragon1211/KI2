<!doctype html>
<html lang="ja">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta http-equiv="content-type" charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no,email=no,address=no" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <meta name=”robots” content=”noindex” />
    <!-- favicon -->
    <link rel="icon" type="image/x-icon" href="faviconのパスが入ります" />

    <!-- Android アドレスバーの色 -->
    <meta name="theme-color" content="#ffffff" />

    <!-- iOS ホーム画面 -->
    <link rel="apple-touch-icon" href="Web http://dummydummydummydummydummydummydummy" />
    <meta name="apple-mobile-web-app-title" content="ほげほげ" />

    <!-- Windows ピン留め時の見た目 -->
    <meta name="msapplication-config" content="/config/browserconfig.xml" />

    <title>@yield('title')</title>

    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" rel = "stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}" />
    <link rel="preload" href="{{ asset('assets/css/style.css') }}" as="style">
    

    </head>
    <body class="">
        <main class="l-single-main l-sign-up">
            <div class="l-centeringbox">
                <div class="l-centeringbox-wrap">
                    <div class="l-single-container login-panel">
                        <div class="l-single-inner">
                            @yield('content')
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </body>

    <script src="{{ asset('js/app.js') }}"></script>

</html>
