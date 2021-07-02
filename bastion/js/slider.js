                   //<![CDATA[




                   var swiper = new Swiper(".mySwiper", {
                       spaceBetween: 10,
                       slidesPerView: 3,
                       freeMode: true,
                       watchSlidesVisibility: true,
                       watchSlidesProgress: true,
                   });
                   var swiper2 = new Swiper(".mySwiper2", {
                       spaceBetween: 10,
                       navigation: {
                           nextEl: ".card-slider-next",
                           prevEl: ".card-slider-prev",
                       },
                       thumbs: {
                           swiper: swiper,
                       },
                   });






                   $(document).ready(function() {

                       var mainslider = new Swiper('.similar-slider', {
                           slidesPerView: 4,

                           // Responsive breakpoints
                           breakpoints: {
                               // when window width is >= 320px
                               260: {
                                   slidesPerView: 1

                               },
                               580: {
                                   slidesPerView: 2


                               },
                               // when window width is >= 480px
                               880: {
                                   slidesPerView: 3


                               },
                               // when window width is >= 640px
                               1100: {
                                   slidesPerView: 4


                               }
                           },
                           pagination: {
                               el: '.swiper-pagination',
                               type: 'progressbar',
                           },
                           navigation: {
                               nextEl: '.similar-slider-next',
                               prevEl: '.similar-slider-prev',
                           },
                       });




                       const screenWidth = window.screen.width
                       var col = 4;
                       if (screenWidth < 1100) {
                           var col = 3;
                       }

                       if (screenWidth < 880) {
                           var col = 2;
                       }
                       if (screenWidth < 580) {
                           var col = 1;
                       }
                       var parent = document.getElementById("parentId");
                       var nodesSameClass = parent.getElementsByClassName("swiper-slide");

                       var counter = $('.fraction');
                       var currentCount = $('<span class="count"><span class="fraction-now">' + col + '</span><span class="fraction-all">/' + nodesSameClass.length + '</span><span/>');
                       counter.append(currentCount);

                       mainslider.on('transitionStart', function() {


                           var index = this.activeIndex + col,

                               $current = $(".swiper-slide").eq(index),
                               $c_cur = $(".similar-slider-prev"),
                               $c_next = $(".similar-slider-next"),
                               indexx = this.loadPrevNextAmount,

                               dur = 0.8;

                           var prevCount = $('.count');
                           currentCount = $('<span class="count next"><span class="fraction-now">' + index + '</span><span class="fraction-all">/' + nodesSameClass.length + '</span><span/>');
                           counter.html(currentCount);
                       });

                   });