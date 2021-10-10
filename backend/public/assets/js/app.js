/*
* app.js
*/

// tab change（add class）
$(".tab-label").on("click",function(){
	var $th = $(this).index();
	$(".tab-label").removeClass("is-active");
	$(".meeting-content-wrap").removeClass("is-active");
	$(this).addClass("is-active");
	$(".meeting-content-wrap").eq($th).addClass("is-active");
});

// tab change（link of a tag）
$('.meeting-member-link').on('click', function(e){
  e.stopPropagation();
  e.preventDefault();

  location.href = $(this).attr('data-url');
})

// favorite btn
$(function () {
	$(".like-icon").click(function () {
	  var clazz = $(this).attr('class').replace(/\bicon-star(Fill)?\b/, function (_, p1) {
		return "icon-star".concat(p1 ? '' : 'Fill');
	  });
	  $(this).attr('class', clazz);
	});
  });

// modal tab change
$(function() {
	let tabs = $(".modal-tab-label");
	$(".modal-tab-label").on("click", function() { 
		$(".is-active").removeClass("is-active");
		$(this).addClass("is-active");
		const index = tabs.index(this);
		$(".modal-content").removeClass("is-active").eq(index).addClass("is-active");
	})
});

// 「全員に送信」のチェックボックス
$(function() {
	$('#allmember_send').on('click', function() {
		$("input[name='chk[]']").prop('checked', this.checked);
	});
	$("input[name='chk[]']").on('click', function() {
		if ($('.checkbox-wrap :checked').length == $('.checkbox-wrap :input').length) {
		$('#allmember_send').prop('checked', true);
		} else {
		$('#allmember_send').prop('checked', false);
		}
	});
});

// object-fit for IE
$(function () {
  objectFitImages();
});

