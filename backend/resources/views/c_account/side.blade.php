<div class="l-side">
    <div class="l-side-logo">
        <a href="">
            <img src="{{ asset('assets/img/common/logo.svg') }}" alt="ロゴ" />    
        </a>
    </div>
    <nav class="mypage-nav">
        <ul class="mypage-nav-list">
            <li class="mypage-nav-list__item -meeting">
                <a href="/c-account/meeting" class="mypage-nav-list__link">
                    <i class="icon meeting"></i><span>ミーティング</span>
                </a>
            </li>
            <li class="mypage-nav-list__item -search">
                <a href="/c-account/search" class="mypage-nav-list__link">
                    <i class="icon search"></i><span>検索</span>
                </a>
            </li>
            <li class="mypage-nav-list__item -childinfo">
                <a href="/c-account/parent" class="mypage-nav-list__link">
                    <i class="icon parents"></i><span>親情報</span>
                </a>
            </li>
            <li class="mypage-nav-list__item -profile">
                <a href="/c-account/profile" class="user-icon mypage-nav-list__link">
                    <figure>
                        <div class="prof-wrap">
                            <img src="{{ asset('assets/img/avatar/avatar-sample01@2x.png') }}" alt="" />
                        </div>
                    </figure>
                    <span>プロフィール</span>
                </a>
            </li>
            <li class="mypage-nav-list__item -logout">
                <a class="mypage-nav-list__link">
                    <i class="icon log-out"></i><span>ログアウト</span>
                </a>
            </li>
        </ul>
    </nav>
</div>