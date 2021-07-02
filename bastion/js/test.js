                   //<![CDATA[

                   $(document).ready(function() {
                       console.log("ready!");

                       const screenWidth = window.screen.width
                       var $range = $(".js-range-slider"),
                           $inputFrom = $(".js-input-from"),
                           $inputTo = $(".js-input-to"),
                           instance,
                           min = 0,
                           max = 15000,
                           from = 0,
                           to = 0;

                       $range.ionRangeSlider({
                           skin: "round",
                           type: "double",
                           min: min,
                           max: max,
                           from: 104,
                           to: 9990,
                           onStart: updateInputs,
                           onChange: updateInputs
                       });
                       instance = $range.data("ionRangeSlider");

                       function updateInputs(data) {
                           from = data.from;
                           to = data.to;

                           $inputFrom.prop("value", from);
                           $inputTo.prop("value", to);
                       }

                       $inputFrom.on("input", function() {
                           var val = $(this).prop("value");

                           // validate
                           if (val < min) {
                               val = min;
                           } else if (val > to) {
                               val = to;
                           }

                           instance.update({
                               from: val
                           });
                       });

                       $inputTo.on("input", function() {
                           var val = $(this).prop("value");

                           // validate
                           if (val < from) {
                               val = from;
                           } else if (val > max) {
                               val = max;
                           }

                           instance.update({
                               to: val
                           });
                       });



                       //]]>



                       $('.minus').click(function() {
                           let $input = $(this).parent().find('input');
                           let count = parseInt($input.val()) - 1;
                           count = count < 1 ? 1 : count;
                           $input.val(count);
                           $input.change();

                       });
                       $('.plus').click(function() {
                           let $input = $(this).parent().find('input');
                           $input.val(parseInt($input.val()) + 1);
                           $input.change();

                       });


                       $("[data-hide-block]").on("click", function(event) {
                           event.preventDefault();

                           var $this = $(this)
                           blockId = $this.data('hide-block')

                           $this.toggleClass("sidebar-categories--activ")
                           $(blockId).slideToggle();

                       });



                       $(window).scroll(function() {
                           if ($(this).scrollTop() > 170) {
                               $('.header__bar').addClass('fixed');
                           } else {
                               $('.header__bar').removeClass('fixed');
                           }
                       });

                       $('.header__toggle').on("click", function(event) {
                           event.preventDefault();
                           $('.header__menu').toggleClass("header__menu--active");
                           $('.overlay').toggleClass("overlay--active");
                           $('.body').toggleClass("body--active");




                       });

                       $('.card__description-uncover').on("click", function(event) {
                           event.preventDefault();
                           $('.card__description-block--full').toggleClass("card__description-block--active");
                           $('.card__description-text').toggleClass("card__description-text--active");



                       });

                       $('.header__panel-btn').on("click", function(event) {
                           event.preventDefault();
                           $('.katalog').toggleClass("katalog--active");
                           $('.header__panel-icon').toggleClass("header__panel-icon--active");
                           $('.header__panel-btn').toggleClass("header__panel-btn--active");
                           $('.header__btn-text').toggleClass("header__btn-text--active");

                           if (screenWidth < 769) {
                               $('.dropdown-content').css("display", "none");
                               $('.katalog__item-container').css("display", "none");
                           };

                       });


                       $(function() {
                           $('.basket-modal').click(function() {
                               $('.modal-basket').addClass('modal--active');
                           });

                           $('.modal_exit').click(function() {
                               $('.modal').removeClass('modal--active');
                           });
                       });

                       $(function() {
                           $('.file-text').click(function() {
                               $('.modal-file').addClass('modal--active');
                           });

                           $('.modal_exit').click(function() {
                               $('.modal-file').removeClass('modal--active');
                           });
                       });

                       $(function() {
                           $('.basket-point').click(function() {
                               $('.modal-point').addClass('modal--active');
                           });

                           $('.modal_exit').click(function() {
                               $('.modal-point').removeClass('modal--active');
                           });
                       });





                       $(function() {
                           $('.header__panel-notification-exit').click(function() {
                               $('.header__panel-notification').removeClass('header__panel-notification--active');
                           });
                       });








                       if (screenWidth < 769) {
                           $(function() {
                               $('.katalog__item-link').click(function() {
                                   $(".katalog__item-link").siblings(".dropdown-content").css("display", "block");
                               });
                               $('.katalog__item-link').click(function() {
                                   $(".katalog__item-link").siblings(".katalog__item-container").css("display", "block");
                               });
                           });

                       }



                       $('.dropdown-content').hover(function() {
                           $(this).siblings(".katalog__item-link").addClass('katalog__item-link--active');
                       }, function() {
                           $(this).siblings(".katalog__item-link").removeClass('katalog__item-link--active');
                       });


                       $('.katalog__item-container').hover(function() {
                           $(this).siblings(".katalog__item-link").addClass('katalog__item-link--active');
                       }, function() {
                           $(this).siblings(".katalog__item-link").removeClass('katalog__item-link--active');
                       });



                   });