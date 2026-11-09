$(document).ready(function(){

    // 햄버거 메뉴 열기
    $(".h-open").click(function(){
        $(".ham-menu").addClass("on");
    });

    // 햄버거 메뉴 닫기
    $(".h-close").click(function(){
        $(".ham-menu").removeClass("on");
    });

// ----메인컷 자동 변환 --------------------

    let showNext = false;

        setInterval(function(){

            if($(window).width() >= 768){

                showNext = !showNext;

                $(".cut-item .next").toggleClass("on", showNext);

            }else{

                showNext = false;

                $(".cut-item .next").removeClass("on");

            }

        }, 3000);






// ----콘텐츠2--------------------

    function showLook() {
    let scroll = $(window).scrollTop();
    let windowHeight = $(window).height();
    let sectionTop = $(".cont1").offset().top;
    let sectionHeight = $(".cont1").outerHeight();

    if (
        scroll + windowHeight * 0.5 >= sectionTop &&
        scroll + windowHeight * 0.5 < sectionTop + sectionHeight
    ) {
        $(".l-cap, .l-outer, .l-shoes").addClass("on");
    } else {
        $(".l-cap, .l-outer, .l-shoes").removeClass("on");
    }
}


$(window).on("scroll", showLook);

showLook();




// ---- 콘텐츠 1 상세컷 연결선 ----
const $lookVisual = $(".cont1 .look-visual");
const lookVisual = $lookVisual[0];

if (lookVisual && $lookVisual.find(".look-guide").length) {
    const lookConnections = [
        { card: ".l-cap", line: ".look-guide-cap line", x: 0, y: 0 },
        { card: ".l-outer", line: ".look-guide-outer line", x: 1, y: 0 },
        { card: ".l-shoes", line: ".look-guide-shoes line", x: 0, y: 1 }
    ];

    function updateLookGuides() {
        const width = lookVisual.clientWidth;
        const height = lookVisual.clientHeight;

        if (!width || !height) return;

        lookConnections.forEach(function (connection) {
            const card = $lookVisual.find(connection.card)[0];
            const x = card.offsetLeft + card.offsetWidth * connection.x;
            const y = card.offsetTop + card.offsetHeight * connection.y;

            $lookVisual.find(connection.line).attr({
                x2: x / width * 1000,
                y2: y / height * 1000
            });
        });
    }

    const lookGuideObserver = new ResizeObserver(updateLookGuides);
    lookGuideObserver.observe(lookVisual);

    $lookVisual.find(".l-cap, .l-outer, .l-shoes").each(function () {
        lookGuideObserver.observe(this);
    });

    updateLookGuides();
}








// ---- 콘텐츠 3 상품 카드 연속 슬라이드 ----
const $proList = $(".cont3 .product-slider > .pro-list");
const proList = $proList[0];
const proTablet = window.matchMedia("(min-width: 768px)");
const proReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (proList && proList.children.length > 1) {
    const $originalCards = $proList.children("li");
    const speed = 48; // 초당 45px. 숫자가 클수록 빨라짐
    let $copies = $();
    let loopWidth = 0;
    let position = 0;
    let lastTime = null;

    let proDrag = null;

$proList.on("pointerdown", function (event) {
    const pointer = event.originalEvent;

    if (
        !proTablet.matches ||
        pointer.pointerType !== "mouse" ||
        pointer.button !== 0 ||
        event.target.closest("button, a")
    ) {
        return;
    }

    event.preventDefault();

    proDrag = {
        pointerId: pointer.pointerId,
        startX: pointer.clientX,
        startScroll: proList.scrollLeft
    };

    proList.setPointerCapture(pointer.pointerId);
    $proList.addClass("is-dragging");
});

$proList.on("pointermove", function (event) {
    const pointer = event.originalEvent;

    if (!proDrag || pointer.pointerId !== proDrag.pointerId) {
        return;
    }

    const distance = pointer.clientX - proDrag.startX;
    proList.scrollLeft = proDrag.startScroll - distance;
});

$proList.on("pointerup pointercancel lostpointercapture", function (event) {
    if (!proDrag || event.originalEvent.pointerId !== proDrag.pointerId) {
        return;
    }

    position = proList.scrollLeft;
    proDrag = null;
    $proList.removeClass("is-dragging");
});

    function prepareProLoop() {
        $copies.remove();
        $copies = $();
        loopWidth = 0;
        position = 0;
        lastTime = null;
        proList.scrollLeft = 0;

        if (!proTablet.matches || proReducedMotion.matches) {
            return;
        }

        // 마지막 카드 뒤에 첫 카드부터 다시 이어 붙이기
        $copies = $originalCards.clone()
            .attr({ "aria-hidden": "true", inert: "" })
            .appendTo($proList);

        loopWidth = $copies[0].getBoundingClientRect().left
            - $originalCards[0].getBoundingClientRect().left;
    }

    function moveProCards(now) {
        const elapsed = lastTime === null ? 0 : Math.min(now - lastTime, 50);
        lastTime = now;

        if (
            loopWidth > 0 &&
            !proDrag &&
            !document.hidden &&
            !proList.querySelector("li:hover") &&
            !proList.matches(":focus-within")
        ) {
            position = (position + speed * elapsed / 1000) % loopWidth;
            proList.scrollLeft = position;
        } else {
            // 멈춘 동안 직접 스크롤했다면 그 위치에서 이어서 시작
            position = proList.scrollLeft;
        }

        requestAnimationFrame(moveProCards);
    }

    prepareProLoop();
    $(window).on("resize", prepareProLoop);
    proReducedMotion.addEventListener("change", prepareProLoop);
    requestAnimationFrame(moveProCards);
}

// 하트 클릭시 빨간하트 나타내기
$(".cont3 .pro-list").on("click", ".heart", function () {
    const $heart = $(this);
    const nextLiked = $heart.attr("aria-pressed") !== "true";

    $heart.attr("aria-pressed", String(nextLiked));
    $heart.find("img").attr(
        "src",
        nextLiked
            ? "images/section3_heart_2.png"
            : "images/section3_heart_1.png"
    );
});












// ---- 콘텐츠 4 버튼 클릭 상태 전환 ----
$(".cont4 .vaider-btn").on("click", function () {
    const isPressed = $(this).attr("aria-pressed") === "true";
    $(this).attr("aria-pressed", isPressed ? "false" : "true");
});













});