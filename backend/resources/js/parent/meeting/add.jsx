import React, { useEffect, useState } from 'react';

const MeetingAdd = () => {
	return (
    <div className="l-content">
      <div className="l-content-w560">
        <div className="l-content__ttl">
          <div className="l-content__ttl__left">
            <h2>ミーティング作成</h2>
          </div>
          <div className="p-notification">
            <div className="p-notification-icon">
              <div className="p-notification-icon-wrap">
                <div className="count">1</div>
                <div className="p-notification-icon-bg"></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.742 19.855" className="icon svg-icon svg-fill svg-y50" ><g fill="none" stroke="#080808" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" data-name="Icon feather-alert-triangle" transform="translate(0.777 0.75)"><path d="M11.188,5.322,2.6,19.659A2.028,2.028,0,0,0,4.334,22.7H21.51a2.028,2.028,0,0,0,1.734-3.042L14.656,5.322a2.028,2.028,0,0,0-3.468,0Z" data-name="パス 3" transform="translate(-2.328 -4.346)"/><path d="M18,13.5v6.91" data-name="パス 4" transform="translate(-7.406 -8.547)"/><path d="M18,25.5h0" data-name="パス 5" transform="translate(-7.406 -11.2)"/></g></svg>
              </div>
            </div>
          </div>
        </div>

        <div className="l-content-wrap">
          <div className="p-article">
            <div className="p-article-wrap">
              <article className="p-article__body">
                <div className="p-article__content">       
                  <div className="p-article__context">
                    <form action="" className="edit-form">
                      <div className="edit-set">
                        <label className="control-label" for="title">タイトル</label>
                        <input type="text" name="title" value="" className="input-default input-title input-h60 input-w480" id="title" />
                      </div>
                      <div className="edit-set">
                        <label className="control-label" for="meeting_textarea">本文</label>
                        <textarea name="data[MeetingContent][description]" rows="8" className="textarea-default" id="meeting_textarea"></textarea>
                      </div>
                      <div className="edit-set edit-set-mt15">
                        <label className="edit-set-file-label" for="file_pdf">
                          PDFアップロード
                          <input type="file" name="file_pdf" accept=".pdf" id="file_pdf" />
                        </label> 
                      </div>
                      <div className="edit-set edit-set-mt15">
                        <label className="edit-set-file-label" for="file_image">
                          画像アップロード
                          <input type="file" name="file_image" accept=".png, .jpg, .jpeg" id="file_image" /> 
                        </label>
                      </div>
                      
                      <div className="p-file-image">
                        <figure></figure>
                        <figure></figure>
                        <figure></figure>
                        <figure></figure>
                        <figure></figure>
                        <figure></figure>
                        <figure></figure>
                        <figure></figure>
                        <figure></figure>
                        <figure></figure>
                      </div>

                      <div className="edit-set edit-set-send">
                        <label for="allmember_send">
                        <input className="boolean optional" type="checkbox" name="allmember_send" id="allmember_send" />全員に送信</label>
                      </div>

                      <div className="edit-set-mt5 edit-set-send">
                        <label for="pickup_send">
                        <input className="boolean optional" type="checkbox" name="pickup_send" id="pickup_send" />選んで送信</label>
                      </div>

                      <button type="button" className="btn-edit btn-default btn-h70 btn-r14 btn-yellow">本登録</button>
                    </form>
                  </div>     
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>    
	)
}

export default MeetingAdd;